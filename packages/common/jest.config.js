/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: core/jest.config.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/07/2021
 * Description:
 ******************************************************************/

module.exports = {
    ...require( '../../jest.config.js' ),
    rootDir : __dirname,
    name : '@ynn/common',
    displayName : '@ynn/common'
};