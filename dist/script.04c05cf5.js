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
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],"src/js/config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderError = exports.url = exports.key = void 0;
var key = "c87d7d62b65ce4618fb6a823d65be34a";
exports.key = key;
var url = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=";
exports.url = url;

var renderError = function renderError(msg, cont) {
  var html = "\n    <div class=\"error-container\">\n    <p class = 'errMessage'>\n    <i class=\"fas fa-exclamation-circle\"></i>\n    <i class=\"fas fa-times delErr\"></i>     \n    </p>\n    \n    <p class=\"err-message\">".concat(msg, "</p>\n    </div>\n    ");
  cont.classList.add('overlay');
  cont.insertAdjacentHTML('beforebegin', html);
};

exports.renderError = renderError;
},{}],"src/js/script.js":[function(require,module,exports) {
"use strict";

var _regeneratorRuntime = require("regenerator-runtime");

require("regenerator-runtime/runtime");

var _config = require("./config");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// get elements
var container = document.querySelector('.container');
var input = document.querySelector("#inputField");
var searchBtn = document.querySelector("#searchBtn");
var title = document.querySelector('.title');
var popularMoviesSection = document.querySelector("#popular");
var paginationCont = document.querySelector('.pagination');
var nextPgBtn = document.querySelector('#next');
var prevPgBtn = document.querySelector('#prev');
var pageNumber = document.querySelector('#pageNum');
var page = 1;
var currentData = {};

var ajax = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, pg) {
    var request, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch("https://api.themoviedb.org/3/trending/all/day?api_key=".concat(_config.key, "&language=en-US&page=").concat(pg, "&append_to_response=videos"));

          case 2:
            request = _context.sent;
            _context.next = 5;
            return request.json();

          case 5:
            data = _context.sent;
            // create and insert html for trending movies
            data.results.forEach(function (movie) {
              if (movie.media_type === 'movie') {
                var html = "\n            <article class='movie-tile'>\n            <div class = 'details'>\n            <h2 class ='movie-title'>".concat(movie.title, "</h2>\n            <span class = 'media-type'>(").concat(movie.media_type, ")</span>\n            <p>").concat(movie.release_date, "</p>\n            <p><i class=\"fas fa-star star\"></i> ").concat(movie.vote_average, "/10</p>\n            </div>\n            <img class='movie-poster' src='https://image.tmdb.org/t/p/w500").concat(movie.poster_path, "'>\n            </article>\n            ");
                popularMoviesSection.insertAdjacentHTML('beforeend', html);
              } // html for trending tv shows


              if (movie.media_type === 'tv') {
                var _html = "\n            <article class='movie-tile'>\n            <div class = 'details'>\n            <h2 class ='movie-title'>".concat(movie.name, "</h2>\n            <span class = 'media-type'>(").concat(movie.media_type, ")</span>\n            <p>").concat(movie.first_air_date, "</p>\n            <p><i class=\"fas fa-star star\"></i> ").concat(movie.vote_average, "/10</p>\n            </div>\n            <img class='movie-poster' src='https://image.tmdb.org/t/p/w500").concat(movie.poster_path, "'>\n            </article>\n            ");

                popularMoviesSection.insertAdjacentHTML('beforeend', _html);
              } // hide prev btn if page 1


              if (page === 1) prevPgBtn.style.opacity = 0;
              page === 1 ? prevPgBtn.style.opacity = 0 : prevPgBtn.style.opacity = 1;
              currentData = data;
            });

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function ajax(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

ajax('_', page); // show more movie details on click

popularMoviesSection.addEventListener('click', function (e) {
  if (e.target.parentElement.classList.contains('container')) return;
  var movieContainer = e.target.closest('article');

  var createHTML = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
      var mediaType, dataRes, html, tvData, tvHTML;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (movieContainer) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return");

            case 2:
              mediaType = movieContainer.children[0].children[1].textContent;

              if (!(mediaType === '(movie)')) {
                _context2.next = 9;
                break;
              }

              // get specific movie data
              dataRes = data.results.find(function (movie) {
                return movie.title === movieContainer.children[0].children[0].textContent;
              }); // insert html for movie details

              _context2.next = 7;
              return movieDetailed(dataRes);

            case 7:
              html = _context2.sent;
              popularMoviesSection.insertAdjacentHTML('afterbegin', html);

            case 9:
              if (!(mediaType === '(tv)')) {
                _context2.next = 17;
                break;
              }

              // get tv data from results
              tvData = data.results.find(function (tvShow) {
                return tvShow.name === movieContainer.children[0].children[0].textContent;
              });
              _context2.next = 13;
              return tvDetailed(tvData);

            case 13:
              tvHTML = _context2.sent;

              if (!(typeof tvHTML === 'undefined')) {
                _context2.next = 16;
                break;
              }

              return _context2.abrupt("return");

            case 16:
              popularMoviesSection.insertAdjacentHTML('afterbegin', tvHTML);

            case 17:
              ;

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function createHTML(_x3) {
      return _ref2.apply(this, arguments);
    };
  }();

  createHTML(currentData);
}); // make back button work

container.addEventListener('click', function (e) {
  e.preventDefault();
  var backBtn = document.querySelector('#backBtn');

  if (e.target === backBtn) {
    // clear details and similar media section
    backBtn.remove();
    document.querySelector('.closer-look').innerHTML = '';
    document.querySelector('.closer-look').style.display = 'none'; // restore original state

    title.style.opacity = 1;
    title.style.display = 'flex';
    paginationCont.style.opacity = 1;
    paginationCont.style.display = 'flex';
    ajax('_', page); // clear similar media

    var similar = document.querySelector('.similar-media');
    if (similar !== null) similar.innerHTML = ''; // clear known for media

    var knownFor = document.querySelector('.known-for');
    if (knownFor !== null) knownFor.remove();
  }
}); // Make next pagination work

nextPgBtn.addEventListener('click', function (e) {
  e.preventDefault();
  var pg = page += 1;
  pageNumber.textContent = "Page ".concat(pg);
  popularMoviesSection.innerHTML = '';
  ajax('_', pg);
}); // Make previous pagination work

prevPgBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (page === 1) return;
  var pg = page -= 1;
  pageNumber.textContent = "Page ".concat(pg);
  popularMoviesSection.innerHTML = '';
  ajax('_', pg);
}); // make save btn work

