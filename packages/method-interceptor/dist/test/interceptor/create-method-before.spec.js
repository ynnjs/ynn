"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/create-method-before.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src/");
describe('interceptor/create-method-before', () => {
    it('should created a function', () => {
        const o = { x() { } };
        const descriptor = Reflect.getOwnPropertyDescriptor(o, 'x');
        expect(src_1.createInterceptorBefore(descriptor, {})).toBeInstanceOf(Function);
    });
    it('should return a Promise object by the created function', () => {
        const o = { x() { } };
        const descriptor = Reflect.getOwnPropertyDescriptor(o, 'x');
        expect(src_1.createInterceptorBefore(descriptor, {})()).toBeInstanceOf(Promise);
    });
    it('should return a Promise object which resolves with an empty array by the created function if no methods is given', () => {
        const o = { x() { } };
        const descriptor = Reflect.getOwnPropertyDescriptor(o, 'x');
        expect(src_1.createInterceptorBefore(descriptor)()).resolves.toEqual([]);
    });
    it('should return a Promise object with expected values', () => {
    });
    it('should have called the corresponding methods', () => {
        const o = { x() { } };
        const descriptor = Reflect.getOwnPropertyDescriptor(o, 'x');
        const fn = jest.fn();
        const methods = { fn };
        src_1.createInterceptorBefore(descriptor, methods)();
        expect(fn).toHaveBeenCalledTimes(1);
    });
});
