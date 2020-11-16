/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/body.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description: 
 ******************************************************************/

import { KoaContext } from '@ynn/koa';

/**
 *
 */
export function Body(): ParameterDecorator;
export function Body( property: string ): ParameterDecorator;
export function Body( property: string, pipe: ( value:  ctx: KoaContext ): ParameterDecorator;