var watchlist = [];
container.addEventListener('click', function (e) {
  if (!e.target.classList.contains('saved')) return;
  e.preventDefault();

  if (!e.target.classList.contains('in-watchlist')) {
    e.target.classList.add('in-watchlist');
    e.target.textContent = 'Remove from watchlist';
    console.log(e.target.textContent); // set watchlist to local storage

    watchlist = JSON.parse(localStorage.getItem("watchlist"));
    if (watchlist === null) watchlist = []; // get name of media

    var nameOfMedia = e.target.parentElement.children[0].textContent; // update array and local storage

    watchlist.push(nameOfMedia);
    localStorage.setItem("watchlist", JSON.stringify(watchlist)); // change text on btn

    if (e.target.classList.contains('in-watchlist')) e.target.textContent = 'Remove from watchlist';
  } else if (e.target.classList.contains('in-watchlist')) {
    e.target.classList.remove('in-watchlist');
    e.target.textContent = 'Save to watchlist';
    console.log(e.target.textContent); // get local storage and name of media

    var local = JSON.parse(localStorage.getItem('watchlist'));
    var _nameOfMedia = e.target.parentElement.children[0].textContent; // remove media from watchlist array and local storage

    var index = watchlist.indexOf(_nameOfMedia);
    watchlist.splice(index, 1);
    local.splice(index, 1); // update local storage

    localStorage.setItem("watchlist", JSON.stringify(local));
  }
});

