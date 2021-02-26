"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/default.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/26/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
function Default(defaultValue) {
    return (value) => {
        if (value === undefined || value === null)
            return defaultValue;
        return value;
    };
}
exports.Default = Default;
