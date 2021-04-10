/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: body/jest.config.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/09/2020
 * Description:
 ******************************************************************/

module.exports = {
    ...require( '../../jest.config.js' ),
    rootDir : __dirname,
    name : '@ynn/body',
    displayName : '@ynn/body',
    collectCoverageFrom : [
        'src/**/*.ts',
        '!**/*.d.ts'
    ]
};
