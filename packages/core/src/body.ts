/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/body.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/05/2020
 * Description: 
 ******************************************************************/

import qs from 'qs';
import cobody, { Options as CobodyOptions } from 'co-body';
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

/**
 * BodyOptions extends Cobody.Options.
 *
 * @see https://github.com/cojs/co-body
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/co-body/index.d.ts
 *
 *
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
    multipartTypes?: string[];
    multipartOptions?: MultipartOptions;
}

function parseMultipart( ctx: KoaContext, options: MultipartOptions ): Promise<{ fields: any; files: any; }> {

    const form = formidable(  );
    return new Promise( ( resolve, reject ) => {
        for
    } );
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

    const encoding = 'utf-8';
    const limit = '2mb';

    if( ctx.is( options.multipartTypes || 'multipart' ) ) {
        return parseMultipart( ctx, {
            encoding,
        } );
    }

    return cobody( ctx.req, {
        encoding,
        limit : '2mb',
        returnRawBody : false,
        ...options
    } );
}
