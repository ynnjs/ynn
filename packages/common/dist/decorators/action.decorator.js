"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/action.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/29/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const constants_1 = require("../constants");
function Action(name) {
    return (target, key, descriptor) => {
        const metadata = Reflect.getMetadata(constants_1.ACTIONS_METADATA_KEY, descriptor.value) || [];
        metadata.push(name ?? key);
        Reflect.defineMetadata(constants_1.ACTIONS_METADATA_KEY, metadata, descriptor.value);
    };
}
exports.Action = Action;
