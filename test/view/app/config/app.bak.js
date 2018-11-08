const _ = require( 'underscore' );

module.exports = {
    view : {
        map : {
            '.xhtml' : {
                init() {
                    _.templateSettings = {
                        interpolate : /\{\{(.+?)\}\}/g
                    };
                },
                render( file, data ) {
                }
            }
        }
    }
}
