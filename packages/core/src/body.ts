/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/body.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/05/2020
 * Description: 
 ******************************************************************/

import qs from 'qs';
import bytes from 'bytes';
import formidable from 'formidable';
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

function parseMultipart( ctx: KoaContext, options: MultipartOptions = {} ): Promise<{ fields: any; files: any; }> {

    const form = formidable( options );
    return new Promise( ( resolve, reject ) => {
        form.parse( ctx.req, ( err, fields, files ) => {
            if( err ) reject( err );
            else resolve( { fields, files } );
        } );
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

export default function parseBody( ctx: KoaContext, options?: BodyOptions = {} ): Promise<any> {

    const encoding = options.encoding || 'utf-8';
    const limit = '20mb';
    /**
     * to use the limit value in options as the default maxFileSize and maxFieldsSize of multipart request
     */
    const maxSize = bytes.parse( options.limit || limit );

    if( ctx.is( options.multipartTypes || 'multipart' ) ) {
        return parseMultipart( ctx, {
            encoding,
            multipart : true,
            maxFileSize : maxSize,
            maxFieldsSize : maxSize,
            ...( options.multipartOptions ?? {} )
        } );
    }

    return cobody( ctx.req, { encoding, limit, returnRawBody : false, ...options } );
}
