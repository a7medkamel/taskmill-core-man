var bodyParser        = require('body-parser')
  , _                 = require('underscore')
  ;

function passthrough(req, res, cb){
  process.nextTick(cb);
}

function middleware(req, manual) {
  var content_type  = manual.input['content-type']
    , type          = manual.input['type']
    , mw            = passthrough
    ;

  switch(type) {
    case 'buffer':
    mw = bodyParser.raw({ type : '*/*'/*content_type*/ });
    break;

    case 'stream':
    break;

    default:
      if (_.isUndefined(content_type)) {
        mw  = contentTypeOverride({
                  contentType : content_type
              });
      }
  }  

  return mw;
}

module.exports = {
    middleware  : middleware
};