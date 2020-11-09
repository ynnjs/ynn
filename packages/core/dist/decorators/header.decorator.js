"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/header.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
function Header(name, value) {
    return (target, key, descriptor) => {
        const exists = Reflect.getMetadata('__HEADER__', descriptor.value) || [];
        const metadata = [...exists, [name, value]];
        Reflect.defineMetadata('__Header__', metadata, descriptor.value);
        return descriptor;
    };
}
exports.Header = Header;
