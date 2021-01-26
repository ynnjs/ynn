/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/24/2021
 * Description:
 ******************************************************************/
import { MethodBefore } from '../methods.interface';
interface CreateDecoratorBeforeOptions {
    parameters?: unknown;
    method: MethodBefore;
}
export default function createDecoratorBefore(options: CreateDecoratorBeforeOptions): MethodDecorator;
export {};
