/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/module.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 03/28/2021
 * Description:
 ******************************************************************/
import 'reflect-metadata';
import { VariadicClass } from '@ynn/utility-types';
import { Options } from './ynn';
export declare function Module( options?: Options ): ClassDecorator;
export declare function getModuleMetadata( target: VariadicClass ): Options;
