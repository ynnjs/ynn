/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/request.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 09/30/2020
 * Description: 
 ******************************************************************/

import net from 'net';
import { URL, format } from 'url';
import accepts from 'accepts';
import contentType from 'content-type';
import qs from 'querystring';

const IP = Symbol( 'ip' );

/**
 * Prototype
 */

export default {
    /**
     * Return request header.
     *
     * @return {Object}
     */
    get header() {
        return this.req.headers;
    },
    
    /**
     * Set request header.
     */
    set header( val ) {
        this.req.headers = val;
    },

    /**
     * Return request header, alias as request.header
     */
    get headers() {
        return this.req.headers;
    },

    /**
     * Set request header, alias as request.header
     */
    set headers( val ) {
        this.req.headers = val;
    },

    /**
     * Get request URL
     */
    get url(): string {
        return this.req.url;
    },

    /**
     * Set request URL
     */
    set url( val ): void {
        this.req.url = val;
    },

    /**
     * Get origin of URL
     */
    get origin(): string {
        return `${this.protocol}://${this.host}`;
    },

    /**
     * Get full request URL
     *
     * @return {String}
     */
    get href() {
        if( /^https?:\/\//i.test( this.originalUrl ) ) return this.originalUrl;
        return this.origin + this.originalUrl;
    },

    /**
     * Get request method
     */
}
