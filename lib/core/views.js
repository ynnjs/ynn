const tengine = require( 'tengine' );
const is = require( '@lvchengbin/is' );
module.exports = async function() {
    const map = this.config( 'view.map' );
    if( !map ) return;
    for( const ext of Object.keys( map ) ) {
        const item = map[ ext ];
        if( !item.engine ) {
            const msg = `no template engine specified for ${ext} files.`;
            this.console.error( msg );
            this.logger.error( msg );
            throw new Error( msg );
        }

        if( !tengine.support( item.engine ) ) {
            if( !is.function( item.render ) ) {
                const msg = `unsupported template engine ${item.engine}, a render function should be provided in view configuration.`;
                this.console.error( msg );
                this.logger.error( msg );
                throw new Error( msg );
            }
        }
    }
}
