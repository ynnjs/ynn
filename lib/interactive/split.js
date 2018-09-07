import isString from '@lvchengbin/is/src/string';
import isRegexp from '@lvchengbin/is/src/regexp';
import isFunction from '@lvchengbin/is/src/function';
/**
 * to split a string with a separator
 */
function split( str, sp, limit = Number.MAX_VALUE ) {
    /**
     * if the target string doesn't contain the separator, return the result directly.
     * this check is used to improve performance.
     */


    if( limit < 2 ) return [ str ];

    let fn;
    let singleQuoted = false;
    let doubleQuoted = false;
    let substr = '';
    let backslashes = 0;

    if( isString( sp ) ) {
        if( str.indexOf( sp ) < 0 ) return [ str ];
        fn = ( str, pos ) => str.substr( pos, sp.length ) === sp ? sp.length : false;
    } else if( isRegexp( sp ) ) {
        if( !sp.test( str ) ) return [ str ];
        fn = ( str, pos ) => {
            const sub = str.substr( pos );
            const matches = sub.match( sp );
            if( !matches ) return false;
            if( sub.indexOf( matches[ 0 ] ) ) return false;
            return matches[ 0 ].length;
        };
    } else if( isFunction( sp ) ) {
        fn = ( str, pos ) => sp( str, pos );
    }

    const res = [];

    for( let i = 0, l = str.length; i < l; i += 1 ) {
        const c = str.charAt( i );
        const es = backslashes % 2;

        if( !singleQuoted && !doubleQuoted ) {
            const len  = fn( str, i );

            if( len !== false ) {
                if( es ) {
                    substr = substr.slice( 0, -1 );
                    substr += c;
                } else {
                    i += len - 1;
                    res.push( substr );

                    if( res.length >= limit - 1 ) {
                        res.push( str.substr( i + 1 ) );
                        return res;
                    }
                    substr = '';
                }
            } else {
                if( !es ) {
                    singleQuoted = c === '\'';
                    doubleQuoted = c === '"';
                }
                substr += c;
            }
        } else {
            if( singleQuoted && !es && c === '\'' ) {
                 singleQuoted = false;
            } else if( doubleQuoted && !es && c === '"' ) {
                 doubleQuoted = false;
            }
            substr += c;
        }
        c === '\\' ? ( backslashes++ ) : ( backslashes = 0 );
    }
    res.push( substr );
    return res;
}

export default split;
