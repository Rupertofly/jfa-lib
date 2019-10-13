// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"JFA.frag":[function(require,module,exports) {
module.exports = "precision mediump float;\n#define GLSLIFY 1\nuniform vec2 u_resolution;\nuniform float u_time;\n\nfloat bitwiseANd(float a,float b){\n  float result=0.;\n  float n=1.;\n  for(int i=0;i<4080;i++){\n    if((mod(a,2.)==1.)&&(mod(b,2.)==1.))result+=n;\n    a=a/2.;\n    b=b/2.;\n    n=n/2.;\n  }\n  return result;\n}\nvec4 EncodeData(in vec2 coord,in vec3 color)\n{\n  vec4 ret=vec4(0.);\n  ret.xy=coord;\n  ret.z=floor(color.x*255.)*256.+floor(color.y*255.);\n  ret.w=floor(color.z*255.);\n  return ret;\n}\n\n//============================================================\nvoid DecodeData(in vec4 data,out vec2 coord,out vec3 color)\n{\n  coord=data.xy;\n  color.x=floor(data.z/256.)/255.;\n  color.y=mod(data.z,256.)/255.;\n  color.z=mod(data.w,256.)/255.;\n}\nvoid main(){\n  vec2 uv=-gl_FragCoord.xy/u_resolution;\n  gl_FragColor=vec4(mod(max(uv.x,uv.y),.2)*5.,floor(max(uv.x,uv.y)/5.*sin(u_time),.5,1.));\n  \n}";
},{}],"index.ts":[function(require,module,exports) {
"use strict";

var _JFA = _interopRequireDefault(require("./JFA.frag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_JFA.default);
},{"./JFA.frag":"JFA.frag"}]},{},["index.ts"], null)
//# sourceMappingURL=/index.js.map