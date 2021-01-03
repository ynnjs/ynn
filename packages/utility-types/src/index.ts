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
