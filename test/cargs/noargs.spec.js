process.chdir( __dirname );
const cargs = require( '../../lib/cargs' );

describe( 'Ynn.cargs -- no arguments', () => {
    const undefinedProperties = [
        'debugging',
        'logging',
        'root',
        'log-path',
        'port'
    ];

    for( const item of undefinedProperties ) {
        it( `should have not "${item} property`, () => {
            expect( cargs[ item ] ).toBeUndefined();
        } );
    }
} );
