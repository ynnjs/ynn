/******************************************************************
 * Copyright (C) 2022 LvChengbin
 *
 * File: controller/id.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 03/29/2022
 * Description:
 ******************************************************************/

module.exports = class index extends require( '../../../../lib/controller' ) {
    indexAction() {
        return this.rsc.get( 'ms:test/id', {}, {
            params : {
                id : this.ctx.query.id ?? 10000
            }
        } );
    }

    defaultAction() {
        return this.rsc.get( 'ms:test/id', {} );
    }
}
