/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: rules/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/04/2021
 * Description:
 ******************************************************************/

import yargs from 'yargs';
import cliStyle from 'cli-style';

function red( s: string ) {
    return cliStyle( s, { color : 'red' } )
}

const rules: Record<string | number, () => any> = {
};

yargs.argv._.map( ( rule: string | number ) => {
    const camelRuleName = String( rule ).replace( /-(.)/g, ( m, n ) => n.toUpperCase() );

    if( !rules[ camelRuleName ] ) {
        console.error( `${red( '➤' )} Rule ${camelRuleName} not exists` );
        return;
    }

    console.log( `➤ [${camelRuleName}] started!` );

    rules[ camelRuleName ]?.();

    console.log( `➤ [${camelRuleName}] completed!` );
} );

console.log( 'test completed successfully' );
