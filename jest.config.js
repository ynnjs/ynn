/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: ynn/jest.config.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/06/2021
 * Description:
 ******************************************************************/

module.exports = {
    preset : 'ts-jest',
    setupFilesAfterEnv : [ 'jest-extended', '@ynn/jest-extended/src/index.ts' ],
    testMatch : [
        '**/test/**/*.spec.ts'
    ],
    coverageReporters : [
        'text-summary',
        'text',
        'lcov'
    ],
    collectCoverageFrom : [
        '**/src/**/*.ts',
        '!**/*.d.ts'
    ],
    testEnvironment : 'node',
    globals : {
        'ts-jest' : {
            isolatedModules : true
        }
    },
    moduleNameMapper : {
        '@ynn/(.*)' : `${__dirname}/packages/$1/src/index.ts`
    }
};
