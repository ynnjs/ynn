/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/load-files.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/28/2020
 * Description: 
 ******************************************************************/

import fs from 'fs';
import path from 'path';

async function loadFiles( dir: string ): Record<string, any> { 
    const res = {};
    const subtasks = [];

    const files = await fs.readdir( dir );

    for( const name of files ) {

        // skip ., .. and hidden files
        if( name.charAt( 0 ) === '.' ) continue;

        const sub = path.join( dir, name ); 

        

    }

    return res;
}

export default loadFiles;
