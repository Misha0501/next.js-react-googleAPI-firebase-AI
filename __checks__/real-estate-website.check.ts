/**
* This is a Checkly CLI BrowserCheck construct. To learn more, visit:
* - https://www.checklyhq.com/docs/cli/
* - https://www.checklyhq.com/docs/cli/constructs-reference/#browsercheck
*/

import { BrowserCheck, CheckGroup, Frequency, RetryStrategyBuilder } from "checkly/constructs";

const group = new CheckGroup('check-group-11', {
  name: 'Group main functionality',
  activated: true,
  frequency: Frequency.EVERY_15M,
  locations: ['us-east-1', 'eu-west-1'],
  tags: ['api-group'],
  concurrency: 10,
  browserChecks: {
    frequency: Frequency.EVERY_30M,
    testMatch: '*.spec.js'
  }
})

// new BrowserCheck('real-estate-website', {
//   name: 'real-estate-website',
//   activated: true,
//   muted: false,
//   shouldFail: false,
//   locations: ['eu-central-1', 'eu-west-2'],
//   tags: [],
//   sslCheckDomain: '',
//   frequency: Frequency.EVERY_24H,
//   environmentVariables: [],
//   code: {
//     entrypoint: './real-estate-website.spec.ts',
//   },
//   retryStrategy: RetryStrategyBuilder.fixedStrategy({
//     baseBackoffSeconds: 0,
//     maxRetries: 1,
//     maxDurationSeconds: 600,
//     sameRegion: false,
//   }),
// })
