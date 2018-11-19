const path = require( 'path' );
process.chdir( __dirname );

process.argv.splice( 2, process.argv.length, ...[
    '--debugging=false',
    '--logging=false',
    '--root=shadow'
] );

const Ynn = require( '../..' );

describe( '', () => {
    it( '', () => {
        const app = new Ynn(); 
        expect( app.debugging ).toEqual( false );
        expect( app.logging ).toEqual( false );
        expect( app.root ).toEqual( path.resolve( __dirname, 'shadow' ) );
    } ); 
} );
