"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/body-parser.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/09/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bytes_1 = __importDefault(require("bytes"));
const formidable_1 = __importDefault(require("formidable"));
const co_body_1 = __importDefault(require("co-body"));
function parseMultipart(ctx, options = {}) {
    const form = formidable_1.default(options);
    return new Promise((resolve, reject) => {
        form.parse(ctx.req, (err, fields, files) => {
            if (err)
                reject(err);
            else
                resolve({ fields, files });
        });
    });
}
function parseBody(ctx, options = {}) {
    const encoding = options.encoding || 'utf-8';
    const limit = '20mb';
    if (ctx.is('multipart')) {
        const { multipartOptions = {} } = options;
        const maxSizeOptions = {};
        if (typeof multipartOptions.maxFileSize === 'string') {
            maxSizeOptions.maxFileSize = bytes_1.default.parse(multipartOptions.maxFileSize);
        }
        if (typeof multipartOptions.maxFieldsSize === 'string') {
            maxSizeOptions.maxFieldsSize = bytes_1.default.parse(multipartOptions.maxFieldsSize);
        }
        return parseMultipart(ctx, {
            encoding,
            multiples: true,
            minFileSize: 1,
            maxFileSize: 209715200,
            maxFields: 2000,
            maxFieldsSize: 20971520,
            ...multipartOptions,
            ...maxSizeOptions
        });
    }
    return co_body_1.default(ctx.req, { encoding, limit, returnRawBody: false, ...options });
}
exports.default = parseBody;
