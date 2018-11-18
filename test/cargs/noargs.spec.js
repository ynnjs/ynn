process.chdir( __dirname );
const cargs = require( '../../lib/cargs' );

describe( 'Ynn.cargs -- no arguments', () => {
    const undefinedProperties = [
        'debugging',
        'logging',
        'root',
        'log-path',
        'port',
        'allow-interactive',
        'interactive'
    ];

    for( const item of undefinedProperties ) {
        it( `should have not "${item} property`, () => {
            expect( cargs[ item ] ).toBeUndefined();
        } );
    }
} );
