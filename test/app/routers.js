module.exports = app => {

    app.router.add( '/error/(\\d+)', ( ctx, next, code ) => `error.e${code}` );

    app.router.get( '/for-testing-routers', ctx => {
        ctx.body = { status : 'OK' };
    } );

    app.router.get( '/async', async ctx => {
        ctx.body = { status : 'OK' };
    } );

    app.router.mount( '/to-test-router', {
        module : 'test-router',
        path : '/'
    } );

    app.router.get( '/customize/action', {
        controller : 'customize',
        action : 'action'
    } );
}
