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
 * PartialKeys<Type, Keys>
 *
 * Constructs a type with all properties of `Type` and setspecific `Keys` to `optional`.
 *
 * @example:
 *
 * ```ts
 * interface Example {
 *     name: string;
 *     value: number;
 * }
 *
 * type ExampleWithOptionalValue = PartialKeys<Example, 'name'>;
 * ```
 */
export type PartialKeys<T, M extends keyof T> = {
    [ P in Diff<keyof T, M> ]: T[ P ];
} & {
    [ P in M ]?: T[ P ];
}

export type PartialExclude<T, M extends keyof T> = {
    [ P in keyof T ]?: T[ P ];
} & {
    [ P in M ]: T[ P ];
}

export type Mutable<T> = {
    -readonly [ P in keyof T ]: T[ P ];
}
