const util = require( 'util' );
const chalk = require( 'chalk' );
const is = require( '@lvchengbin/is' );
const stackTrace = require( 'stack-trace' );
const constants = require( './constants' );

function inspect( ...args ) {
    const res = [];
    for( let arg of args ) {
        if( is.object( arg ) ) {
            res.push( util.inspect( arg ) );
        } else {
            res.push( arg );
        }
    }
    return res;
}

function csp( s ) {
    return chalk.hex( '#999' )( s );
}

const sp = csp( '->' );
const spcc = csp( '::' );
const spd = csp( '.' );

function gtag( app, ...append ) {
    const tags = app.paths ? [ `Y${sp}${app.paths.join( sp )}` ] : [ 'Y' ];

    for( const item of append ) {
        tags.push( item );
    }
    return '[' + tags.join( spcc ) + ']';
}

/**
 * to wrap the instance of Console class with Proxy for checking if the debugging mode is on before printing logs.
 */
class Console {
    constructor( instance, type ) {

        const get = function( obj, prop ) {
            const level = instance.debugging;
            if( level === false ) return () => {};

            check : {
                if( level === true ) break check;
                if( !( level & constants[ 'DEBUGGING_' + prop.toUpperCase() ] ) ) return () => {};
            }

            const trace = stackTrace.parse( new Error );

            let tag;

            switch( type ) {
                case 'controller' : {
                    const method = trace[ 1 ].methodName;
                    const name = method.replace( /Action$/, '' );

                    if( name.length === method.length - 6 ) {
                        tag = gtag( instance.app, `${instance.controllerName}`, name );
                    } else {
                        tag = gtag( instance.app, `${instance.controllerName}`, method );
                    }
                    break;
                }
                case 'service' : {
                    const method = trace[ 1 ].methodName;
                    if( instance.app.paths ) {
                        tag = `[Y${sp}${instance.app.paths.join(sp)}${spcc}service${spd}${instance.serviceName}${spd}${method}]`;
                    } else {
                        tag = `[Y${spcc}${instance.serviceName}${spd}${method}]`;
                    }
                    break;
                }
                case 'router' :
                    tag = gtag( instance.app, 'router' );
                    break;
                case 'rsc' :
                    tag = gtag( instance.app, 'rsc' );
                    break;
                default :
                    tag = gtag( instance );
            }

            return ( ...args ) => {
                const colors = Console.COLORS;

                const content = chalk.hex( colors[ prop ] || '#FFFFFF' )( ...( inspect( ...args ) ) );
                const m = console[ prop ] || console.log;
                if( tag ) {
                    m.call( console, chalk.hex( colors.$tag || colors[ prop ] )( tag ), content );
                } else {
                    m.call( console, content );
                }
            };
        };
        return new Proxy( {}, { get } );
    }
}

Console.COLORS = {
    $tag : '#ffa9a9',
    spec : '#00F000',
    log : '#00ffff',
    warn : '#FFA500',
    error : '#FF0000',
    info : '#FFFF00',
    debug : '#2f83f3'
};
module.exports = Console;
