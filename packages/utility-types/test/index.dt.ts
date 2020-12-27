/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description: 
 ******************************************************************/

import { VariadicFunction, ParametersShift } from '../src';

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
    testType<VariadicFunction>()

    // @dts-jest:pass:snap specific arguments
    testType<VariadicFunction<[string, number], number>>();

    // @dts-jest:pass:snap default arguments
    o.f1 = () => {};

    // @dts-jest:pass:snap specific arguments
    o.f2 = ( a: string, b: number ) => b;
}

// @dts-jest:group ParametersTail<T extends VariadicFunction, M extends any[] = [ any ]>
{
    interface Fn {
        ( a: string, b: number, c: boolean ): void;
    }

    // @dts-jest:pass snap should remove the first item in parameters
    const x: ParametersShift<Fn> = [ 123, true ]; // eslint-disable-line @typescript-eslint/no-unused-vars

    interface Fnn {
        (): void;
    }

    // @dts-jest:pass snap should return empty parameter list
    const y: ParametersShift<Fnn> = []; // eslint-disable-line @typescript-eslint/no-unused-vars
}
