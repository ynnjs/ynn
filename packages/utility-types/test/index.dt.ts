/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description: 
 ******************************************************************/

/* eslint @typescript-eslint/no-unused-vars: 'off' */

import {
    VariadicFunction,
    VariadicClass,
    ParametersShift,
    Diff,
    PartialKeys,
    PartialExcludesKeys
} from '../src';

function testType<T>(): T {
    return undefined as any;
}

// @dts-jest:group VariadicFunction<P = any[], R = any>
{

    interface O {
        f1?: VariadicFunction;
        f2?: VariadicFunction<[string, number], number>;
    }

    const o: O = {};

    // @dts-jest:pass:snap default arguments
    testType<VariadicFunction>();

    // @dts-jest:pass:snap specific arguments
    testType<VariadicFunction<[string, number], number>>();

    // @dts-jest:pass:snap default arguments
    o.f1 = () => {};

    // @dts-jest:pass:snap specific arguments
    o.f2 = ( a: string, b: number ) => b;
}

// @dts-jest:group VariadicClass<P = any[], T = any>
{

    interface X {
        name: string;
    }

    interface O {
        c1?: VariadicClass;
        c2?: VariadicClass<[string, number], X>
    }

    const o: O = {};

    // @dts-jest:pass:snap variadic arguments and return type
    testType<VariadicClass>();

    // @dts-jest:pass:snap specific arguments
    testType<VariadicClass<[string, number], X>>();

    // @dts-jest:pass:snap default arguments
    o.c1 = class {}

    // @dts-jest:pass:snap specific arguments
    o.c2 = class {
        constructor( public name: string, public age: number ) {}
    }

}

// @dts-jest:group ParametersTail<T extends VariadicFunction, M extends any[] = [ any ]>
{
    interface Fn {
        ( a: string, b: number, c: boolean ): void;
    }

    // @dts-jest:pass:snap should remove the first item in parameters
    const x: ParametersShift<Fn> = [ 123, true ];

    interface Fnn {
        (): void;
    }

    // @dts-jest:pass:snap should return empty parameter list
    const y: ParametersShift<Fnn> = [];
}

// @dts-jest:group Diff<T, U>
{
    // @dts-jest:pass
    const x: Diff<'a' | 'b' | 'c', 'a' | 'b'> = 'c';

    // @dts-jest:fail
    const y: Diff<'a' | 'b' | 'c', 'a' | 'b'> = 'b';
}

// @dts-jest:group PartialKeys<T, M extends keyof T>
{
    interface O {
        name: string;
        age: number;
        sex: number;
    }

    // @dts-jest:fail
    const x: PartialKeys<O, 'name' | 'age'> = {}

    // @dts-jest:fail
    const y: PartialKeys<O, 'name' | 'age'> = { name : 'x' }

    // @dts-jest:pass:snap should make all specific keys optional
    const z: PartialKeys<O, 'name' | 'age'> = { sex : 1 }
}

// @dts-jest:group PartialExcludesKeys<T, M extends keyof T>
{
    interface O {
        name: string;
        age: number;
        sex: number;
    }

    // @dts-jest:fail
    const x: PartialExcludesKeys<O, 'name' | 'age'> = {}

    // @dts-jest:fail
    const y: PartialExcludesKeys<O, 'name' | 'age'> = { name : 'x' }

    // @dts-jest:pass:snap should make all other keys optional
    const z: PartialExcludesKeys<O, 'name' | 'age'> = { name : 'x', age : 1 }
}
