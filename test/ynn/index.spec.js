const path = require( 'path' );
const Koa = require( 'koa' );
const Config = require( '@lvchengbin/config' );
const is = require( '@lvchengbin/is' );
const app = require( './app' );

require('max-listeners-exceeded-warning')();

describe( 'Ynn', () => {
    beforeAll( () => app.ready() );

    it( 'extends from Koa', () => {
        expect( app instanceof Koa ).toBeTruthy(); 
    } );

    describe( 'properties', () => {
        it( 'console', () => {
            expect( 'console' in app ).toBeTruthy();  
        } );

        it( 'configs', () => {
            for( const item of app.configs ) {
                expect( item instanceof Config ).toBeTruthy();
            }
        } );

        it( 'controllers', () => {
            expect( 'controllers' in app ).toBeTruthy();
        } );

        it( 'services', () => {
            expect( 'services' in app ).toBeTruthy();
        } );

        it( 'not isModule', () => {
            expect( app.isModule ).toBeFalsy();
            expect( app.find( 'sub' ).isModule ).toBeTruthy();
        } );

        it( 'root', () => {
            expect( app.root ).toEqual( path.join( __dirname, 'app' ) ); 
        } );

        it( 'root module has no mounting name', () => {
            expect( app.name ).toEqual( undefined ); 
        } );

        it( 'mounting name', () => {
            expect( app.find( 'sub' ).name ).toBeTruthy( 'sub' );
        } );

        it( 'parent', () => {
            expect( app.find( 'sub' ).parent ).toEqual( app );
        } );

        it( 'top', () => {
            expect( app.find( 'sub' ).top ).toEqual( app );
            expect( app.top ).toEqual( app );
        } );

        it( 'logDir', () => {
            expect( app.logDir ).toEqual( path.join( app.root, 'log' ) );
            expect( app.find( 'sub' ).logDir ).toEqual( path.join( app.root, 'log', 'sub' ) );
        } );

        it( 'path', () => {
            expect( app.path ).toEqual( undefined );
            expect( app.find( 'sub' ).path ).toEqual( [ 'sub' ] );
        } );

        it( 'logging', () => {
            expect( app.logging ).toBeFalsy();
        } );

        it( 'configDir', () => {
            expect( app.configDir ).toEqual( path.join( app.root, 'config' ) );
        } );

        it( 'logger', () => {
            expect( 'logger' in app ).toBeTruthy();
        } );
    } );

    describe( 'methods', () => {
        it( 'listen', () => {
            expect( is.function( app.listen ) ).toBeTruthy(); 
        } );        

        it( 'listenIPCSocket', () => {
            expect( is.function( app.listenIPCSocket ) ).toBeTruthy(); 
        } );

        it( 'preuse', done => {
            app.preuse( ( ctx, next ) => {
                done();
                return next();
            } );
            app.sham( '/' );
        } );

        it( 'config', () => {
            expect( app.config( 'rsc-local' ) ).toEqual( require( '../../lib/config/rsc-local' ) );
        } );

        it( 'sham', () => {
            expect( is.promise( app.sham( '/' ) ) ).toBeTruthy();
            expect( is.function( app.sham( '/', { promise : false } ).pipe ) ).toBeTruthy();
        } );

        it( 'find', () => {
            expect( app.find( 'sub' ) ).toEqual( require( './sub' ) );
        } );

        it( 'sibling', () => {
            expect( app.find( 'sub' ).sibling( 'sub2' ) ).toEqual( require( './sub2' ) );
        } );

    } );

    //it( 'plugin', () => {
        //expect( app.redis ).toEqual( 'redis' );
        //expect( app[ 'another-redis' ] ).toEqual( 'redis' );
        //const test = new app.ExtendsPlugin( app );
        //expect( test instanceof Plugin ).toBeTruthy();
        //expect( is.class( app.OrdinaryClass ) ).toBeFalsy();
    //} );
} );

