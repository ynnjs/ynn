module.exports = class extends require( '../../../../lib/service' ) {
    name() {
        return 'name';
    }
    getAppName() {
        return this.config( 'app.name' );
    }
}
