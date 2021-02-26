"use strict";
/******************************************************************
 * Copyright (C) 2021 Ynn
 *
 * File: src/required.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/24/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Required = void 0;
const common_1 = require("@ynn/common");
function Required(value, ctx, metadata) {
    if (value === undefined || value === null) {
        const property = metadata.parameters?.property; // eslint-disable-line @typescript-eslint/no-explicit-any
        throw new common_1.HttpException({
            status: 400,
            message: [
                property ? `${property} is required` : 'missing parameter'
            ]
        });
    }
    return value;
}
exports.Required = Required;
