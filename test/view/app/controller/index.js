module.exports = class index extends require( '../../../../lib/controller' ) {
    indexAction() {
        return this.render( 'index.html', {
            title : '<Hello Ynn!>'
        } ); 
    }
}
