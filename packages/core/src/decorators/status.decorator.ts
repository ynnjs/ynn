/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/status.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description: 
 ******************************************************************/

import { createActionResponseDecorator } from './util';

/**
 * 
 * For example:
 *
 * ```typescript
 * @Status( 400 )
 * create() {}
 * ```
 *
 * @returns the method decorator
 */
export function Status( statusCode: number ): MethodDecorator;

/**
 * For example:
 *
 * ```typescript
 * @Status( 400, 'Bad Request' )
 * create() {}
 * ```
 *
 * @returns the method decorator
 */
export function Status( statusCode: number, message: string ): MethodDecorator;

export function Status( statusCode: number, message?: string ): MethodDecorator {
    return createActionResponseDecorator( 'status', { statusCode, message } );
}
