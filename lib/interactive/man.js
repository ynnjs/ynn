const is = require( '@lvchengbin/is' );

module.exports = text => {
    if( is.string( text ) ) {
        console.log( '\n    ' + text );
        return;
    }

    if( is.array( text ) ) {
        console.log( '\n' + text.join( '\n\n' ) );
        return;
    }

    const sections = [];

    for( const name of Object.keys( text ) ) {
        sections.push( `- ${name}\n    ${text[name]}` ); 
    }
    console.log( '\n' + sections.join( '\n\n' ) );
};
