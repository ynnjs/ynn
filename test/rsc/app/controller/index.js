module.exports = class index extends require( '../../../../lib/controller' ) {
    callAction() {
        return this.rsc.call( 'ms:test', {
            token : 'b'
        } );
    }
    getAction() {
        return this.rsc.get( 'ms:test', {
            token : 'c'
        } );
    }

    postAction() {
        return this.rsc.post( 'ms:test', {
            token : 'b'
        } );
    }

    localAction() {
        return this.rsc.post( 'test', {
            token : 'b'
        } );
    }
    apipostAction() {
        return this.rsc.call( 'ms:test/index/post', {
            token : 'b'
        } );
    }

    apigetAction() {
        return this.rsc.call( 'ms:test/index/get', {
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

            this.rsc.call( 'ms:test', {
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

            this.rsc.get( 'ms:test/index/notfound', {
                token : 'b'
            } ).catch( e => {
                this.console.debug( e );
            } );
        } );
    }
}
