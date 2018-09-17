module.exports = ( app, options = {} ) => app[ options.name ] = class TestPlugin extends require( '../../../lib/plugin' ) {}
