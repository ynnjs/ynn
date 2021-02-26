/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/body-parser.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/09/2020
 * Description:
 ******************************************************************/
import qs from 'qs';
import { Fields, Files } from 'formidable';
import cobody, { Options as CobodyOptions } from 'co-body';
import { Context } from '@ynn/core';
/**
 * The type of the return value of `cobody` while `options.returnRawBody` is set to `true`.
 * The `parsed` part will be in different types while using different request types.
 *  - it will be `string` while `Content-Type` matches `text`.
 *  - it will be `ReturnType<typeof qs.parse>` while `Content-Type` matches `form`.
 *  - it will be `ReturnType<typeof JSON.parse>` while `Content-Type` matches `json`.
 */
declare type RawBody = {
    parsed: string | ReturnType<typeof qs.parse> | ReturnType<typeof JSON.parse>;
    raw: string;
};
/**
 * the `options` for parsing multipart request
 * @see https://github.com/node-formidable/formidable
 */
export interface MultipartOptions {
    encoding?: string;
    uploadDir?: string;
    keepExtensions?: boolean;
    allowEmptyFiles?: boolean;
    minFileSize?: number;
    maxFileSize?: string | number;
    maxFields?: number;
    maxFieldsSize?: string | number;
    hash?: boolean;
    multiples?: boolean;
}
/**
 * BodyOptions extends Cobody.Options.
 *
 * @see https://github.com/cojs/co-body
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/co-body/index.d.ts
 */
export interface BodyOptions extends CobodyOptions {
    encoding?: string;
    limit?: string;
    strict?: boolean;
    queryString?: qs.IParseOptions;
    returnRawBody?: boolean;
    jsonTypes?: string[];
    formTypes?: string[];
    textTypes?: string[];
    multipartOptions?: MultipartOptions;
}
declare function parseMultipart(ctx: Context, options?: MultipartOptions): Promise<{
    fields: Fields;
    files: Files;
}>;
/**
 * get body data by setting `options.returnRawBody` to `true`, it will return the {@link RawBody} only when `Content-Type` doesn't match `multipart`.
 *
 * @param ctx - the context object conforming the @ynn/core's context object.
 * @param options - the options object. {@link BodyOptions}
 *
 * @returns the parsed body with `fields` and `files`.
 */
export default function parseBody(ctx: Context, options?: Readonly<BodyOptions>): Promise<RawBody | ReturnType<typeof parseMultipart> | ReturnType<typeof cobody> | null>;
export {};
