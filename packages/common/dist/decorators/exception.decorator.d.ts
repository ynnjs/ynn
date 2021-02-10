/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/exception.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
import Pipe from '../interfaces/pipe.interface';
export declare function Exception(pipe: Pipe): MethodDecorator | ClassDecorator;
