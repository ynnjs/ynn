const nunjucks = require( 'nunjucks' );

module.exports = {
    view : {
        path : 'view',
        map : {
            '.html' : {
                init() {
                    return nunjucks.configure( {
                        autoescape : true
                    } );
                },
                render( file, data = {} ) {
                    return nunjucks.render( file, data );
                }
            }
        }
    },
    controller : {
        path : 'controller'
    },
    service : {
        path : 'service'
    }
};
