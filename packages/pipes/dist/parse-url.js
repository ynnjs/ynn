"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/parse-url.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/25/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseURL = void 0;
const url_1 = require("url");
const common_1 = require("@ynn/common");
function ParseURL(url, ctx, metadata) {
    try {
        return new url_1.URL(url);
    }
    catch (e) {
        const property = metadata.parameters?.property; // eslint-disable-line @typescript-eslint/no-explicit-any
        throw new common_1.HttpException({
            status: 400,
            message: [
                property ? `Parameter ${property} must be a valid URL` : 'Invalid URL'
            ]
        });
    }
}
exports.ParseURL = ParseURL;
