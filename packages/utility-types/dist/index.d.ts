/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description:
 ******************************************************************/
/**
 * create a type of variadic function
 */
export declare type VariadicFunction<P extends any[] = any[], R = any> = ( ...args: P ) => R;
export declare type GlobalFunction = Function;
export declare type VoidFunction<P extends any[] = any[]> = VariadicFunction<P, void>;
export declare type VariadicClass<P extends any[] = any[], T = any> = new ( ...args: P ) => T;
export declare type VariadicObject = object;
export declare type Shift<T extends unknown[]> = T extends [_: unknown, ...args: infer U] ? U : [];
export declare type ParametersShift<T extends VariadicFunction> = Shift<Parameters<T>>;
/**
 * PartialKeys<Type, KeysUnion>
 *
 * Constructs a type with all properties of `Type` and set keys in `KeysUnion` to `optional`.
 *
 * @example
 *
 * ```ts
 * interface Example {
 *     name: string;
 *     value: number;
 * }
 *
 * type ExampleWithOptionalValue = PartialKeys<Example, 'value'>;
 *
 * const example: ExampleWithOptionalValue = {
 *     // property "name" is still required but property "value" is optional
 *     name : 'x'
 * };
 * ```
 */
export declare type PartialKeys<T, M extends keyof T> = Omit<T, M> & Partial<Pick<T, M>>;
/**
 * PartialExcludesKeys<Type, KeysUnion>
 *
 * Constructs a type with all properties of `Type` and set properties to `optional` except keys in `KeysUnion`.
 *
 * @example
 *
 * ```ts
 * interface Example {
 *     name: string;
 *     value: number;
 * }
 *
 * type ExampleWithOptionalValue = PartialExcludesKeys<Example, 'name'>;
 *
 * const example: ExampleWithOptionalValue = {
 *     // property "name" is required but property "value" is optional
 *     name : 'x'
 * };
 * ```
 */
export declare type PartialExcludesKeys<T, M extends keyof T> = Partial<Omit<T, M>> & Pick<T, M>;
/**
 * RequiredKeys<Type, KeysUnion>
 *
 * Constructs a type consisting of all properties of `Type` but set properties in `KeysUnion` to required.
 */
export declare type RequiredKeys<T, U extends keyof T> = Required<Pick<T, U>> & Omit<T, U>;
/**
 * RequiredExcludesKeys<Type, KeysUnion>
 *
 * Constructs a type consisting of all properties of `Type` and set all properties not in `KeysUnion` to required.
 */
export declare type RequiredExcludesKeys<T, U extends keyof T> = Required<Omit<T, U>> & Pick<T, U>;
export declare type ReadonlyKeys<T, K extends keyof T> = Readonly<Pick<T, K>> & Omit<T, K>;
export declare type ReadonlyExcludesKeys<T, K extends keyof T> = Readonly<Omit<T, K>> & Pick<T, K>;
/**
 * Writable<Type>
 *
 * Constructs a type with all properties of `Type` and make them mutable.
 */
export declare type Writable<T> = {
    -readonly [P in keyof T]: T[P];
};
export declare type WritableKeys<T, K extends keyof T> = Writable<Pick<T, K>> & Omit<T, K>;
export declare type WritableExcludesKeys<T, K extends keyof T> = Writable<Omit<T, K>> & Pick<T, K>;
export declare type Valueof<T> = T[keyof T];
