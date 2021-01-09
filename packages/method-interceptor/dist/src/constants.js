"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/constants.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/20/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEY_EXCEPTION = exports.KEY_PARAMETER = exports.KEY_AFTER = exports.KEY_BEFORE = void 0;
/**
 * metadata key for `before` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_BEFORE, metadataValue, descriptor.value );
 * ```
 */
exports.KEY_BEFORE = Symbol('key#before');
/**
 * metadata key for `after` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_AFTER, metadataValue, descriptor.value );
 * ```
 */
exports.KEY_AFTER = Symbol('key#after');
/**
 * metadata key for `parameter` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_PARAMETER, metadataValue, constructor, method );
 * ```
 */
exports.KEY_PARAMETER = Symbol('key#parameter');
/**
 * metadata key for `exception` interceptor.
 *
 * @example:
 *
 * ```ts
 * Reflect.defineMetadata( KEY_EXCEPTION, metadataValue, descriptor.value );
 * ```
 */
exports.KEY_EXCEPTION = Symbol('key#exception');
