const readline = require( 'readline' );
const strip = require( 'strip-ansi' );
const is = require( '@lvchengbin/is' );
const escape = require( '@lvchengbin/escape' );
const isKey = require( './is-key' );
const man = require( './man' );

const helpCommands = [ 'help', 'man', '?', '??' ];
const exitCommands = [ 'exit', 'quit' ];

function isMan( cmd ) {
    cmd = cmd.trim();
    if( !cmd ) return false;
    for( const item of helpCommands ) {
        if( item.toLowerCase() === cmd.toLowerCase() ) return true;
        const reg = new RegExp( `${escape.regexp(item)}[ \\t]+(.*)` );
        const matches = cmd.match( reg );
        if( matches ) return matches[ 1 ];
    }
    return false;
}

function isExit( cmd ) {
    cmd = cmd.trim();
    for( const item of exitCommands ) {
        if( item.toLowerCase() === cmd.toLowerCase() ) return true;
    }
    return false;
}

class Interactive extends require( 'events' ) {
    constructor( options = {} ) {
        super();
        const { stdin, stdout } = process;

        this.active = false;
        this.options = options;

        if( !this.options.instructions ) {
            this.options.instructions = {};
        }

        const opts = {
            input : stdin, 
            output : stdout,
            removeHistoryDuplicates : true,
            prompt : options.prompt || '>',
            terminal : true
        };

        if( options.completer ) {
            opts.completer = options.completer.bind( this );
        }

        if( options.help ) {
            this.help = options.help;
        }

        if( options.completions || this.help || this.exit ) {
            this.completions = options.completions || [];
            if( this.help ) {
                this.completions.push( ...helpCommands );
            }
            if( this.options.exit ) {
                this.completions.push( ...exitCommands );
            }
        }

        if( this.completions && !options.completer ) {
            opts.completer = this.completer.bind( this );
        }

        this.rl = readline.createInterface( opts );

        this.rl.on( 'line', cmd => {
            this.exec( cmd.trim() );
        } );

        stdin.setEncoding( this.options.encoding || 'utf8' );

        /**
         * The process.setRawMode function can only be used inside a TTY context, and it can be checked with process.stdout.isTTY.
         * But if starting this nodejs process with some process management toolkits, such as nodemon, a child process will be used, and the process.stdout.isTTY will return a true value, but the process.stdin.setRawMode is undefined.
         *
         * to start nodemon with --no-stdin or -I
         */
        is.function( stdin.setRawMode ) && stdin.setRawMode( true );

        stdin.on( 'keypress', ( chunk, key ) => {
            if( options.oo ) {
                if( isKey( key, options.oo ) ) return this.toggle();
            }

            if( options.keys ) {
                for( const command of Object.keys( options.keys ) ) {
                    if( isKey( key, options.keys[ command ] ) ) {
                        return this.exec( command );
                    }
                }
            }
        } );

        readline.emitKeypressEvents( process.stdin, this.rl );
    }

    completer( line ) {
        const hits = this.completions.filter( c => {
            if( !c.indexOf( line ) ) return c;
        } );
        return [ hits && hits.length ? hits : [], line ]
    }

    start() {
        this.active = true;
        this.prompt( this.options.prompt );
        this.emit( 'start' );
        return this;
    }

    pause() {
        this.active = false;
        this.emit( 'pause' );
        return this;
    }

    toggle() {
        if( this.active ) {
            return this.pause();
        }
        return this.start();
    }

    close() {
        this.emit( 'close' );
        return this;
    }

    exec( cmd ) {
        cmd = cmd.trim();
        const instructions = this.options.instructions;
        if( !this.active ) {
            if( !cmd ) return;
            if( cmd === instructions.start ) {
                this.start();
                return;
            }
            this.prompt( '' );
            return;
        }

        if( this.active ) {
            if( !cmd ) return this.prompt();
            if( cmd === instructions.pause ) {
                this.pause();
                return;
            }

            if( this.help ) {
                const man = isMan( cmd );
                if( man === true ) return this.man();
                if( is.string( man ) ) return this.man( man );
            }

            if( this.exit && isExit( cmd ) ) {
                return this.pause();
            }
        }
        this.emit( 'command', cmd );
    }

    man( item ) {
        if( !this.help ) return man( 'No help information!' );
        item = strip( item );
        if( !item ) return man( this.help );
        if( this.help[ item ] ) return man( this.help[ item ] );
        man( `Cannot find help information of "${item}"` );
    }

    prompt( tag ) {
        if( !is.undefined( tag ) ) this.tag = tag;
        this.rl.setPrompt( this.tag || '>' );
        this.rl.prompt();
    }
}

module.exports = Interactive;
