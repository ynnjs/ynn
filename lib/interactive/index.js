const Interactive = require( './interactive' );

module.exports = app => {
    const interactive = new Interactive( {
        prompt : 'YNN> ',
        instructions : {
            start : 'Ynn Interactive',
            pause : 'Ynn Uninteractive'
        },
        oo : 'CTRL+Y',
        keys : {
            'show .' : 'CTRL+.'
        },
        completions : [ 'show', 'this', 'app', 'root', 'sham', 'switch' ],
        exit : true,
        help : {
            show : '',
            root : '',
            'this' : '',
            app :  '',
            'switch' : '',
            sham : ''
        }
    } );

    interactive.on( 'command', command => {
        app.console.info( command );
    } );

    interactive.on( 'start', () => {
        interactive.prompt( 'YNN>' );
    } );

    return interactive;
};
