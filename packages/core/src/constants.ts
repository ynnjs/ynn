/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/constants.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description:
 ******************************************************************/

export const ACTION_METHOD_SUFFIX = 'Action';

/**
 * Metadata keys for storing all actions declared with @Action decorator.
 *
 * @example
 *
 * ```ts
 * @Action()
 * create() {}
 * ```
 */
export const ACTIONS_METADATA_KEY = Symbol( 'actions#metadata#key' );

/**
 * Metadata keys for Action Interception Decorators
 */
export const ACTION_METHOD_METADATA_KEY = Symbol( 'action#method#metadata#key' );

export const ACTION_PARAMETER_METADATA_KEY = Symbol( 'action#parameter#metadata#key' );

export const ACTION_EXCEPTION_METADATA_KEY = Symbol( 'action#exception#metadata#key' );

export const ACTION_RESPONSE_METADATA_KEY = Symbol( 'action#response#metadata#key' );
