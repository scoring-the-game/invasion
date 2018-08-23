const noop = () => {};

// ================================================================================================================================
export const NullLogger = () => {
  return (instance = {
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    indent: noop,
    outdent: noop,
  });
};

// ================================================================================================================================
export const SimpleLogger = name => {
  const instance = {
    debug(...args) {
      console.log(`${name}>`, ...args);
    },
    info(...args) {
      console.info(`${name}>`, ...args);
    },
    warn(...args) {
      console.warn(`${name}>`, ...args);
    },
    error(...args) {
      console.error(`${name}>`, ...args);
    },
    indent(...args) {
      console.groupCollapsed(`${name}>`, ...args);
    },
    outdent(label, result) {
      if (result != null) {
        console.log('=>', result);
      }
      console.groupEnd();
    },
  };

  return instance;
};

// ================================================================================================================================
export const IndentLogger = (name, indenter) => {
  const logger = SimpleLogger(name);

  const instance = {
    ...logger,
    debug(msgStr, ...rest) {
      logger.debug(`${indenter.prefix()}${msgStr}`, ...rest);
      return instance;
    },
    indent(...args) {
      debug(...args);
      indenter.indent();
      return instance;
    },
    outdent(...args) {
      indenter.outdent();
      debug(...args);
      return instance;
    },
  };

  return instance;
};
