/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/config.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/27/2020
 * Description: 
 ******************************************************************/

export default class Config {

    #cache: Map<string, any> = new Map();
    #config: any;

    constructor( config: any ) {
        if( config instanceof Config ) return config;
        this.#config = config;
    }

    get( path?: string, defaultValue?: any ): any {
        if( !arguments.length ) return this.#config;

        const cache = this.#cache;

        if( cache.has( path as string ) ) {
            const exists = cache.get( path as string );
            return typeof exists === 'undefined' ? defaultValue : exists;
        }

        let tmp = this.#config;

        for( const item of ( path as string ).split( '.' ) ) {
            tmp = tmp?.[ item ];
            if( typeof tmp === 'undefined' ) break;
        }

        cache.set( path as string, tmp );

        if( typeof tmp === 'undefined' ) return defaultValue;
        return tmp;
    }
}
