var fs = require("fs");
var path = require("path");
var less = require("less");
var LessPluginAutoPrefix = require('less-plugin-autoprefix');

module.exports = function(env, callback) {
  var LessPluginWithAutoprefix,
    extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    },
    hasProp = {}.hasOwnProperty;

  LessPluginWithAutoprefix = (function(superClass) {
    extend(LessPluginWithAutoprefixInner, superClass);

    function LessPluginWithAutoprefixInner(filepath, text) {
      this.filepath = filepath;
      this.text = text;
    }

    LessPluginWithAutoprefixInner.prototype.getFilename = function() {
      return this.filepath.relative.replace(/less$/, 'css');
    };

    LessPluginWithAutoprefixInner.prototype.render = function(locals, callback) {};

    LessPluginWithAutoprefixInner.prototype.getView = function() {
      return function(env, locals, contents, templates, callback) {
        return callback(null, new Buffer(this.text));
      };
    };

    return LessPluginWithAutoprefixInner;
  })(env.ContentPlugin);

  LessPluginWithAutoprefix.fromFile = function(filepath, callback) {
    fs.readFile(filepath.full, function(error, result) {
      if (error) {
        callback(error);
      } else {
        var lessOptions = env.config.less || {};

        var autoprefixOptions = env.config.autoprefix || ["last 2 versions"];

        var autoprefixPlugin = new LessPluginAutoPrefix({
          browsers: autoprefixOptions
        });

        lessOptions.plugins = lessOptions.plugins || [];
        lessOptions.plugins.push(autoprefixPlugin);
        lessOptions.filename = filepath.relative;
        lessOptions.paths = [path.dirname(filepath.full)];

        less.render(result.toString(), lessOptions)
          .then(function(output) {
            var plugin = new LessPluginWithAutoprefix(filepath, output.css);
            return callback(null, plugin);
          })
          .catch(function(reason) {
            throw new Error(reason);
          });
      }
    });
  };

  env.registerContentPlugin('styles', '**/[^\_]*.less', LessPluginWithAutoprefix);

  callback();
};