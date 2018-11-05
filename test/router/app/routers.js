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

    app.router.get( '/custom/rule/to/action', {
        controller : 'index',
        action : 'custom'
    } );

    app.router.get( '/custom/rule/to/action/2', 'index.custom' );
    app.router.get( '/custom/rule/to/action/3', () => 'index.custom' );
    app.router.get( '/custom/rule/to/action/4', () => {
        return {
            controller : 'index',
            action : 'custom'
        };
    } );

    app.router.mount( '/custom/rule/to/module/without/modifying/original/path', {
        module : 'submodule'
    } );

    app.router.mount( '/custom/rule/to/module/with/a/new/path', {
        module : 'submodule',
        path : '/ping'
    } );
}
