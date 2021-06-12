/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: ynn/jest.config.base.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 06/13/2021
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
    transformIgnorePatterns : [
        '\\.pnp\\.[^\\/]+$'
    ],
    moduleNameMapper : {
        '@ynn/(.*)' : `${__dirname}/packages/$1/src/index.ts`
    }
};
