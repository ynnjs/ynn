const is = require( '@lvchengbin/is' );

const modifiers = [ 'ctrl', 'meta', 'shift' ];

function match( key, rule ) {
    const seq = rule.split( '+' ); 

    for( let item of seq ) {
        item = item.trim().toLowerCase();
        const name = key.name ? key.name.toLowerCase() : key.name;
        if( modifiers.indexOf( item ) > -1 ) {
            if( !key[ item ] ) return false;
        } else if( name !== item && key.sequence.toLowerCase() !== item ) return false;
    }
    return true;
}

module.exports = ( key, rules ) => {
    if( !rules || !rules.length ) return false;
    if( is.string( rules ) ) {
        return match( key, rules );
    }

    for( const rule of rules ) {
        if( match( key, rule ) ) return rule;
    }
    return false;
}
