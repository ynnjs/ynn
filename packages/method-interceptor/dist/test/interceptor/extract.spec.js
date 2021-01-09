"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interceptor/extract-method.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/24/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constants_1 = require("../../src/constants");
const extract_1 = __importDefault(require("../../src/interceptor/extract"));
describe('interceptor/extract', () => {
    [
        { t: 'before', k: constants_1.KEY_BEFORE },
        { t: 'after', k: constants_1.KEY_AFTER },
        { t: 'exception', k: constants_1.KEY_EXCEPTION }
    ].forEach((x) => {
        describe(`extract.${x.t}`, () => {
            it('should return the correct list of bound methods', () => {
                class A {
                    action() { }
                } // eslint-disable-line class-methods-use-this
                const methods = { fn() { } };
                const descriptor = Reflect.getOwnPropertyDescriptor(A.prototype, 'action');
                const metadata = [{
                        type: 'fn',
                        interceptorType: x.t
                    }];
                if (descriptor) {
                    Reflect.defineMetadata(x.k, metadata, descriptor.value);
                    const bound = extract_1.default[x.t](descriptor, methods);
                    expect(bound).toEqual([{
                            method: methods.fn,
                            metadata: metadata[0]
                        }]);
                }
            });
            it('should use undefined if some type of interceptor does not have corresponding method', () => {
                class A {
                    action() { }
                } // eslint-disable-line class-methods-use-this
                const methods = {};
                const descriptor = Reflect.getOwnPropertyDescriptor(A.prototype, 'action');
                const metadata = [{
                        type: 'fn',
                        interceptorType: x.t
                    }];
                if (descriptor) {
                    Reflect.defineMetadata(x.k, metadata, descriptor.value);
                    const bound = extract_1.default[x.t](descriptor, methods);
                    expect(bound).toEqual([{
                            method: undefined,
                            metadata: metadata[0]
                        }]);
                }
            });
            it('should have returned an empty array if metadata not exists', () => {
                class A {
                    action() { }
                } // eslint-disable-line class-methods-use-this
                const methods = {};
                const descriptor = Reflect.getOwnPropertyDescriptor(A.prototype, 'action');
                expect(extract_1.default[x.t](descriptor, methods)).toEqual([]);
            });
        });
    });
    describe('extract.parameter', () => {
        it('should only have parameter metadata', () => {
            class A {
                action() { }
            } // eslint-disable-line class-methods-use-this
            const methods = { fn() { } };
            Reflect.defineMetadata('design:paramtypes', [String], A.prototype, 'action');
            expect(extract_1.default.parameter(A, 'action', methods)).toEqual([{
                    method: undefined,
                    metadata: {
                        paramtype: String
                    }
                }]);
        });
        it('should have both parameter metadata and interceptor metadata', () => {
            class A {
                action() { }
            } // eslint-disable-line class-methods-use-this
            const methods = { fn() { } };
            const metadata = [{
                    type: 'fn',
                    interceptorType: 'parameter'
                }];
            Reflect.defineMetadata('design:paramtypes', [String], A.prototype, 'action');
            Reflect.defineMetadata(constants_1.KEY_PARAMETER, metadata, A.prototype, 'action');
            expect(extract_1.default.parameter(A, 'action', methods)).toEqual([{
                    method: methods.fn,
                    metadata: {
                        ...metadata[0],
                        paramtype: String
                    }
                }]);
        });
    });
});
