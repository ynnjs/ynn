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
export type VariadicFunction<P extends any[] = any[], R = any> = ( ...args: P ) => R; // eslint-disable-line @typescript-eslint/no-explicit-any

export type VariadicClass<P extends any[] = any[], T = any> = new ( ...args: P ) => T; // eslint-disable-line @typescript-eslint/no-explicit-any

export type ParametersShift<T extends VariadicFunction> = ( ( ...args: Parameters<T> ) => any ) extends ( ( _: any, ...args: infer U ) => any ) ? U : []; // eslint-disable-line @typescript-eslint/no-explicit-any


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
export type PartialKeys<T, M extends keyof T> = Omit<T, M> & Partial<Pick<T, M>>;

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
export type PartialExcludesKeys<T, M extends keyof T> = Partial<Omit<T, M>> & Pick<T, M>;

/**
 * RequiredKeys<Type, KeysUnion>
 *
 * Constructs a type consisting of all properties of `Type` but set properties in `KeysUnion` to required.
 */
export type RequiredKeys<T, U extends keyof T> = Required<Pick<T, U>> & Omit<T, U>;

/**
 * RequiredExcludesKeys<Type, KeysUnion>
 *
 * Constructs a type consisting of all properties of `Type` and set all properties not in `KeysUnion` to required.
 */
export type RequiredExcludesKeys<T, U extends keyof T> = Required<Omit<T, U>> & Pick<T, U>;

export type ReadonlyKeys<T, K extends keyof T> = Readonly<Pick<T, K>> & Omit<T, K>;

export type ReadonlyExcludesKeys<T, K extends keyof T> = Readonly<Omit<T, K>> & Pick<T, K>;

/**
 * Writable<Type>
 *
 * Constructs a type with all properties of `Type` and make them mutable.
 */
export type Writable<T> = { -readonly [ P in keyof T ]: T[ P ] }

export type WritableKeys<T, K extends keyof T> = Writable<Pick<T, K>> & Omit<T, K>;

export type WritableExcludesKeys<T, K extends keyof T> = Writable<Omit<T, K>> & Pick<T, K>;
