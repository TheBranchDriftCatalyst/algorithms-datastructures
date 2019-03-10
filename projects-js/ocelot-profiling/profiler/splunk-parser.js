import { reverse, toNumber, map, trim, uniqueId, uniq, includes, reduce, get, set, noop, find, flow } from 'lodash';
import { DateTime } from 'luxon';
import {
  partition as fpPartition,
  map as fpMap,
  groupBy as fpGroupBy,
  sortBy as fpSortBy,
  reduce as fpReduce
  // filter as fpFilter
} from 'lodash/fp';
import { debug as _debug, genShortTraceId } from './_utils';

const debug = _debug.extend('splunk-parser');
// NOTE: don't use /g for these, except the last one
export const profileMatcher = /(\[PROFILE SUMMARY\])/;
export const sfFieldsMatcher = /(?:sf_)(\w+)(?:=)([\w.\-:{'[ \](),\\"=><}/*+]+)/g;

const efDebug = debug.extend('extractFields');
export const extractFieldsFromLine = str => {
  // Most of this is to allow for grabbing the JSON rhino formula from the sf_fields
  let cursorResults;
  const resultsObj = {};
  const errors = [];
  /* eslint-disable  no-cond-assign */
  while ((cursorResults = sfFieldsMatcher.exec(str)) !== null) {
    const fieldName = trim(cursorResults[1]);
    let fieldValue = trim(cursorResults[2]);
    switch (fieldName) {
      case 'query':
      case 'request':
      case 'query_payload':
        try {
          const parsedJson = JSON.parse(fieldValue.replace(/'/g, '"'));
          fieldValue = parsedJson;
          efDebug('MATCHED %s = %O', fieldName, fieldValue);
        } catch (e) {
          // console.error('could not parse JSON Response', e);
          errors.push(fieldName);
          efDebug('FAILED MATCHED %s = %s', fieldName, fieldValue);
        }
        break;
      case 'profile_time':
      case 'response_size':
        fieldValue = toNumber(fieldValue);
        efDebug('MATCHED %s = %s', fieldName, fieldValue);
        break;
      default:
        noop();
    }
    resultsObj[fieldName] = fieldValue;
  }

  const initiativeMatcher = /initiative_id == '(.+)' /;
  if (resultsObj.query && resultsObj.service_name === 'rhino' && initiativeMatcher.test(resultsObj.query)) {
    efDebug('Log from RHINO is being processed to extract initiative id');
    const initiativeId = resultsObj.query.match(initiativeMatcher)[1];
    resultsObj.initiativeId = initiativeId;
    delete resultsObj.query;
  }
  /* eslint-enable  no-cond-assign */
  return [resultsObj, errors];
};

const flatten = (obj, prefix = '') =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[k] === 'object') Object.assign(acc, flatten(obj[k], pre + k));
    else acc[pre + k] = obj[k];
    return acc;
  }, {});

function unflatten(data) {
  const result = {};
  for (var i in data) {
    var keys = i.split('.');
    keys.reduce(function(r, e, j) {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : []);
    }, result);
  }
  return result;
}

/**
 * We are going to construct the following
 * {
 *    type: 'profile|subprofile',
 *    service: 'serviceName,
 *    fields: {...}'
 * }
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
const pDebug = debug.extend('parser');
export const cleanAndExtractFields = data => {
  let parsingErrors = [];
  const parsedData = map(data, ({ result: { line } = {}, ...all } = {}) => {
    if (!line) {
      pDebug('Could not parse line - no line on raw sample object - %O', all);
    }
    let isTraceRoot = false;
    if (profileMatcher.test(line)) {
      isTraceRoot = true;
    }
    pDebug('reading line - root=%s', isTraceRoot);
    pDebug(line);
    const [fields, _errors] = extractFieldsFromLine(line);
    parsingErrors = parsingErrors.concat(_errors);
    fields.trace_id = genShortTraceId(fields.trace_id);
    fields.service_name = fields.service_name || 'View Endpoint';
    return {
      id: isTraceRoot ? fields.trace_id : uniqueId(`${fields.trace_id}-`),
      isRoot: isTraceRoot,
      ...flatten(fields)
    };
  });
  pDebug('%s Parsing Errors Present', parsingErrors.length);
  pDebug('Parsing Errors For the following fields %O', uniq(parsingErrors));
  return parsedData;
};

export const createTraceIdGroups = flow([
  fpGroupBy('trace_id'),
  fpMap(fpPartition('isRoot')),
  fpMap(([[root], [...others]]) => {
    return {
      ...root,
      children: flow([
        fpMap(({ ts, profile_time, ...rest }, idx) => {
          return {
            start: DateTime.fromISO(ts).minus({ seconds: profile_time }),
            end: DateTime.fromISO(ts),
            profile_time,
            ...rest
          };
        }),
        fpSortBy(v => v.start),
        reverse
      ])(others)
    };
  })
]);

const normDebug = debug.extend('normalizer');
export const normalizeAllTraceSamples = flow([
  createTraceIdGroups,
  fpReduce((arr, { children, id, trace_id, ...xdata }) => {
    // normDebug('BOOM TIME - %O', { children, xdata });
    const initiativeId = get(find(children, { service_name: 'rhino' }), 'initiativeId');
    if (!initiativeId) {
      normDebug('WARNING - initiative ID could not be determined for trace_id %s', trace_id);
    } else {
      normDebug('SUCCESS - initiative ID %s could be determined for trace_id %s', initiativeId, trace_id);
    }
    return arr.concat(
      map(children, v => ({
        ...v,
        ...reduce(
          xdata,
          (obj, vv, k) => {
            if (k === 'profile_time' || k === 'response_size') {
              k = `total_${k}`;
            } else if (includes(['isRoot', 'service_name'], k) || /^\w+_\d+_profile_time$/.test(k)) {
              return obj;
            }
            obj[k] = vv;
            return obj;
          },
          { initiativeId }
        )
      }))
    );
  }, []),
  fpMap(sample => {
    if (sample['request.start_date'] && sample['request.start_date']) {
      const start = DateTime.fromMillis(toNumber(sample['request.start_date']) * 1000);
      const end = DateTime.fromMillis(toNumber(sample['request.end_date']) * 1000);
      sample['request.days'] = Math.round(end.diff(start, 'days').days);
    } else {
      normDebug('WARNING - Sample does not have a request.start or request.end - %O', sample);
    }
    // delete sample.start;
    // delete sample.end;
    const cleanSample = unflatten(sample);
    cleanSample.requestedDays = cleanSample.request?.days || 0;
    cleanSample.requestHasAdId =
      includes(cleanSample.request?.dimensions || [], 'identifiers.id') ||
      includes(cleanSample.request?.dimensions || [], 'adset.id');
    delete cleanSample.request;
    return cleanSample;
  })
]);

export const createServiceGroups = fpGroupBy('service_name');
