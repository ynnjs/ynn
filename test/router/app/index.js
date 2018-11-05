const Ynn = require( '../../../lib/ynn' );
const Constants = require( '../../../lib/constants' );

const app = new Ynn( {
    debugging : Constants.DEBUGGING_ERROR,
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
