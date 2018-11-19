const Ynn = require( '../../..' );

const app = new Ynn( {
    debugging : Ynn.DEBUGGING_DANGER,
    logging : false,
    root : __dirname,
    static : {
        '/static/(.*)' : '.',
        '/files/(.*)' : '.'
    },
    modules : {
        submodule : '../submodule'
    }
} );

module.exports = app;
