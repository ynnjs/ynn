module.exports = app => {
    return {
        host : app.config( 'db.host' ),
        user : app.config( 'db.user' ),
        password : app.config( 'db.password' ),
        database : app.config( 'db.database' )
    };
}
