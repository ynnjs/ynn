/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: body/jest.config.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/09/2020
 * Description: 
 ******************************************************************/

module.exports = {
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
}
