module.exports = ( obj, symb ) => {
    const properties = x => {
        const res = new Set( Object.getOwnPropertySymbols( x ) );
        const proto = Object.getPrototypeOf( x );
        if( !proto ) return res;
        return new Set( [ ...res, ...properties( proto ) ] );
    };

    for( const s of properties( obj ) ) {
        if( String( s ) === `Symbol(${symb})` ) return obj[ s ];
    }
    return null;
}
