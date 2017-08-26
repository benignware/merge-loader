const assert = require('assert');
const { join: joinPath } = require('path');
const { readFileSync, writeFileSync } = require('fs');
const mockery = require('mockery');
const requireFromString = require('require-from-string');
const loader = require('..');

mockery.registerSubstitute('./env/production/config.js', joinPath(__dirname, './fixtures/env/production/config.js'));
mockery.registerSubstitute('../../node_modules/lodash.merge', './node_modules/lodash.merge');
mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
});

describe('config-loader', () => {
  it('should merge as expected', (done) => {
    const options = {
      pattern: `env/${process.env.NODE_ENV}/config.*`
    };
    loader.call({
      query: options,
      context: joinPath(__dirname, './fixtures'),
      cacheable: () => {},
      addDependency: () => {},
      async: () => (err, content) => {
        if (err) {
          throw err;
        }
        const config = requireFromString(content);
        assert.equal(
          config.environment(),
          'Production'
        );
        assert.equal(
          config.helloWorld,
          'Hello World'
        );
        done();
      }
    }, readFileSync(joinPath(__dirname, 'fixtures', 'config.js'), 'utf-8'));
  });
});
