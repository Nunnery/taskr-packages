const path = require('path');
const pp = require('preprocess');

function getExtension(filename) {
  const ext = path.extname(filename).split('.');
  return ext[ext.length - 1];
}

// eslint-disable-next-line require-yield
function* preprocess(file, options) {
  const opts = Object.assign({}, options);
  const context = Object.assign({}, process.env, opts);

  context.src = file.base;
  context.srcDir = file.dir;
  context.NODE_ENV = context.NODE_ENV || 'development';

  const contents = file.data.toString('utf8');
  const extension = !opts.extension
    ? getExtension(context.src)
    : opts.extension;

  const processedContents = pp.preprocess(contents, context, extension);

  // eslint-disable-next-line no-param-reassign
  file.data = Buffer.from(processedContents);
}

module.exports = task => {
  task.plugin('preprocess', {}, preprocess);
};
