/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: utility-types/jest.config.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/07/2021
 * Description:
 ******************************************************************/

module.exports = {
    name : '@ynn/utility-types',
    displayName : '@ynn/utility-types',
    setupFilesAfterEnv : [ 'jest-extended' ],
    testMatch : [
        '**/test/**/*.spec.ts',
        '**/test/**/*.dt.ts'
    ],
    transform : {
        'dt\\.ts$' : 'dts-jest/transform'
    },
    coverageReporters : [
        'text-summary',
        'text',
        'lcov'
    ],
    collectCoverageFrom : [
        'src/**/*.ts'
    ],
    testEnvironment : 'node'
};
