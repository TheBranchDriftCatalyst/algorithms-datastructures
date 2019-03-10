/* eslint-disable no-unused-vars */
import path from 'path';
import { flow, forEach, snakeCase } from 'lodash';
import prodV0Data from './datasets/prod-v0.json';
import sbxPost from './datasets/sbx-post.json';
import sbxPre from './datasets/sbx-pre.json';
import { writeFileLocally, debug, rebuildTimelineFromTraceGroups } from './_utils';
import { normalizeAllTraceSamples, createTraceIdGroups, cleanAndExtractFields } from './splunk-parser';

// index=sandbox ampush/ocelot:feat_view_optimization PROFILE
// index=sandbox ampush/ocelot:fix_log-tracer and PROFILE,
// index=prod "ocelot:v3.6.2" NOT consul NOT registrator AND PROFILE
export const main = () => {
  const sampleSets = {
    prodV0Data,
    sbxPost,
    sbxPre
  };

  forEach(sampleSets, (samples, sampleSetName) => {
    const cleaned = flow([cleanAndExtractFields, normalizeAllTraceSamples])(samples);
    writeFileLocally(`${snakeCase(sampleSetName)}-normalized`, cleaned, {
      folder: `${path.dirname(__dirname)}/profiler`
    });
  });
};

main();
