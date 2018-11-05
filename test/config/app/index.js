const Ynn = require( '../../../lib/ynn' );

const app = new Ynn( {
    root : __dirname,
    debugging : true,
    logging : false,
    modules : {
        sub : {
            path : '../sub'
        },
        sub2 : {
            path : '../sub2',
            configDir : '../config',
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
