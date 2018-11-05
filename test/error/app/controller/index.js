module.exports = class extends require( '../../../../lib/controller' ) {
    e500Action() {
        this.throw( 500 );
    }

    e502Action() {
        this.throw( 502 );
    }

    e400Action() {
        this.throw( 400 );
    }

    e404Action() {
        this.throw( 404 );
    }

    e403Action() {
        this.throw( 403 );
    }
}
