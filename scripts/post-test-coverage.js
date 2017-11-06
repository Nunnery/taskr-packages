'use strict';

const combine = require('istanbul-combine');
const fs = require('fs-extra');

fs.emptyDirSync('coverage');

const opts = {
  dir: 'coverage',
  pattern: 'packages/*/coverage/*.json',
  print: 'summary',
  reporters: {
    cobertura: {},
    json: {},
    html: {},
    lcov: {}
  }
};
combine.sync(opts);
