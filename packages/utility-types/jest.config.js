/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: utility-types/jest.config.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/07/2021
 * Description:
 ******************************************************************/

module.exports = {
    ...require( '../../jest.config.js' ),
    rootDir : __dirname,
    name : '@ynn/utility-types',
    displayName : '@ynn/utility-types',
    testMatch : [
        '**/test/**/*.spec.ts',
        '**/test/**/*.dt.ts'
    ],
    transform : {
        'dt\\.ts$' : 'dts-jest/transform'
    }
};
