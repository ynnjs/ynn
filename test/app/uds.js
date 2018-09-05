const net = require( 'net' );
const fs = require( 'fs' );

fs.open( '/tmp/node.test.sock', 'w+', ( err, fdesc ) => {
    const sock = new net.Socket( { fd : fdesc } );
    console.log( sock );
} );
