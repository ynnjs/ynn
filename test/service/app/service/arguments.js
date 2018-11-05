module.exports = class {
    constructor( ctx, options ) {
        Object.assign( this, options || {} );
    }
    name() {
        return this.text;
    }
}

