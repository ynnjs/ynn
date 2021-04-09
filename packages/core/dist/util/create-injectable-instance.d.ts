/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/create-injectable-instance.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/
import { VariadicClass } from '@ynn/utility-types';
export declare function createInjectableInstance<T, M extends unknown[]>( constructor: VariadicClass<any[], T>, // eslint-disable-line @typescript-eslint/no-explicit-any
...args: M ): Promise<T>;
