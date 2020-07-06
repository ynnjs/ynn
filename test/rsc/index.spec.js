//const path = require( 'path' );
const request = require( 'supertest');
//const Ynn = require( '../..' );
const app = require( './app' );
const sp = require( '../helpers/symbol-property' );

//async function create() {
    //const app = new Ynn( {
        //root : path.resolve( __dirname, 'app' ),
        //debugging : Ynn.DEBUGGING_DANGER,
        //logging : false,
        //modules : {
            //test : '../sub'
        //}
    //} );

    //await app.ready();
    //return app;
//}

require('max-listeners-exceeded-warning')();

describe( 'rsc', () => {

    beforeAll( () => app.ready() );

    describe( 'request', () => {
        it( 'call', done => {
            request( app.listen() ).get( '/index/call' )
                .expect( 200 )
                .expect( { 
                    status : 'RSC',
                    method : 'GET',
                    token : 'b',
                    'rsc-header' : 'ms'
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

        it( 'get', done => {
            request( app.listen() ).get( '/index/get' )
                .expect( 200 )
                .expect( { 
                    status : 'RSC',
                    method : 'GET',
                    token : 'c',
                    'rsc-header' : 'ms'
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

        it( 'post', done => {
            request( app.listen() ).post( '/index/post' )
                .expect( 200 )
                .expect( { 
                    status : 'RSC',
                    method : 'POST',
                    token : 'b',
                    'rsc-header' : 'ms'
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

        it( '~', done => {
            request( app.listen() ).post( '/index/local' )
                .expect( 200 )
                .expect( { 
                    status : 'RSC',
                    method : 'POST',
                    token : 'b'
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

    } );

    describe( 'api', () => {
        it( 'post', done => {
            request( app.listen() ).post( '/index/apipost' )
                .expect( 200 )
                .expect( { 
                    method : 'POST',
                    token : 'b',
                    headers : {
                        api : 'test-post'
                    }
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

        it( 'get', done => {
            request( app.listen() ).post( '/index/apiget' )
                .expect( 200 )
                .expect( { 
                    method : 'GET',
                    token : 'b',
                    headers : {
                        api : 'test-get'
                    }
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );
    } );

    describe( 'events', () => {
        it( 'success', done => {
            request( app.listen() ).get( '/index/success' )
                .expect( 200 )
                .expect( {
                    status : 'OK',
                    onsuccess : true,
                    token : 'b'
                } )
                .end( e => e ? done.fail( e ) : done() );
        } );

        it( 'failure', done => {
            request( app.listen() ).get( '/index/failure' )
                .expect( 200 )
                .expect( {
                    status : 'OK',
                    onfailure : true,
                    token : 'b'
                } ) 
                .end( e => e ? done.fail( e ) : done() );
        } );
    } );

    describe( 'Symbol(get#request#options)', () => {
        it( 'basic', () => {
            const fn = sp( app.rsc, 'get#request#options' );
            const opts = fn.call( app.rsc, 'http://localhost', {}, {}, true );
            expect( opts ).toHaveProperty( 'uri', 'http://localhost' );
            expect( opts ).toHaveProperty( 'method', 'GET' );
            expect( opts ).toHaveProperty( 'json', true );
            expect( opts ).toHaveProperty( 'timeout', 5000 );
            expect( opts ).toHaveProperty( 'headers', {} );
        } );

        it( 'specifying default headers', () => {
            const fn = sp( app.rsc, 'get#request#options' );
            const opts = fn.call( app.rsc, 'a:api-1', {} );
            expect( opts ).toHaveProperty( 'uri', 'http://www.zuoshouyisheng.com/api-1' );
            expect( opts ).toHaveProperty( 'method', 'GET' );
            expect( opts ).toHaveProperty( 'json', true );
            expect( opts ).toHaveProperty( 'timeout', 10000 );
            expect( opts.headers ).toEqual( {
                'x-default-header-1' : 's-header-1',
                'x-default-header-2' : 'a-header-2'
            } );
            expect( opts ).toHaveProperty( 'qs.x', 1 );
            expect( opts ).toHaveProperty( 'qs.y', 2 );
            expect( opts ).toHaveProperty( 'qs.z', 3 );
        } );

        it( 'specifying default headers', () => {
            const fn = sp( app.rsc, 'get#request#options' );
            const opts = fn.call( app.rsc, 'a:api-2', {} );
            expect( opts ).toHaveProperty( 'uri', 'http://www.zuoshouyisheng.com/api-2' );
            expect( opts ).toHaveProperty( 'method', 'POST' );
            expect( opts ).toHaveProperty( 'json', true );
            expect( opts ).toHaveProperty( 'timeout', 10000 );
            expect( opts.headers ).toEqual( {
                'x-default-header-1' : 's-header-1',
                'x-default-header-2' : 'a-header-2'
            } );
            expect( opts ).toHaveProperty( 'form.x', 1 );
            expect( opts ).toHaveProperty( 'form.y', 2 );
            expect( opts ).toHaveProperty( 'form.z', 3 );
        } );

        it( 'specifying default headers', () => {
            const fn = sp( app.rsc, 'get#request#options' );
            const opts = fn.call( app.rsc, 'a:api-3', {} );
            expect( opts ).toHaveProperty( 'uri', 'http://www.zuoshouyisheng.com/api-3' );
            expect( opts ).toHaveProperty( 'method', 'POST' );
            expect( opts ).toHaveProperty( 'json', true );
            expect( opts ).toHaveProperty( 'timeout', 3000 );
            expect( opts.headers ).toEqual( {
                'x-default-header-1' : 's-header-1',
                'x-default-header-2' : 'a-header-2',
                'content-type' : 'application/json; charset=utf-8'
            } );
            expect( opts ).toHaveProperty( 'body.x', 1 );
            expect( opts ).toHaveProperty( 'body.y', 2 );
            expect( opts ).toHaveProperty( 'body.z', 3 );
        } );
    } );
} );
