'use strict';

const join = require('path').join;
const Taskr = require('taskr');
const test = require('tape');

const dir = join(__dirname, 'fixtures');
const tmp = join(__dirname, '.tmp');
const plugins = [require('@taskr/clear'), require('../')];
const create = tasks => new Taskr({ tasks, plugins });

test('taskr-preprocess', t => {
  t.plan(7);

  const srcA = `${dir}/a.js`;
  const srcB = `${dir}/b.js`;

  const taskr = create({
    *a(f) {
      t.ok('preprocess' in taskr.plugins, 'add the preprocess plugin');

      yield f.clear(tmp);
    },
    *b(f) {
      yield f
        .source(srcA)
        .preprocess({ FOO: 'FOOBAR' })
        .target(tmp);

      const str = yield f.$.read(`${tmp}/a.js`, 'utf8');
      t.ok(str.length, 'file was written');
      t.true(str.includes("'FOOBAR'"), 'template must include /* @echo FOO */');
      yield f.clear(tmp);
    },
    *c(f) {
      yield f
        .source(srcB)
        .preprocess({})
        .target(tmp);

      const str = yield f.$.read(`${tmp}/b.js`, 'utf8');
      t.ok(str.length, 'file was written');
      t.false(
        str.includes('someDebuggingCall(configValue);'),
        'template only allows method if DEBUG is defined'
      );

      yield f.clear(tmp);
    },
    *d(f) {
      yield f
        .source(srcB)
        .preprocess({ DEBUG: true })
        .target(tmp);

      const str = yield f.$.read(`${tmp}/b.js`, 'utf8');
      t.ok(str.length, 'file was written');
      t.true(
        str.includes('someDebuggingCall(configValue);'),
        'template allows method if DEBUG is defined'
      );

      yield f.clear(tmp);
    }
  });
  taskr.serial(['a', 'b', 'c', 'd']);
});
