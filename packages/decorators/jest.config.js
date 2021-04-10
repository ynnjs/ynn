/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/jest.config.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/06/2021
 * Description:
 ******************************************************************/

module.exports = {
    ...require( '../../jest.config.js' ),
    rootDir : __dirname,
    name : '@ynn/decorators',
    displayName : '@ynn/decorators'
};
