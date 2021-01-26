/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/interceptor.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/
/**
 * The declaration of InterceptorBefore method.
 *
 * @paramtype T - Type of the arguments which will be passed to the generated methods.
 *
 * @example
 *
 * ```ts
 * ( ctx: KoaContext ) => Promise.all( [
 *     fn1( ctx ),
 *     fn2( ctx )
 * ] );
 * ```
 */
export interface InterceptorBefore<T extends unknown[]> {
    (...args: T): Promise<unknown>;
}
export interface InterceptorAfter<V, T extends unknown[]> {
    (value: V, ...args: T): Promise<unknown>;
}
export interface InterceptorException<T extends unknown[]> {
    (e: unknown, ...args: T): Promise<unknown>;
}
export interface InterceptorParameter<T extends unknown[]> {
    (...args: T): Promise<unknown[]>;
}
