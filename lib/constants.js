module.exports.LOGGING_ENABLE = Symbol( 'ynn#const#logging#enble' );
module.exports.LOGGING_DISABLE = Symbol( 'ynn#const#logging#disable' );
module.exports.LOGGING_DISABLE_ALL = Symbol( 'ynn#const#logging#disable#all' );

module.exports.DEBUGGING_NONE = 0;
module.exports.DEBUGGING_TRACE = 1;
module.exports.DEBUGGING_DEBUG = 1 << 1;
module.exports.DEBUGGING_LOG = 1 << 2;
module.exports.DEBUGGING_INFO = 1 << 3;
module.exports.DEBUGGING_WARN = 1 << 4;
module.exports.DEBUGGING_ERROR = 1 << 5;
module.exports.DEBUGGING_SPEC = 1 << 6;
module.exports.DEBUGGING_DEFAULT = 
    module.exports.DEBUGGING_WARN ^
    module.exports.DEBUGGING_ERROR ^
    module.exports.DEBUGGING_SPEC;
module.exports.DEBUGGING_ALL = 
    module.exports.DEBUGGING_TRACE ^
    module.exports.DEBUGGING_DEBUG ^
    module.exports.DEBUGGING_LOG ^
    module.exports.DEBUGGING_INFO ^
    module.exports.DEBUGGING_WARN ^
    module.exports.DEBUGGING_ERROR ^
    module.exports.DEBUGGING_SPEC;
