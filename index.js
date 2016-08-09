var _                 = require('underscore')
  , doctrine          = require('doctrine')
  , babel             = require('babel-core')
  , safe_parse        = require('safe-json-parse/tuple')
  ;

var doc_tags = [
    'deploy'
  , 'name'
  , 'title'
  , 'description'
  , 'readme'
  , 'cron'
  , 'timezone'
  , 'type'
  , 'input'
  , 'output'
  , 'group'
  , 'cache'
];

function get(content /*string or parsed obj*/) {
  var manual  = {}
    , es6     = _.isObject(content)
                    ? content
                    : babel.transform(content || '') // => { code, map, ast }
    ;

  function doc_parse(c) {
    return doctrine.parse(c, { unwrap: true, recoverable: true, lineNumber : true, tags : doc_tags });
  }

  // todo [akamel] only do this for block level comments
  if (_.isObject(es6.ast)) {
    _.each(es6.ast.comments, function(c) {
      var d       = doc_parse(c.value)
        , keys    = _.pluck(d.tags, 'title')
        , values  = _.pluck(d.tags, 'description')
        , obj     = _.object(keys, values)
        ;

      _.defaults(manual, { description : d.description }, obj);
    }.bind(this));

    if (manual.input) {
      var parsed = safe_parse(manual.input);
      manual.input = parsed[0]? new Error(parsed[0]) : parsed[1];
    }

    if (manual.output) {
      var parsed = safe_parse(manual.output);
      manual.output = parsed[0]? new Error(parsed[0]) : parsed[1];
    }

    // also doable using _.pick(manual, _.identity)
    manual = _.pick(manual, (value) => !_.isEmpty(value));
  }

  return manual;
};

module.exports = {
    get : get
};