var movieDetailed = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(d) {
    var local, request, movieData, trailer, link, genres, html, similar;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            local = JSON.parse(localStorage.getItem('watchlist'));
            if (local === null) local = '';
            _context3.next = 4;
            return fetch("\n    https://api.themoviedb.org/3/movie/".concat(d.id, "/videos?api_key=").concat(_config.key, "&language=en-US"));

          case 4:
            request = _context3.sent;
            _context3.next = 7;
            return request.json();

          case 7:
            movieData = _context3.sent;
            trailer = movieData.results[0].key;
            link = "https://www.youtube.com/embed/".concat(trailer); // get movie genres

            _context3.next = 12;
            return getGenre(d);

          case 12:
            genres = _context3.sent;
            // clear the section and insert details of movie
            popularMoviesSection.innerHTML = '';
            title.style.opacity = 0;
            title.style.display = 'none';
            paginationCont.style.opacity = 0; // paginationCont.style.height = 0;

            paginationCont.style.display = 'none'; // render the detailed html

            html = renderDetails(d, link, genres, local); // get similar shows

            _context3.next = 21;
            return getSimilar(d);

          case 21:
            similar = _context3.sent;
            insertSimilar(similar);
            return _context3.abrupt("return", html);

          case 24:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function movieDetailed(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var tvDetailed = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(d) {
    var local, tvRequest, tvData, getTrailer, trailerData, trailer, link, genres, html, similar;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            local = JSON.parse(localStorage.getItem('watchlist'));
            if (local === null) local = '';
            _context4.next = 4;
            return fetch("https://api.themoviedb.org/3/tv/".concat(d.id, "?api_key=").concat(_config.key, "&language=en-US"));

          case 4:
            tvRequest = _context4.sent;
            _context4.next = 7;
            return tvRequest.json();

          case 7:
            tvData = _context4.sent;
            _context4.next = 10;
            return fetch("https://api.themoviedb.org/3/tv/".concat(d.id, "/videos?api_key=").concat(_config.key, "&language=en-US"));

          case 10:
            getTrailer = _context4.sent;
            _context4.next = 13;
            return getTrailer.json();

          case 13:
            trailerData = _context4.sent;

            if (!(trailerData.results.length > 0)) {
              _context4.next = 31;
              break;
            }

            trailer = trailerData.results[0].key;
            link = "https://www.youtube.com/embed/".concat(trailer); // get genres

            _context4.next = 19;
            return getGenre(d);

          case 19:
            genres = _context4.sent;
            // clear the section and insert details of movie
            popularMoviesSection.innerHTML = '';
            title.style.opacity = 0;
            title.style.display = 'none';
            paginationCont.style.opacity = 0;
            paginationCont.style.display = 'none';
            html = renderDetails(d, link, genres, local); // get similar shows

            _context4.next = 28;
            return getSimilar(d);

          case 28:
            similar = _context4.sent;
            insertSimilar(similar);
            return _context4.abrupt("return", html);

          case 31:
            (0, _config.renderError)('Could not get latest data for show try again later', container);

          case 32:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function tvDetailed(_x5) {
    return _ref4.apply(this, arguments);
  };
}();

var personDetailed = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
    var html;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            html = "\n    ".concat(typeof backBtn != 'undefined' ? '' : '<button ><i class="fas fa-home" id="backBtn"></i></button>', "\n    <div class = 'closer-look'>\n    <h2>").concat(data.name, "</h2>\n    <div class=\"mini-details\">\n    <p class = 'gender'>").concat(data.gender === 1 ? 'Female' : 'Male', "</p>\n        <p class=\"rating\">").concat(data.known_for_department, " \uD83C\uDFAC</p>\n        <p>Pop rating: ").concat(Math.floor(data.popularity), "<i class=\"fas fa-star star\"></i></p>\n    </div>\n    <div class = 'personImg'>\n    <img class ='person-poster'src = 'https://image.tmdb.org/t/p/w500").concat(data.profile_path, "'>\n    </div>\n    </div>\n\n    <section class = 'known-for'>\n    <h1>Known for...</h1\n    </section>\n    ");
            setTimeout(function () {
              var knownForMovies = document.querySelector('.known-for');
              data.known_for.forEach(function (movie) {
                var knownForHTML = "\n            <article class='movie-tile'>\n            <div class = 'details'>\n            <h2 class ='movie-title'>".concat(movie.title, "</h2>\n            <p>").concat(movie.release_date, "</p>\n            <p><i class=\"fas fa-star star\"></i> ").concat(Math.floor(movie.vote_average), "/10</p>\n            </div>\n            <img class='movie-poster' src='https://image.tmdb.org/t/p/w500").concat(movie.poster_path, "'>\n            </article>\n            ");
                knownForMovies.insertAdjacentHTML('beforeend', knownForHTML);
              }); // look at known for movies

              container.addEventListener('click', function (e) {
                // conditions
                if (e.target.classList.contains('known-for') || e.target.parentElement === null) return;
                if (typeof knownForMovies === 'undefined') return;

                if (e.target.parentElement.classList.contains('similar-media') || e.target.parentElement.classList.contains('details')) {
                  knownForMovies.innerHTML = '';
                  var closeLook = document.querySelector('.closer-look');

                  if (typeof closeLook != 'null') {
                    closeLook.remove();
                    var _title = e.target.closest('article').children[0].children[0].textContent;
                    searchData(_title);
                  }
                }
              });
            }, 1000); // clear the section and insert details of movie

            popularMoviesSection.innerHTML = '';
            title.style.opacity = 0;
            title.style.display = 'none';
            paginationCont.style.opacity = 0;
            paginationCont.style.display = 'none';
            return _context5.abrupt("return", html);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function personDetailed(_x6) {
    return _ref5.apply(this, arguments);
  };
}(); // create detailed HTML for media


var renderDetails = function renderDetails(d, trailer, genres, local) {
  var mediaHTML = "\n    ".concat(typeof backBtn != 'undefined' ? '' : '<button ><i class="fas fa-home" id="backBtn"></i></button>', "\n    \n    <div class='closer-look'>\n    <h2>").concat(d.title || d.name, "</h2>\n    <div class=\"mini-details\">\n    <p class = 'genre'>").concat(genres, "</p>\n        <p class=\"rating\">").concat(d.vote_average, "<i class=\"fas fa-star star\"></i></p>\n        <p>Pop rating: ").concat(Math.floor(d.popularity), "</p>\n    </div>\n    ").concat(typeof trailer === 'undefined' ? '' : "<iframe class='trailers' src=".concat(trailer, " height=\"200\" width=\"300\"\n    allowfullscreen='true' title=\"").concat(d.title || d.name, " trailer\"></iframe>"), "\n    <p class=\"overview\">").concat(d.overview, "</p>\n    <button class = 'saved ").concat(local.includes(d.title) ? 'in-watchlist' : '', "' id='saveBtn '> Save to watchlist</button>\n    </div>\n    <section class = 'similar-media'></section>\n    ");
  return mediaHTML;
}; // ${local.includes(d.title) ? 'Remove from' : 'Save to'}
// get similar media data


var getSimilar = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(data) {
    var request, similarData;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return fetch("\n    https://api.themoviedb.org/3/movie/".concat(data.id, "/similar?api_key=").concat(_config.key, "&language=en-US&page=1"));

          case 2:
            request = _context6.sent;
            _context6.next = 5;
            return request.json();

          case 5:
            similarData = _context6.sent;
            return _context6.abrupt("return", similarData);

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function getSimilar(_x7) {
    return _ref6.apply(this, arguments);
  };
}(); // similar shows and movies html


var insertSimilar = function insertSimilar(data) {
  if (data.success === false || data.results.length === 0) return; // wait 1 second so similar media section is not null

  setTimeout(function () {
    var section = document.querySelector('.similar-media'); // get first five results

    var firstFive = data.results.slice(0, 5);
    section.insertAdjacentHTML('beforeend', "<h1 class='mini-heading'>Other stuff you should check out</h1>");
    firstFive.forEach(function (similarMedia) {
      var html = "\n                <article class='movie-tile'>\n                <div class = 'details'>\n                <h2 class ='movie-title'>".concat(similarMedia.title, "</h2>\n                <p>").concat(similarMedia.release_date, "</p>\n                <p><i class=\"fas fa-star star\"></i> ").concat(Math.floor(similarMedia.vote_average), "/10</p>\n                </div>\n                <img class='movie-poster' src='https://image.tmdb.org/t/p/w500").concat(similarMedia.poster_path, "'>\n                </article>\n            ");
      section.insertAdjacentHTML('beforeend', html);
    }); // get more details of similar media

    container.addEventListener('click', function (e) {
      if (e.target.classList.contains('similar-media') || e.target.parentElement === null) return;

      if (e.target.parentElement.classList.contains('similar-media') || e.target.parentElement.classList.contains('details')) {
        // hide section
        section.innerHTML = '';
        if (typeof section === 'undefined') return;
        var closeLook = document.querySelector('.closer-look');

        if (typeof closeLook !== 'null') {
          closeLook.remove();
          var _title2 = e.target.closest('article').children[0].children[0].textContent;
          searchData(_title2);
        }
      }
    });
  }, 1000);
}; // get genre of media


var getGenre = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(data) {
    var requestGenre, genreData, genres;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return fetch("\n    https://api.themoviedb.org/3/genre/movie/list?api_key=c87d7d62b65ce4618fb6a823d65be34a&language=en-US");

          case 2:
            requestGenre = _context7.sent;
            _context7.next = 5;
            return requestGenre.json();

          case 5:
            genreData = _context7.sent;
            genres = [];
            data.genre_ids.map(function (id) {
              genreData.genres.forEach(function (genre) {
                if (genre.id === id) genres.push(genre.name);
              });
            });
            return _context7.abrupt("return", genres);

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function getGenre(_x8) {
    return _ref7.apply(this, arguments);
  };
}(); // Make search bar work


var searchData = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(query) {
    var request, data, html, _html2, _html3;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return fetch("https://api.themoviedb.org/3/search/multi?api_key=".concat(_config.key, "&language=en-US&query=").concat(query, "&page=1&include_adult=false"));

          case 3:
            request = _context8.sent;
            _context8.next = 6;
            return request.json();

          case 6:
            data = _context8.sent;

            if (!(data.results[0].media_type === 'tv')) {
              _context8.next = 12;
              break;
            }

            _context8.next = 10;
            return tvDetailed(data.results[0]);

          case 10:
            html = _context8.sent;
            container.insertAdjacentHTML('afterbegin', html);

          case 12:
            if (!(data.results[0].media_type === 'movie')) {
              _context8.next = 18;
              break;
            }

            popularMoviesSection.innerHTML = '';
            _context8.next = 16;
            return movieDetailed(data.results[0]);

          case 16:
            _html2 = _context8.sent;
            // container.insertAdjacentHTML('afterbegin', html)
            popularMoviesSection.innerHTML = _html2;

          case 18:
            if (!(data.results[0].media_type === 'person')) {
              _context8.next = 24;
              break;
            }

            popularMoviesSection.innerHTML = '';
            _context8.next = 22;
            return personDetailed(data.results[0]);

          case 22:
            _html3 = _context8.sent;
            popularMoviesSection.innerHTML = _html3;

          case 24:
            _context8.next = 29;
            break;

          case 26:
            _context8.prev = 26;
            _context8.t0 = _context8["catch"](0);
            (0, _config.renderError)('We could not find something matching your search please try again', container);

          case 29:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 26]]);
  }));

  return function searchData(_x9) {
    return _ref8.apply(this, arguments);
  };
}(); // make search button and enter key search for media


searchBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (input.value === '') return;
  searchData(input.value);
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    if (input.value === '') return;
    searchData(input.value);
    input.value = '';
  }
}); // make x btn on error container work

document.addEventListener('click', function (e) {
  if (!e.target.classList.contains('delErr')) return; // restore original state

  title.style.opacity = 1;
  title.style.display = 'flex';
  paginationCont.style.opacity = 1;
  paginationCont.style.display = 'flex';
  ajax('_', page);
  container.classList.remove('overlay'); // remove error

  var errContainer = document.querySelector('.error-container');
  errContainer.remove();
});
},{"regenerator-runtime":"node_modules/regenerator-runtime/runtime.js","regenerator-runtime/runtime":"node_modules/regenerator-runtime/runtime.js","./config":"src/js/config.js"}],"../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50020" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/js/script.js"], null)
//# sourceMappingURL=/script.04c05cf5.js.map