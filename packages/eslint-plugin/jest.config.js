/******************************************************************
 * Copyright (C) 2021 LvChengbin
 * 
 * File: method-interceptor/jest.config.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/02/2021
 * Description: 
 ******************************************************************/

module.exports = {
    preset : 'ts-jest',
    setupFilesAfterEnv : [ 'jest-extended' ],
    testMatch : [
        '**/test/**/*.spec.ts'
    ],
    coverageReporters : [
        'text-summary',
        'text',
        'lcov'
    ],
    collectCoverageFrom : [
        'src/**/*.ts'
    ],
    testEnvironment : 'jsdom'
}
