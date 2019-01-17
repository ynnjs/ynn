module.exports = app => {
    const { console, logger } = app;

    return {
        log() {
            console.log( ...arguments );
            logger.log( ...arguments );
        },
        info() {
            console.info( ...arguments );
            logger.info( ...arguments );
        },
        warn() {
            console.warn( ...arguments );
            logger.warn( ...arguments );
        },
        error() {
            console.error( ...arguments );
            logger.error( ...arguments );
        }
    }
}
