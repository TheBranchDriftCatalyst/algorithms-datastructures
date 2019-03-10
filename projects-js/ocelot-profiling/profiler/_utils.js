import Debug from 'debug';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';
import { toNumber, map, compact, memoize, reduce } from 'lodash';
import { map as fpMap } from 'lodash/fp';
import {
  min,
  max,
  mean,
  mode,
  median,
  geometricMean,
  harmonicMean,
  variance,
  standardDeviation,
  interquartileRange
  // sampleCorrelation,
  // sampleCovariance
} from 'simple-statistics';
import { json2csv } from 'json-2-csv';

/**
 * [debug description]
 * @type {[type]}
 */
export const debug = Debug('ocelot-profiler');

const utilDebug = debug.extend('utils');

/**
 * [writeFileLocally description]
 * @param  {[type]} fileName [description]
 * @param  {[type]} data     [description]
 * @return {[type]}          [description]
 */
export const writeFileLocally = (fileName, data, { folder }) => {
  const OUTPUT_PATH = path.join(folder, 'output');
  mkdirp(OUTPUT_PATH, err => {
    // fix me
    if (err) {
      console.error('Could not save CSV File', err);
    }
    fs.writeFile(`${OUTPUT_PATH}/${fileName}.json`, JSON.stringify(data, null, 4), _err => {
      if (_err) {
        console.error(_err);
        return;
      }
      console.info('File has been created at ', `${OUTPUT_PATH}/${fileName}`);
    });
  });

  json2csv(data, (err, csv) => {
    mkdirp(OUTPUT_PATH, _ => {
      // fix me
      if (err) {
        console.error('Could not save CSV File', err);
      }
      fs.writeFile(`${OUTPUT_PATH}/${fileName}.csv`, csv, _err => {
        if (_err) {
          console.error(_err);
          return;
        }
        console.info('File has been created at', `${OUTPUT_PATH}/${fileName}`);
      });
    });
  });
};

function* idMaker() {
  let index = 0;
  while (true) yield index++;
}
const idGen = idMaker();
/**
 * [idMaker description]
 * @return {Generator} [description]
 */
export const genShortTraceId = memoize(_ => String(idGen.next().value));

/**
 * [columnCfgs description]
 * @type {Object}
 */
export const columnCfgs = {
  id: {
    hide: true
  },
  isRoot: {
    hide: true
  },
  service_name: {},
  ts: {
    hide: true
  },
  profile_time: {
    formatter: 'seconds'
  },
  trace_id: {
    order: 1
  },
  query: {
    hide: true
  },
  response_size: {
    formatter: 'bytes'
  },
  total_events: {},
  request: {
    hide: true
  },
  mongoose_0_profile_time: {
    hide: true
  }
  // mongoose_1_profile_time: { hide: true },
  // rhino_2_profile_time: { hide: true },
  // rhino_3_profile_time: { hide: true },
  // rhino_0_profile_time: { hide: true },
  // rhino_1_profile_time: { hide: true },
  // query_payload: { hide: true },
  // ad_id_count: { hide: true },
  // adset_id_count: { hide: true },
  // impala_1_profile_time: { hide: true },
  // augment_view_response_with_impala_2_profile_time: { hide: true },
  // augment_view_response_with_impala_3_profile_time: { hide: true },
  // mongoose_4_profile_time: { hide: true },
  // mongoose_5_profile_time: { hide: true },
  // rhino_6_profile_time: { hide: true },
  // impala_3_profile_time: { hide: true },
  // augment_view_response_with_impala_4_profile_time: { hide: true },
  // rhino_5_profile_time: { hide: true },
  // rhino_4_profile_time: { hide: true },
  // augment_view_response_with_impala_1_profile_time: { hide: true },
  // mongoose_3_profile_time: { hide: true },
  // augment_view_response_with_impala_5_profile_time: { hide: true }
};

// Stats functions
const SUM_STAT_FUNCS = [
  [min, 'min'],
  [max, 'max'],
  [mean, 'mean'],
  [mode, 'mode'],
  [median, 'median'],
  [geometricMean, 'geometricMean'],
  [harmonicMean, 'harmonicMean'],
  [variance, 'variance'],
  [standardDeviation, 'standardDeviation'],
  [interquartileRange, 'interquartileRange'],
  [v => compact(v).map(_v => toNumber(_v)), 'allSamples']
];

const runStatsOnField = arr =>
  reduce(SUM_STAT_FUNCS, (b, [func = v => v, statName]) => ({ ...b, [statName]: func(arr) }), {});

// Covariance between sample size and profile_time, might not do this
// const COMPARATIVE_STAT_FUNCS = [sampleCorrelation, sampleCovariance];

/**
 * [getServiceStats description]
 * @param  {[type]} serviceGroups [description]
 * @return {[type]}               [description]
 */
export const getServiceStats = serviceGroups => {
  // non string, json shit query_payload, query
  const statKeys = ['response_size', 'profile_time', 'total_events'];
  return reduce(
    serviceGroups,
    (b, samples, svcName) => {
      b[svcName] = {
        service: svcName,
        ...reduce(
          statKeys,
          (bb, fieldName) => ({
            ...bb,
            [fieldName]: runStatsOnField(samples.map(v => v[fieldName]))
          }),
          {}
        )
      };
      return b;
    },
    {}
  );
};

export const rebuildTimelineFromTraceGroups = fpMap(({ children: [psuedoRoot, ...others], ...xdata }) => {
  // NOTE: calling this psuedoRoot, because it's the first timestamp we
  // have that we can relate the others to, ie, sample.children[0]
  // so we need to calculate the seconds between each subsequent sample and the root
  psuedoRoot.y = 1;
  psuedoRoot.x = 0;
  psuedoRoot.x2 = psuedoRoot.end.diff(psuedoRoot.start, 'seconds').seconds;
  const data = {
    children: [
      psuedoRoot,
      ...map(others, v => {
        v.x = psuedoRoot.start.diff(v.start, 'seconds').seconds;
        v.start = v.start.toJSDate();
        v.end = v.end.toJSDate();
        v.x2 = v.x + v.profile_time;
        v.y = 'this_gets_added_in_the_controller';
        return v;
      })
    ],
    ...xdata
  };
  return data;
});
