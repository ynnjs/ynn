/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: helpers/util.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/25/2021
 * Description:
 ******************************************************************/

export function generateDescriptor(): PropertyDescriptor {
    const o = { x : (): string => 'descriptor' };
    return Reflect.getOwnPropertyDescriptor( o, 'x' ) as PropertyDescriptor;
}
