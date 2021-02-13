/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: formidable/index.d.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/10/2020
 * Description:
 ******************************************************************/

/// <refereence types="node" />

import http from 'http';
import stream from 'stream';
import EventEmitter from 'events';

export interface Part extends stream.Stream {
    headers: Record<string, string>;
    name: string;
    filename?: string;
    mime?: string;
}

export interface File {
    size: number;
    path: string;
    name: string;
    type: string;
    lastModifiedDate?: Date;
    hash?: string;
    toJSON: () => any;
}

export interface Files {
    [key: string]: File;
}

export interface Fields {
    [key: string]: string | string[];
}

export interface Options {
    maxFields?: number;
    maxFieldSize?: number;
    maxFileSize?: number;
    keepExtensions?: boolean;
    encoding?: string;
    hash?: boolean;
    uploadDir?: string;
    multiples?: boolean;
    enabledPlugins?: string[];
}

export declare class IncomingForm extends EventEmitter {
    options: Options;
    uploaddir: string;
    openedFiles: string[];
    error: Error | null;
    headers: Record<string, string> | null;
    type: string | null;
    bytesExpected: number | null;
    bytesReceived: number | null;
    ended: boolean;
    constructor( options: Options = {} ) {}

    use( plugin: ( ...args: any[] ) => any ): this;
    parse( req: http.IncomingMessage, callback?: ( err: any, fields: Fields, files: Files ) => any ): void;
    writeHeaders( headers: Record<string | string> ): void;
    write( buffer: Buffer ): number;
    pause(): false;
    resume(): false;
    onPart( part: Part ): void;
}

export interface Formidable {
    DEFAULT_OPTIONS: Options;
    new ( options?: Options ): IncomingForm;
}

declare interface formidable {
    ( options?: Options ): Formidable;
}

declare const _default: formidable & {
    File: File;
    Formidable: Formidable;
    formidable: formidable;
    IncomingForm: Formidable;
    defaultOptions: Options;
    enabledPlugins: string[];
};

export default _default;
