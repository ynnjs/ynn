const Controller = require( '../../../lib/controller' );

module.exports = class extends Controller {
    specifiedConfigDirAction() {
        return {
            level : this.config( 'module.level' )
        }
    }

    localAction() {
        this.console.info( JSON.stringify( this.app.configs, null, '    ' ) );
        return {
            level : this.config( 'local.level' )
        }
    }

    runtimeAction() {
        return {
            level : this.config( 'runtime.level')
        }
    }
}
