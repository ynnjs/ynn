/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/constants.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/
/**
 * metadata key for `before` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_BEFORE, metadataValue, descriptor.value );
 * ```
 */
export declare const KEY_BEFORE: unique symbol;
/**
 * metadata key for `after` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_AFTER, metadataValue, descriptor.value );
 * ```
 */
export declare const KEY_AFTER: unique symbol;
/**
 * metadata key for `parameter` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_PARAMETER, metadataValue, constructor, method );
 * ```
 */
export declare const KEY_PARAMETER: unique symbol;
/**
 * metadata key for `exception` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_EXCEPTION, metadataValue, descriptor.value );
 * ```
 */
export declare const KEY_EXCEPTION: unique symbol;
/**
 * metadata key from `finally` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_FINALLY, metadataValue, descriptor.value );
 * ```
 */
export declare const KEY_FINALLY: unique symbol;
