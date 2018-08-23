const _ = require('underscore');
const Flags = require('common/flags');

const tracingIndenter = require('./indenter');
let tracingStyle = 'simple';
if (Flags.tracing_style === 'indent') tracingStyle = 'indent';
const tracingLogger = require('./logger')[tracingStyle];
const nullLogger = require('./logger').null;
const tracer = require('./tracer');

const gIndenter = tracingIndenter();

// const gJsLogger = nullLogger();
const gJsLogger = tracingLogger('js', gIndenter);
const gJsTracer = tracer(gJsLogger);
PM.tracer = gJsTracer;

const gAsLogger = tracingLogger('as', gIndenter);
const gAsTracer = tracer(gAsLogger);
PM.astracer = gAsTracer;

/*
const extLogger = new TracingLogger('--- external ---');
const extTracer = new Tracer(extLogger);
PM.ext = { logger: extLogger, tracer: extTracer };
// */

const gTracedClasses = [];

function initTracingForClass(klass) {
  let name = '';

  if (_.isString(klass.name) && klass.name !== '') {
    name = klass.name;
  } else if (_.isString(klass._name_) && klass._name_ !== '') {
    name = klass._name_;
  } else if (_.isFunction(klass._fn_) && _.isString(klass._fn_.name) && klass._fn_.name !== '') {
    name = klass._fn_.name;
  } else {
    return;
  }

  if (!_.contains(gTracedClasses, name)) {
    gJsTracer.traceClass(klass, name, klass._methods_to_exclude_);
    gTracedClasses.push(name);
  }
}

function extendClass(klass) {
  return klass.extend({
    constructor: function() {
      initTracingForClass(this.constructor);
      return klass.apply(this, arguments);
    },
  });
}

function initTracing(Backbone, excludedClasses) {
  excludedClasses.forEach(function(klass) {
    gTracedClasses.push(klass);
  });
  Backbone.View = extendClass(Backbone.View);
  Backbone.Model = extendClass(Backbone.Model);
  Backbone.Collection = extendClass(Backbone.Collection);
  Backbone.Router = extendClass(Backbone.Router);

  Backbone.gTracedClasses = gTracedClasses;

  return Backbone;
}

module.exports = initTracing;
