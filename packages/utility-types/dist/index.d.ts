/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/27/2020
 * Description:
 ******************************************************************/
export declare type VariadicFunction<P extends any[] = any[], R = any> = (...args: P) => R;
export declare type ParametersShift<T extends VariadicFunction> = ((...args: Parameters<T>) => any) extends ((_: any, ...args: infer U) => any) ? U : [];
