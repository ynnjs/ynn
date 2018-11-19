const Ynn = require( '../../..' );

const app = new Ynn( {
    root : __dirname,
    debugging : Ynn.DEBUGGING_DANGER,
    logging : false,
    modules : {
        sub : {
            path : '../sub'
        },
        sub2 : {
            path : '../sub2',
            config : {
                app : {
                    controller : {
                        path : 'x'
                    }
                }
            }
        }
    }
} );

module.exports = app;
