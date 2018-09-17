const Interactive = require( '@lvchengbin/interactive' );
const Commands = require( './commands' );

module.exports = app => {
    const commands = new Commands( app );
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
        console.log( 'command: ', command );
        new Function( 'app', 'root', 'show', 'sw', 'sham', `return ${command}` )( 
            commands.app,
            commands.root ,
            commands.show.bind( commands ),
            commands.switch.bind( commands ),
            commands.sham.bind( commands )
        );
    } );

    interactive.on( 'start', () => {
        interactive.prompt();
    } );

    return interactive;
};
