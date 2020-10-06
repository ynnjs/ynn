/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: middlewares/compose.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 09/30/2020
 * Description:
 ******************************************************************/
export declare type Next = (...args: any[]) => any;
export declare type Middleware<T> = (context: T, next: Next) => any;
export declare type ComposedMiddleware<T> = (context: T, next?: Next) => Promise<void>;
export default function compose<T>(middleware: Middleware<T>[]): ComposedMiddleware<T>;
