//const nunjucks = require( 'nunjucks' );

module.exports = {
    path : 'view',
    map : {
        html : {
            render() {
                return 'Rendered HTML';
            }
        },
        tpl : {
            render( file, data ) {
                return { file, data }
            }
        }
    }
}
