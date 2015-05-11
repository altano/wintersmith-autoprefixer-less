var assert, suite, vows, wintersmith;

vows = require('vows');

assert = require('assert');

wintersmith = require('wintersmith');

suite = vows.describe('wintersmith-autprefixer');

suite.addBatch({
  'wintersmith environment': {
    topic: function() {
      return wintersmith('./example/config.json');
    },
    'loaded ok': function(env) {
      return assert.instanceOf(env, wintersmith.Environment);
    },
    'contents': {
      topic: function(env) {
        return env.load(this.callback);
      },
      'loaded ok': function(result) {
        return assert.instanceOf(result.contents, wintersmith.ContentTree);
      },
      'has plugin instances': function(result) {
        assert.instanceOf(result.contents['main.less'], wintersmith.ContentPlugin);
        assert.isArray(result.contents._.styles);
        return assert.lengthOf(result.contents._.styles, 2);
      },
      'contains the right text': function(result) {
        var i, item, len, ref, results;
        ref = result.contents._.styles;
        if (!result.contents._.styles) {
          throw ("Empty text");
        }
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          assert.isString(item.text);
          if (item.text != '')
            results.push(assert.match(item.text, /-webkit-flex;/));
        }
        return results;
      }
    }
  }
});

suite["export"](module);