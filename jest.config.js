/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: ynn/jest.config.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/06/2021
 * Description:
 ******************************************************************/

module.exports = {
    rootDir : __dirname,
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
    testEnvironment : 'node',
    globals : {
        'ts-jest' : {
            isolatedModules : true
        }
    },
    moduleNameMapper : {
        '@ynn/(.*)' : '<rootDir>/packages/$1/src/index.ts'
    }
};
