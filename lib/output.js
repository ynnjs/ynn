module.exports = o => {
    return {
        log() {
            const { console, logger } = o;
            console && console.log( ...arguments );
            logger && logger.log( ...arguments );
        },
        info() {
            const { console, logger } = o;
            console && console.info( ...arguments );
            logger && logger.info( ...arguments );
        },
        warn() {
            const { console, logger } = o;
            console && console.warn( ...arguments );
            logger && logger.warn( ...arguments );
        },
        error() {
            const { console, logger } = o;
            console && console.error( ...arguments );
            logger && logger.error( ...arguments );
        }
    }
}
