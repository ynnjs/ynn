/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/interceptor.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/

export interface Method {
    ( ...args: any[] ): any;
}

export type Methods = Record<keyof any, Method>;

export interface MethodInfo<T> {
    /**
     * the method could be undefined in the type of interceptor is not set.
     */
    method: Method | undefined;
    metadata: T;
}

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
export interface InterceptorBefore<T extends any[] = any[]> {
    ( ...args: T ): Promise<any[]>;
}

export interface InterceptorAfter<T extends any[] = any[]> {
    ( value: any, ...args: T ): Promise<any>;
}

export interface InterceptorException<T extends any[] = any[]> {
    ( e: any, ...args: T ): any;
}

export interface InterceptorParameters<T extends any[] = any[]> {
    ( ...args: T ): Promise<any[]>;
}
