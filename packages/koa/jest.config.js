/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: koa/jest.config.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 09/29/2020
 * Description: 
 ******************************************************************/

module.exports = {
    preset : 'ts-jest',
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
    testEnvironment : 'node'
}