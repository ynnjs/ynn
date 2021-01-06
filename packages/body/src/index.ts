/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/body-parser.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/09/2020
 * Description:
 ******************************************************************/

import qs from 'qs';
import bytes from 'bytes';
import formidable, { Fields, Files } from 'formidable';
import cobody, { Options as CobodyOptions } from 'co-body';
import { KoaContext } from '@ynn/koa';

/**
 * The type of the return value of `cobody` while `options.returnRawBody` is set to `true`.
 * The `parsed` part will be in different types while using different request types.
 *  - it will be `string` while `Content-Type` matches `text`.
 *  - it will be `ReturnType<typeof qs.parse>` while `Content-Type` matches `form`.
 *  - it will be `ReturnType<typeof JSON.parse>` while `Content-Type` matches `json`.
 */
type RawBody = Promise<{
    parsed: string | ReturnType<typeof qs.parse> | ReturnType<typeof JSON.parse>;
    raw: string;
}>

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

function parseMultipart( ctx: KoaContext, options: MultipartOptions = {} ): Promise<{ fields: Fields; files: Files; }> {

    const form = formidable( options );

    return new Promise( ( resolve, reject ) => {
        form.parse( ctx.req, ( err, fields, files ) => {
            if( err ) reject( err );
            else resolve( { fields, files } );
        } );
    } );
}

/**
 * get body data by setting `options.returnRawBody` to `true`, it will return the {@link RawBody} only when `Content-Type` doesn't match `multipart`.
 *
 * @param ctx - the context object conforming the Koa's context object.
 * @param options - the options object. {@link BodyOptions}
 *
 * @returns the raw body object returns by `co-body`. {@link RawBody}
 */
export default function parseBody( ctx: KoaContext, options: BodyOptions & { returnRawBody: true; } ): RawBody;

/**
 * get body data by setting `options.returnRawBody` to `true`, if the `Content-Type` matches `multipart` type, the function will not return the raw body data, it will return parsed value.
 *
 * @param ctx - the context object conforming the Koa's context object.
 * @param options - the options object. {@link BodyOptions}
 *
 * @returns the parsed body with `fields` and `files`.
 */
export default function parseBody( ctx: KoaContext, options: BodyOptions & { returnRawBody: true; } ): ReturnType<typeof parseMultipart>;

/**
 * get parsed body with default `co-body` options for `json`, `text` and `form` request.
 *
 * @param ctx - the context object conforming the Koa's context object.
 *
 * @returns the parsed body object.
 */
export default function parseBody( ctx: KoaContext ): ReturnType<typeof cobody>;
export default function parseBody( ctx: KoaContext, options: BodyOptions ): ReturnType<typeof cobody>;

/**
 * parse multipart request body.
 */
export default function parseBody( ctx: KoaContext ): ReturnType<typeof parseMultipart>;
export default function parseBody( ctx: KoaContext, options?: BodyOptions ): ReturnType<typeof parseMultipart>;

export default function parseBody( ctx: KoaContext, options: BodyOptions = {} ): RawBody | ReturnType<typeof parseMultipart> | ReturnType<typeof cobody> {

    const encoding = options.encoding || 'utf-8';
    const limit = '20mb';

    if( ctx.is( 'multipart' ) ) {

        const { multipartOptions = {} } = options;
        const maxSizeOptions: {
            maxFieldsSize?: number;
            maxFileSize?: number;
        } = {};

        if( typeof multipartOptions.maxFileSize === 'string' ) {
            maxSizeOptions.maxFileSize = bytes.parse( multipartOptions.maxFileSize );
        }

        if( typeof multipartOptions.maxFieldsSize === 'string' ) {
            maxSizeOptions.maxFieldsSize = bytes.parse( multipartOptions.maxFieldsSize );
        }

        return parseMultipart( ctx, {
            encoding,
            multiples : true,
            minFileSize : 1,
            maxFileSize : 209715200, // 200mb
            maxFields : 2000,
            maxFieldsSize : 20971520, // 20mb
            ...multipartOptions,
            ...maxSizeOptions
        } );
    }

    return cobody( ctx.req, { encoding, limit, returnRawBody : false, ...options } );
}
