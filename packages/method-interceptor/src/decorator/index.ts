/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/

import createDecoratorBefore from './create-decorator-before';
import createDecoratorAfter from './create-decorator-after';
export * from './create-decorator-before';
export * from './create-decorator-after';

export {
    createDecoratorBefore,
    createDecoratorAfter
};
