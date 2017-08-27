const { resolve: resolvePath } = require('path');
const glob = require('glob');
const loaderUtils = require('loader-utils');

/**
 * A webpack loader to merge modules
 * @param {object} - content Source data
 */
function load(content) {
  this.cacheable();
  const callback = this.async();
  // Setup options with defaults
  const options = loaderUtils.getOptions(this);
  // Destructuring to scope
  let { pattern, glob: globOpts = {}, merge } = options;
  // Set glob directory if not provided
  if (!globOpts.cwd) {
    globOpts.cwd = process.cwd();
  }
  // Allow multiple patterns provided as array
  if (pattern instanceof Array) {
    pattern = pattern.length > 1 ? `{${pattern.join(',')}}` : pattern[0];
  }
  // Resolve merge implementation
  const mergeImplRequest = loaderUtils.stringifyRequest(this, merge || resolvePath(__dirname, 'lib/merge'));
  // Find files
  glob(pattern, globOpts, (err, files) => {
    if (err) {
      return callback(err);
    }
    // Remove references to issueing request
    files = files.map(file => resolvePath(globOpts.cwd, file)).filter(src => src !== this.resourcePath);
    // Return content if no files to merge
    if (files.length === 0) {
      return callback(null, content);
    }
    // Get absolute paths
    const paths = files.map(file => resolvePath(globOpts.cwd, file));
    // Add dependencies for watch mode
    paths.forEach(src => this.addDependency(src));
    // Get requests
    const requests = paths.map(src => loaderUtils.stringifyRequest(this, src));
    // Build source from template
    let str = `var m = (function() {
  var mod = { exports: {} };
  (function (exports, module) {

// Original module
${content}// Original module end

  })(mod.exports, mod);
  var exports = mod.exports;
  return exports;
})();
var merge = require(${mergeImplRequest});
var resources = [${requests.map((request, index) => `require(${request})`).join()}].concat([m]);
var result = {};
resources.forEach(function(resource) {
  merge(result, resource);
});
module.exports = result;
`;
    // Return source with callback
    callback(null, str);
  });
}

module.exports = load;
