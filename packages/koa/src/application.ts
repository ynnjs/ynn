/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/application.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 09/29/2020
 * Description: 
 ******************************************************************/

const Events = require( 'events' );
import is from '@sindresorhus/is';
import debug from 'debug';

export type ApplicationOptions = {
    proxy: boolean;
}

export default class Application extends Events {
    public proxy: boolean = false;
    public middleware: any[] = [];
    public subdomainOffset: number = 2;
    public maxIpsCount: number = 0;
    public env: string = 'development';

    constructor( options = {} ) {
        super();
        this.proxy = options.proxy || false;
        this.subdomainOffset = options.subdomainOffset || 2;
        this.proxyIpHeaer = options.proxyIpHeader || 'X-Forward-For';
        this.maxIpsCount = options.maxIpsCount || 0;
        this.env = options.env || process.env.NODE_ENV || 'development';
        options.keys && ( this.keys = options.keys );
    }
}
