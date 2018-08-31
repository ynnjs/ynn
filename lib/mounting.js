module.exports = {
    status : 0,
    set( obj ) {
        Object.assign( this, obj );
        this.status = 1;
    },
    reset() {
        this.status = 0;
    }
};
