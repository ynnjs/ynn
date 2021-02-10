/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/response.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
import Pipe from '../interfaces/pipe.interface';
export declare function Response(pipe: Pipe): MethodDecorator | ClassDecorator;
