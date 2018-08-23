export const StdClassTracer = function(logger) {
  const instance = {

    // ----------------------------------------------------------
    enter(name, ...args) {
      logger.indent(`${name} {`);
      return instance;
    },

    // ----------------------------------------------------------
    leave(name, result) {
      if (result != null && result !== '') {
        logger.outdent(`} ${name} =>`, result);
      } else {
        logger.outdent(`} ${name}`);
      }
      return instance;
    },

    // ----------------------------------------------------------
    val(label, value) {
      logger.debug(`${label} => ${value.toString()}`);
      return instance;
    },

    // ----------------------------------------------------------
    message(...args) {
      logger.debug(...args);
      return instance;
    },

    // ----------------------------------------------------------
    error(...args) {
      logger.error(...args);
      return instance;
    },

    // ----------------------------------------------------------
    resultTextFromResult(result) {
      if (typeof result === 'function') {
        return `function ${result.name}`;
      } else if (typeof result === 'string') {
        if (result.length > 16) {
          return result.substr(0, 14) + '...';
        } else {
          return result;
        }
      } else {
        return result;
      }
    },

    // ----------------------------------------------------------
    traceFunction(fn, name = null) {
      var fnWrapper;
      if (fn == null) debugger;

      name = name || fn.name || fn._name_ || 'huh?';

      fnWrapper = function() {
        instance.enter(name);
        const result = fn.apply(this, arguments);
        instance.leave(name, resultTextFromResult(result));
        return result;
      };
      fnWrapper._name_ = name;
      fnWrapper._wrapper_ = true;
      fnWrapper._fn_ = fn;
      return fnWrapper;
    },

    // ----------------------------------------------------------
    wrapMethod(className, methodName, fn) {
      var fnWrapper;
      fnWrapper = function() {
        var name, objName, result;
        objName = this.cid != null ? `[${this.cid}]` : '';
        name = `${className}${objName}#${methodName}`;
        instance.enter(name);
        result = fn.apply(this, arguments);
        instance.leave(name, resultTextFromResult(result));
        return result;
      };
      fnWrapper._name_ = fn.name;
      fnWrapper._wrapper_ = true;
      fnWrapper._fn_ = fn;
      return fnWrapper;
    },

    // ----------------------------------------------------------
    excludeMethod(fn, name, methodsToExclude) {
      return methodsToExclude.includes(name) || fn._type_ === 'class';
    },

    // ----------------------------------------------------------
    traceObject(object, objectName, methodsToExclude) {
      const ref = Object.getOwnPropertyNames(object);
      for (let i = 0, len = ref.length; i < len; i++) {
        const name = ref[i];
        if (typeof object[name] === 'function') {
          if (!excludeMethod(object[name], name, methodsToExclude)) {
            object[name] = wrapMethod(objectName, name, object[name]);
          }
        }
      }
      return object;
    },

    // ----------------------------------------------------------
    traceClass(klass, className, methodsToExclude) {
      //logger.debug "traceClass => #{klass.name}"
      if (className == null) {
        className = klass.name;
      }
      traceObject(klass.prototype, className, methodsToExclude);
      return klass;
    },
  };

  return instance;
};
