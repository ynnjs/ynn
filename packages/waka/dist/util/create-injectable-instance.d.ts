/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/create-injectable-instance.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/
import { VoidFunction } from '@ynn/utility-types';
export default function createInjectableInstance<T extends VoidFunction, M extends unknown[]>(constructor: T, ...args: M): Promise<T>;
