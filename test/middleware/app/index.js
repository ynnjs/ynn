#!/usr/bin/env node

const Ynn = require( '../../..' );
const app = new Ynn( { 
    root : __dirname,
    debugging : Ynn.DEBUGGING_DANGER, 
    logging : false,
    routers() {
        const router = this.router;
        router.get( '/', [
            ( ctx, next ) => {
                ctx.body = 'Hi!';
                return next();
            }, ctx => {
                ctx.body += 'Hello Ynn!'
            }
        ] );

        router.add( '/add', [
            ( ctx, next ) => {
                ctx.body = 'Hi!';
                return next();
            }, ctx => {
                ctx.body += 'Hello Ynn!'
            }
        ] );

        router.post( '/complex/post', [
            ( ctx, next ) => {
                ctx.body = 'Hi!';
                return next();
            },
            'index.complexpost'
        ] );

        router.add( '/complex/add', [
            ( ctx, next ) => {
                ctx.body = 'Hi!';
                return next();
            },
            'index.complexpost'
        ] );
    }
} );
require.main === module && app.listen( Ynn.cargs.port );
module.exports = app;
