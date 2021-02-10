/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: example/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/01/2021
 * Description:
 ******************************************************************/


import Ynn from 'ynn';

new Ynn( {
    providers : [],
    controllers : [],
    config : {},
    logger: {},
    routers : [
        [ 'get', '/user/*', 'user.index' ]
    ]
} );
