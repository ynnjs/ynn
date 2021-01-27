/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/args.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/07/2020
 * Description:
 ******************************************************************/

import path from 'path';
import yargs from 'yargs';
import is from '@lvchengbin/is';

const cwd = process.cwd();
const cargs: Record<string, any> = yargs.argv;

if( 'debugging' in cargs ) {
    cargs.debugging = is.generalizedTrue( cargs.debugging );
}

if( 'loggings' in cargs ) {
    cargs.logging = is.generalizedTrue( cargs.logging );
}

if( 'log-path' in cargs ) {
    cargs[ 'log-path' ] = path.resolve( cwd, cargs[ 'log-path' ] );
}

if( 'root' in cargs ) {
    cargs.root = path.resolve( cwd, cargs.root );
}

if( 'config-dir' in cargs ) {
    cargs[ 'config-dir' ] = path.resolve( cwd, cargs[ 'config-dir' ] );
}

export default cargs;
