/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/delegates.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/03/2020
 * Description: 
 ******************************************************************/

export default class Delegates {
    #methods: string[] = [];
    #getters: string[] = [];
    #setters: string[] = [];
    constructor( public proto: unknown, public target: string ) {}

    method( name: string ): this {
        const { target } = this;
        this.#methods.push( name );
        ( this.proto as any )[ name ] = function( this: any ) {
            return this[ target ][ name ].apply( this[ target ], arguments );
        }
        return this;
    }

    access( name: string ): this {
        const { target } = this;
        this.#getters.push( name );
        this.#setters.push( name );
        Object.defineProperty( this.proto as any, name, {
            get(): any {
                return this[ target ][ name ];
            },
            set( val: unknown ) {
                return this[ target ][ name ] = val;
            }
        } );
        return this;
    }

    getter( name: string ): this {
        const { target } = this;
        this.#getters.push( name );
        Object.defineProperty( this.proto as any, name, {
            get(): any {
                return this?.[ target ]?.[ name ];
            }
        } );
        return this;
    }

    setter( name: string ): this {
        const { target } = this;
        this.#setters.push( name );
        Object.defineProperty( this.proto, name, {
            set( val: unknown ) {
                return this[ target ][ name ] = val;
            }
        } );
        return this;
    }

    methods( ...names: string[] ): this {
        names.forEach( ( name: string ): void => { this.method( name ) } );
        return this;
    }

    accesses( ...names: string[] ): this {
        names.forEach( ( name: string ): void => { this.access( name ) } );
        return this;
    }

    getters( ...names: string[] ): this {
        names.forEach( ( name: string ): void => { this.getter( name ) } );
        return this;
    }

    setters( ...names: string[] ): this {
        names.forEach( ( name: string ): void => { this.setter( name ) } );
        return this;
    }
}
