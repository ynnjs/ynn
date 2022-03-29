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
        return this.ctx.params.id;
    }
}
