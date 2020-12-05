/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/body.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/05/2020
 * Description: 
 ******************************************************************/

import qs from 'qs';
import cobody from 'co-body';
import { KoaContext } from '@ynn/koa';

/**
 * the `options` for parsing multipart request
 * @see https://github.com/node-formidable/formidable
 */
export interface MultipartOptions {
    encoding?: string;
    uploadDir?: string;
    keepExtensions?: boolean;
    maxFileSize?: number;
    maxFields?: number;
    maxFieldsSize?: number;
    hash?: boolean;
    multiples?: boolean;
}

export interface BodyOptions {
    encoding?: string;
    limit?: string;
    strict?: boolean;
    queryString?: qs.IParseOptions;
    returnRawBody?: boolean;
    jsonTypes?: string[];
    formTypes?: string[];
    textTypes?: string[];
    multipartTypes?: string[];
    multipartOptions?: MultipartOptions;
}

function parseMultipart( ctx: KoaContext ): Promise<{ fields: any; files: any; }> {
    return Promise();
}

/**
 * function body<O extends BodyOptions>(
 *     ctx: KoaContext,
 *     options: O
 * ): O extends { returnRawBody: true; } ? Promise<{ parsed: any; raw: any; }> : Promise<any>;
 */

export default function parseBody( ctx: KoaContext, options: BodyOptions & { returnRawBody: true; } ): Promise<{ parsed: any; raw: any; }>;
export default function parseBody( ctx: KoaContext, options: BodyOptions ): Promise<any>;
export default function parseBody( ctx: KoaContext, options: BodyOptions ): ReturnType<typeof parseMultipart>;

export default function parseBody( ctx: KoaContext, options: BodyOptions ): Promise<any> {

    if( ctx.is( options.multipartTypes || 'multipart' ) ) {
        return parseMultipart( ctx );
    }

    return cobody( ctx.req, {
        encoding : 'utf-8',
        limit : '2mb',
        returnRawBody : false,
        ...options
    } );
}
