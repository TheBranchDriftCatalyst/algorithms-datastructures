import { omit, zipObject, has, flatMapDeep, get, take, includes, filter, sampleSize } from 'lodash';
import axios from 'axios';
import Promise from 'bluebird';
// import sizeof from 'object-sizeof';
import path from 'path';
import Debug from 'debug';
import { performance as perf } from 'perf_hooks';
import { writeFileLocally } from '../profiler/_utils';
import { DATE_PRESETS } from './utils';
// Datasets
// import sbxStarzViews from './saved-views/sbx-starz-views';
import madhuriViews from './saved-views/madhuri-views';
// import sbxEsuranceViews from './saved-views/sbx-esurance-us-auto';
// import AUTH_TOKEN from './authToken';

/* eslint-disable camelcase */

const _d = Debug('shotgun');
const mainDebug = _d.extend('main');
const BASE_SBX_URL = 'https://www-sandbox.sandbox-amp.net';

const C_CONFIG = {
  saveAs: `madhuri-pre`,
  dryRun: false,
  noDerivedViews: true,
  views: madhuriViews,
  baseUrl: BASE_SBX_URL,
  postOznMode: false,
  iStratPct: 0.3
};

// axios.defaults.headers.common.Authorization = `Bearer ${AUTH_TOKEN}`;
axios.defaults.timeout = 5 * 60000; // 5min in MS

const IMPALA_DIMS = {
  'identifiers.id': ['bid', 'ad.effective_status'],
  'identifiers.adset_id': ['adset.budget.daily', 'adset.bid.amount', 'adset.effective_status']
};

const prepDebug = _d.extend('prepper');
const prepViews = (views, { iStrat, iStratPct, noTree }) => {
  prepDebug('Prepping views with following settings - iStrat=%s, iStratPct=%s noTree=%s', iStrat, iStratPct, noTree);
  const prepedViews = flatMapDeep(
    views,
    ({
      initiative_id = '55026d16-a956-466d-a97f-c88c35e1972d', // gets removed in the iterator
      view_name, // also gets removed from call
      adclusters,
      breakdown,
      dimensions,
      end_date,
      start_date,
      grid_metrics = [],
      filters,
      metrics,
      tz_name = 'America/Los_Angeles',
      preset_date_range
    }) => {
      if (preset_date_range && preset_date_range !== 'custom' && DATE_PRESETS[preset_date_range]) {
        prepDebug('Preset range found in view, fixing this - %s', preset_date_range);
        const dates = DATE_PRESETS[preset_date_range].getDates();
        end_date = Math.floor(dates.endDate.getTime() / 1000);
        start_date = Math.floor(dates.startDate.getTime() / 1000);
      }
      return noTree
        ? {
            dimensions,
            view_name: `${view_name}`,
            grid_metrics,
            breakdown,
            adclusters,
            end_date,
            start_date,
            filters,
            metrics,
            tz_name,
            initiative_id,
            nocache: true
          }
        : dimensions.map((_, idx) => ({
            dimensions: take(dimensions, idx + 1),
            view_name: `${view_name} ${idx}`,
            grid_metrics,
            breakdown,
            adclusters,
            end_date,
            start_date,
            filters,
            metrics,
            tz_name,
            initiative_id,
            nocache: true
          }));
    }
  );
  // Now add the impala dimensions if necessary
  if (iStrat) {
    const samplesWithSentinel = filter(
      prepedViews,
      ({ dimensions = [] } = {}) =>
        includes(dimensions, 'identifiers.id') || includes(dimensions, 'identifiers.adset_id')
    );
    const modifySampleCount = Math.floor(samplesWithSentinel.length * iStratPct);
    prepDebug(
      `There are a total of %s views, of those views %s have ad.id or adset.id`,
      prepedViews.length,
      samplesWithSentinel.length
    );
    prepDebug(
      `Modifying %s (%s of views with ad.id or adset.id) views with impala dimensions`,
      modifySampleCount,
      `${iStratPct * 100}%`
    );
    sampleSize(samplesWithSentinel, modifySampleCount).forEach(v => {
      if (includes(v.dimensions, 'identifiers.id')) {
        v.dimensions.push(...IMPALA_DIMS['identifiers.id']);
      }
      if (includes(v.dimensions, 'identifiers.adset_id')) {
        v.dimensions.push(...IMPALA_DIMS['identifiers.adset_id']);
      }
    });
  }

  return prepedViews;
};

const login = async () => {
  mainDebug('Logging in');
  return axios
    .post('https://www-sandbox.sandbox-amp.net/v1/account/auth/login', {
      user_name: 'onboard_admin@ampush.com',
      user_password: 'QW1wdXNoMTIz'
    })
    .then(({ data: { jwt_token } }) => {
      axios.defaults.headers.common.Authorization = `Bearer ${jwt_token}`;
      mainDebug('Login Completed token below');
      mainDebug(jwt_token);
    })
    .catch(e => {
      mainDebug('could not login, %O', e);
    });
};

const main = async ({ saveResultsAs }) => {
  const REPORT = [];

  await login();

  mainDebug('------------------------CONFIGURATION------------------------');
  mainDebug('Configuration \n %O', omit(C_CONFIG, 'views'));

  const prepedViews = prepViews(C_CONFIG.views, {
    iStratPct: C_CONFIG.iStratPct,
    iStrat: C_CONFIG.postOznMode,
    noTree: C_CONFIG.noDerivedViews
  });
  mainDebug('------------------------Begining Procedure------------------------');
  mainDebug('Will send %s requests', prepedViews.length);
  mainDebug('Starting at ', new Date());
  mainDebug('------------------------Begining Procedure------------------------');
  const tt0 = perf.now();
  !C_CONFIG.dryRun &&
    (await Promise.each(prepedViews, ({ view_name = 'no-view-name', initiative_id, ...view }, idx) => {
      const requestUrl = `${C_CONFIG.baseUrl}/v1/analysis/initiative/${initiative_id}/view/`;
      mainDebug('Sending request - %s', requestUrl);
      mainDebug('%j', view);
      const t0 = perf.now();
      return new Promise((res, rej) => {
        return axios
          .post(requestUrl, view)
          .then(response => {
            if (has(response, ['data', 'error_message'])) {
              rej(response.data);
            } else {
              res(response.data);
            }
          })
          .catch(error => {
            rej(error);
          });
      })
        .then(resp => {
          mainDebug('SUCCESS CALL %s', idx);
          const rows = get(resp, 'grid.rows', null);
          if (!rows) {
            mainDebug(`resp ${idx} did not return any rows`);
          }
          REPORT[idx] = ['success', view_name, (perf.now() - t0) / 1000, resp.grid?.rows?.length];
        })
        .catch(err => {
          mainDebug('FAILED CALL %s - %o', idx, err);
          REPORT[idx] = ['failure', view_name, (perf.now() - t0) / 1000, null];
        })
        .finally(() => {
          mainDebug('sample ^^ %o', REPORT[idx]);
        });
    }));
  mainDebug('total precdure took %s consecutive seconds', (perf.now() - tt0) / 1000);
  !C_CONFIG.dryRun &&
    writeFileLocally(
      saveResultsAs,
      REPORT.map(resultsArr => zipObject(['status', 'sv_name', 'call_time', 'resp_size'], resultsArr)),
      { folder: `${path.dirname(__dirname)}/shotgun` }
    );
};

main({
  saveResultsAs: C_CONFIG.saveAs
});
