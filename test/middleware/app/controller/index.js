module.exports = class extends require( '../../../..' ).Controller {
    complexpostAction() {
        this.ctx.body += 'Hello Ynn!';
    }
}
