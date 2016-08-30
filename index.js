var _                 = require('lodash')
  , doctrine          = require('doctrine')
  , babel             = require('babel-core')
  , safe_parse        = require('safe-json-parse/tuple')
  ;

var doc_tags = [
    'title'
  , 'description'
  , 'readme'
  , 'input'
  , 'output'
  , 'cache'
  , 'pragma'
];

function doc_parse(c) {
  return doctrine.parse(c, { unwrap: true, recoverable: true, lineNumber : true, tags : doc_tags });
}

function get(content /*string or parsed obj*/) {
  var manual  = {}
    , es6     = _.isObject(content)? content : babel.transform(content || '') // => { code, map, ast }
    ;

  // _.defaults(manual, { description : d.description }, obj); //=> used to take general comment block and set description
  // todo [akamel] only do this for block level comments
  if (_.isObject(es6.ast)) {
    _.each(es6.ast.comments, (c) => {
      var d = doc_parse(c.value);

      _.each(d.tags, (tag) => {
        switch (tag.title) {
          case 'pragma':
          if (!_.has(manual, tag.title)) {
            manual['pragma'] = [];
          }
          manual['pragma'].push(tag.description);
          break;
          default:
          if (!_.has(manual, tag.title)) {
            manual[tag.title] = tag.description;
          }
        }
      });
    });

    if (manual.input) {
      let parsed = safe_parse(manual.input);
      manual.input = parsed[0]? new Error(parsed[0]) : parsed[1];
    }

    if (manual.output) {
      let parsed = safe_parse(manual.output);
      manual.output = parsed[0]? new Error(parsed[0]) : parsed[1];
    }

    // remove empty properties
    manual = _.pickBy(manual, (value) => !_.isEmpty(value));
  }

  return manual;
};

module.exports = {
    get : get
};