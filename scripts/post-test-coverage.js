'use strict';

const combine = require('istanbul-combine');
const execa = require('execa');
const fs = require('fs-extra');

fs.emptyDirSync('coverage');

const opts = {
  dir: 'coverage',
  pattern: 'packages/*/coverage/*.json',
  print: 'detail',
  reporters: {
    cobertura: {},
    json: {},
    html: {},
    lcov: {}
  }
};
combine.sync(opts);

if (process.env.CI) {
  execa.sync('codecov');
}
