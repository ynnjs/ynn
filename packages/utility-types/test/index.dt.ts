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
    PartialKeys,
    PartialExcludesKeys,
    RequiredKeys,
    RequiredExcludesKeys,
    ReadonlyKeys,
    Writable,
    WritableKeys,
    WritableExcludesKeys
} from '../src';

function testType<T>(): T {
    return undefined as any; // eslint-disable-line @typescript-eslint/no-explicit-any

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

    // @dts-jest:fail:snap the first argument should be a type extends from any[]
    type A = VariadicFunction<string>;
}

// @dts-jest:group VariadicClass<P = any[], T = any>
{

    interface X {
        name: string;
    }

    interface O {
        c1?: VariadicClass;
        c2?: VariadicClass<[string, number], X>;
    }

    const o: O = {};

    // @dts-jest:pass:snap variadic arguments and return type
    testType<VariadicClass>();

    // @dts-jest:pass:snap specific arguments
    testType<VariadicClass<[string, number], X>>();

    // @dts-jest:pass:snap default arguments
    o.c1 = class {};

    // @dts-jest:pass:snap specific arguments
    o.c2 = class {
        constructor( public name: string, public age: number ) {}
    };

    // @dts-jest:fail:snap the first arguments should be a type extends from any[]
    type A = VariadicClass<string>;

    // @dts-jest:pass
    const b: VariadicClass<unknown[], Promise<unknown>> = Promise;

    // @dts-jest:pass
    const c: VariadicClass<unknown[], Promise<string>> = class extends Promise<string> {};
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

    let a: unknown;
    // @dts-jest:fail:snap the return type should be an empty array
    const b: ParametersShift<() => void> = [ a as unknown ];
}

// @dts-jest:group PartialKeys<T, M extends keyof T>
{
    interface O {
        name: string;
        age: number;
        sex: number;
    }

    // @dts-jest:fail
    const a: PartialKeys<O, 'name' | 'age'> = {};

    // @dts-jest:fail
    const b: PartialKeys<O, 'name' | 'age'> = { name : 'x' };

    // @dts-jest:pass:snap should make all specific keys optional
    const c: PartialKeys<O, 'name' | 'age'> = { sex : 1 };

    interface P {
        name?: string;
        age: number;
        sex: number;
    }

    // @dts-jest:pass the optional properties should still be optional
    const d: PartialKeys<P, 'age'> = { sex : 1 };
}

// @dts-jest:group PartialExcludesKeys<T, M extends keyof T>
{
    interface O {
        name: string;
        age: number;
        sex: number;
    }

    // @dts-jest:fail
    const a: PartialExcludesKeys<O, 'name' | 'age'> = {};

    // @dts-jest:fail
    const b: PartialExcludesKeys<O, 'name' | 'age'> = { name : 'x' };

    // @dts-jest:pass:snap should make all other keys optional
    const c: PartialExcludesKeys<O, 'name' | 'age'> = { name : 'x', age : 1 };

    interface P {
        name?: string;
        age: number;
        sex: number;
    }

    // @dts-jest:pass should not change optional properties.
    const d: PartialExcludesKeys<P, 'name' | 'age'> = { age : 1 };
}

// @dts-jest:group RequiredKeys<T, U extends keyof T>
{
    interface O {
        name?: string;
        age?: number;
        sex?: number;
    }

    // @dts-jest:fail should have required properties
    const a: RequiredKeys<O, 'name' | 'age'> = {};

    // @dts-jest:fail should have required properties
    const b: RequiredKeys<O, 'name' | 'age'> = { name : 'x' };

    // @dts-jest:pass
    const c: RequiredKeys<O, 'name' | 'age'> = { name : 'x', age : 1 };

    // @dts-jest:pass
    const d: RequiredKeys<O, 'name' | 'age'> = { name : 'x', age : 1, sex : 1 };
}

// @dts-jest:group RequiredExcludesKeys<T, U extends keyof T>
{
    interface O {
        name?: string;
        age?: number;
        sex?: number;
    }

    // @dts-jest:fail
    const a: RequiredExcludesKeys<O, 'name' | 'age'> = {};

    // @dts-jest:fail:snap
    const b: RequiredExcludesKeys<O, 'name' | 'age'> = { name : 'x', age : 1 };

    // @dts-jest:pass
    const c: RequiredExcludesKeys<O, 'name' | 'age'> = { sex : 1 };
}

// @dts-jest:group ReadonlyKeys<T, K extends keyof T>
{
    interface O {
        name: string;
        age?: number;
        readonly sex?: number;
    }

    // @dts-jest:pass
    const a: ReadonlyKeys<O, 'name'> = { name : 'x' };

    const b: ReadonlyKeys<O, 'name'> = { name : 'x' };
    // @dts-jest:fail
    b.name = 'y';


}

// @dts-jest:group Writable<T>
{
    interface O {
        readonly name: string;
        readonly age: number;
    }

    const a: Writable<O> = { name : 'x', age : 1 };

    // @dts-jest:pass
    a.name = 'y'; a.age = 2;
}

// @dts-jest:group WritableKeys<T, K extends keyof T>
{

    interface O {
        readonly name: string;
        readonly age: number;
        sex: number;
    }

    const a: WritableKeys<O, 'name'> = { name : 'x', age : 1, sex : 1 };

    // @dts-jest:pass
    a.name = 'y';

    // @dts-jest:fail:snap
    a.age = 2;

    // @dts-jest:pass
    a.sex = 2;
}

// @dts-jest:group WritableExcludesKeys<T, K extends keyof T>
{
    interface O {
        readonly name: string;
        readonly age: number;
        sex: number;
    }

    const a: WritableExcludesKeys<O, 'name'> = { name : 'x', age : 1, sex : 1 };

    // @dts-jest:fail:snap
    a.name = 'y';

    // @dts-jest:pass
    a.age = 2;

    // @dts-jest:pass
    a.sex = 2;
}
