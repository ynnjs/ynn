class TestPlugin extends require( '../../../../lib/plugin' ) {}

module.exports = ( app, options = {} ) => {
    app[ options.name ] = TestPlugin;
}
