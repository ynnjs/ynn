module.exports = class extends require( '../../../lib/controller' ) {
    callAction() {
        return this.rsc.call( 'ms:test/ms', {
            token : 'b'
        } );
    }
    getAction() {
        return this.rsc.get( 'ms:test/ms', {
            token : 'c'
        } );
    }

    postAction() {
        return this.rsc.post( 'ms:test/ms', {
            token : 'b'
        } );
    }

    localAction() {
        return this.rsc.post( 'test/ms', {
            token : 'b'
        } );
    }
    apipostAction() {
        return this.rsc.call( 'ms:test/ms/post', {
            token : 'b'
        } );
    }

    apigetAction() {
        return this.rsc.call( 'ms:test/ms/get', {
            token : 'b'
        } );
    }

    successAction() {
        return new Promise( resolve => {
            this.rsc.on( 'success', ( res, options ) => {
                resolve( {
                    status : 'OK',
                    onsuccess : true,
                    token : options.qs.token
                } );
            } );

            this.rsc.call( 'ms:test/ms', {
                token : 'b'
            } );
        } );
    }

    failureAction() {
        return new Promise( resolve => {
            this.rsc.on( 'failure', ( res, options ) => {
                resolve( {
                    status : 'OK',
                    onfailure : true,
                    token : options.qs.token
                } );
            } );

            this.rsc.get( 'ms:test/ms/notfound', {
                token : 'b'
            } ).catch( e => {
                this.console.debug( e );
            } );
        } );
    }
}
