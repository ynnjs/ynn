const sleep = require( '@lvchengbin/sleep' );
const Boot = require( '../../lib/boot' );

module.exports = class extends Boot {
    async init() {
        await sleep( 50 );
        this.ctx._boot = 'boot';
    }
}
