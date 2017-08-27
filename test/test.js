const assert = require('assert');
const { join: joinPath } = require('path');
const { readFileSync } = require('fs');
const requireFromString = require('require-from-string');
const loader = require('..');

const createContext = (options = {}, callback = (err = null, content = null) => {}) => ({
  query: options,
  cacheable: () => {},
  addDependency: () => {},
  async: () => callback
});

describe('config-loader', () => {
  it('should merge modules with default options', (done) => {
    loader.call(createContext({
      pattern: `fixtures/env/${process.env.NODE_ENV}/config.*`
    }, (err, content) => {
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
    }), readFileSync(joinPath(__dirname, 'fixtures', 'config.js'), 'utf-8'));
  });

  it('should merge modules with custom options', (done) => {
    loader.call(createContext({
      pattern: `env/${process.env.NODE_ENV}/config.*`,
      glob: {
        cwd: joinPath(__dirname, 'fixtures')
      },
      merge: 'lodash.merge'
    }, (err, content) => {
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
    }), readFileSync(joinPath(__dirname, 'fixtures', 'config.js'), 'utf-8'));
  });
});
