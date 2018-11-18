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
            expect( app.services ).toBeDefined();
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
            expect( app.find( 'sub' ).name ).toEqual( 'sub' );
        } );

        it( 'parent', () => {
            expect( app.find( 'sub' ).parent ).toEqual( app );
        } );

        it( 'top', () => {
            expect( app.find( 'sub' ).top ).toEqual( app );
            expect( app.top ).toEqual( app );
        } );

        it( 'log-path', () => {
            expect( app[ 'log-path' ] ).toEqual( path.join( app.root, 'log' ) );
            expect( app.find( 'sub' )[ 'log-path' ] ).toEqual( path.join( app.root, 'log', 'sub' ) );
        } );

        it( 'path', () => {
            expect( app.path ).toEqual( undefined );
            expect( app.find( 'sub' ).path ).toEqual( [ 'sub' ] );
        } );

        it( 'logging', () => {
            expect( app.logging ).toBeFalsy();
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

    describe( 'app config', () => {

        it( 'app.controller.path', () => {
            expect( app.controllers.index ).toBeDefined(  );     
        } );

        it( 'app.service.path', () => {
            expect( app.services.index ).toBeDefined(  );     
        } );
        
    } );
} );

