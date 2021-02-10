/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/create-action-decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/29/2021
 * Description:
 ******************************************************************/
import { KoaContext } from '@ynn/koa';
import { MethodBefore } from '@ynn/method-interceptor';
import Pipe from '../interfaces/pipe.interface';
export default function (method: MethodBefore<[KoaContext]>, propertyOrPipe?: string | Pipe, pipeFunction?: Pipe): MethodDecorator;
