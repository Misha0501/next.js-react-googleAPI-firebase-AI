/**
* This is a Checkly CLI BrowserCheck construct. To learn more, visit:
* - https://www.checklyhq.com/docs/cli/
* - https://www.checklyhq.com/docs/cli/constructs-reference/#browsercheck
*/

import { BrowserCheck, CheckGroup, Frequency, RetryStrategyBuilder } from "checkly/constructs";

const group = new CheckGroup('check-group-11', {
  name: 'Group main functionality',
  activated: true,
  frequency: Frequency.EVERY_24H,
  locations: ['us-east-1', 'eu-west-1'],
  tags: ['api-group'],
  concurrency: 10,
  browserChecks: {
    frequency: Frequency.EVERY_24H,
    testMatch: '*.spec.js'
  }
})
