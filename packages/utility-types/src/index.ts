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
export type VariadicFunction<P extends any[] = any[], R = any> = ( ...args: P ) => R;

export type VariadicClass<P extends any[] = any[], T = any> = new ( ...args: P ) => T;

export type ParametersShift<T extends VariadicFunction> = ( ( ...args: Parameters<T> ) => any ) extends ( ( _: any, ...args: infer U ) => any ) ? U : [];

/**
 * Diff<Type, UnionTypes>
 */
export type Diff<T, U> = T extends U ? never : T;

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
export type PartialKeys<T, M extends keyof T> = { [ P in Diff<keyof T, M> ]: T[ P ] } & { [ P in M ]?: T[ P ] }

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
 *
 */
export type PartialExcludesKeys<T, M extends keyof T> = { [ P in keyof T ]?: T[ P ] } & { [ P in M ]: T[ P ] }

/**
 * RequiredKeys<Type, KeysUnion>
 *
 * Constructs a type consisting of all properties of `Type` but set properties in `KeysUnion` to required.
 */
export type RequiredKeys<T, U extends keyof T> = { [ P in U ]-?: NonNullable<T[ P ]> } & T;

/**
 * RequiredExcludesKeys<Type, KeysUnion>
 *
 * Constructs a type consisting of all properties of `Type` and set all properties not in `KeysUnion` to required.
 */
export type RequiredExcludesKeys<T, U extends keyof T> = { [ P in Diff<keyof T, U> ]-?: NonNullable<T[ P ]> } & T;

export type Mutable<T> = { -readonly [ P in keyof T ]: T[ P ] }
