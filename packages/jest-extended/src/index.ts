/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/25/2021
 * Description:
 ******************************************************************/

import matchers from './matchers';

const jestExpect = ( global as any ).expect; // eslint-disable-line @typescript-eslint/no-explicit-any

if( jestExpect !== undefined ) {
    jestExpect.extend( matchers );
} else {
    console.error( 'unable to fined Jest\'s global expect.' ); // eslint-disable-line
}
