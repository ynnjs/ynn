/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: configs/recommended.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/23/2020
 * Description:
 ******************************************************************/

export = {
    extends : [ './configs/eslint-recommended' ],
    rules : {
        '@z-toolkit/no-literal-url' : 'error'
    }
}
