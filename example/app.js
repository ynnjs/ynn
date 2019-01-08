const Ynn = require( '../' );
const app = new Ynn( {
    root : __dirname,
    debugging : true,
    logging : false,
    modules : {
        id : 'ynn-ms-idalloc'
    }
} );

app.use( async ctx => {
    ctx.body = 'Hello Ynn!';
} );

app.listen( 3000 );
