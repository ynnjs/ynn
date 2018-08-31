module.exports = ( app, options ) => {
    Object.defineProperty( app, 'testPlugin', {
        get() {
            app.console.debug( options );
            return options;
        }
    } );
};
