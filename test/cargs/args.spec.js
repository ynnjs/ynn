const path = require( 'path' );
process.chdir( __dirname );

process.argv.splice( 2, process.argv.length, ...[
    '--debugging=true',
    '--logging=false',
    '--root=app',
    '--log-path=log',
    '--port=3000'
] );

const cargs = require( '../../lib/cargs' );

describe( 'Ynn.cargs -- arguments', () => {

    // --debugging=true
    it( '"debugging" should be TRUE', () => {
        expect( cargs.debugging ).toEqual( true );
    } );

    // --logging=false
    it( '"logging" should be FALSE', () => {
        expect( cargs.logging ).toEqual( false ); 
    } );

    // --root
    it( 'should have "root" property', () => {
        expect( cargs.root ).toEqual( path.resolve( __dirname, 'app' ) );
    } );

    // --port
    it( 'port', () => {
        expect( cargs.port ).toEqual( 3000 );
    } );
} );
