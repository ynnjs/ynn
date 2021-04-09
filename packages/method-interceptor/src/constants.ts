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
export const KEY_BEFORE = Symbol( 'key#before' );
/**
 * metadata key for `after` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_AFTER, metadataValue, descriptor.value );
 * ```
 */
export const KEY_AFTER = Symbol( 'key#after' );

/**
 * metadata key for `parameter` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_PARAMETER, metadataValue, constructor, method );
 * ```
 */
export const KEY_PARAMETER = Symbol( 'key#parameter' );

/**
 * metadata key for `exception` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_EXCEPTION, metadataValue, descriptor.value );
 * ```
 */
export const KEY_EXCEPTION = Symbol( 'key#exception' );

/**
 * metadata key from `finally` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_FINALLY, metadataValue, descriptor.value );
 * ```
 */
export const KEY_FINALLY = Symbol( 'key#finally' );
