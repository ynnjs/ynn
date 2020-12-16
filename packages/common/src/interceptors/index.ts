/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptors/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/16/2020
 * Description:
 ******************************************************************/

export interface Interceptors<T extends any[]> {
    before: ( ...args: T ) => void;
    after: ( value: any, ...args: T ) => any;
    arguments: any[];
    exception: ( ...args: any[] ) => any;
}

export default function generateInterceptor<T extends any[], E extends any[]>( constructor, descriptor, methodName, ...args: T ): Interceptors<T> {
    const before = ( ...args: T ) => {
    };

    const after = ( value: any, ...args: T ) => {
    };

    const param: any[] = [];

    const exception = ( ...args: E ) => {
    };

    return { before, after, params, exception }
}
