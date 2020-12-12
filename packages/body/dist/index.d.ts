/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/body-parser.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/09/2020
 * Description:
 ******************************************************************/
import qs from 'qs';
import { Options as CobodyOptions } from 'co-body';
import { KoaContext } from '@ynn/koa';
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
declare function parseMultipart(ctx: KoaContext, options?: MultipartOptions): Promise<{
    fields: any;
    files: any;
}>;
/**
 * function body<O extends BodyOptions>(
 *     ctx: KoaContext,
 *     options: O
 * ): O extends { returnRawBody: true; } ? Promise<{ parsed: any; raw: any; }> : Promise<any>;
 */
export default function parseBody(ctx: KoaContext, options: BodyOptions & {
    returnRawBody: true;
}): Promise<{
    parsed: any;
    raw: any;
}>;
export default function parseBody(ctx: KoaContext, options?: BodyOptions): Promise<any>;
export default function parseBody(ctx: KoaContext, options?: BodyOptions): ReturnType<typeof parseMultipart>;
export {};
