const is = require( '@lvchengbin/is' );
const Table = require( '@lvchengbin/cli-table' );

module.exports = class extends require( 'events' ) {

    constructor( app ) {
        super();
        this.app = app;
        this.root = app.root;
    }

    show( cmd ) {
        if( !cmd ) {
            console.log( new Table( this.app.inspect() ) );
        }
    }

    sham() {
    }

    switch( app ) {
        if( !app ) {
            throw new TypeError( 'Please specify an Ynn application instance or a path.' );
        }
        let res;

        if( is.string( app ) ) {
            if( app.charAt( 0 ) === '/' ) {
                res = this.root.find( app );
            } else {
                res = this.app.find( app );
            }
        } else {
            res = app;
        }

        if( !res ) {
            throw new TypeError( `App "${app}" not exists.` );
        }

        if( !res.is_ynn_app_instance ) {
            throw new TypeError( 'The specified object is not a Ynn application instance.' );
        }

        this.emit( 'switch', this.app );
        
        return {
            level : 'log',
            //content : 
        };

    }
}
