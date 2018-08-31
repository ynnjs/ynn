module.exports = () => {
    return {
        debug : {
            filename : 'debug.log'
        },

        info : {
            dailyrotate : true,
            filename : 'info-%DATE%.log',
            datePattern : 'YYYY-MM-DD',
            maxSize : '20m',
            maxFiles : '30d'
        },

        warning : {
            dailyrotate : true,
            filename : 'warning-%DATE%.log',
            datePattern : 'YYYY-MM-DD',
            maxSize : '20m',
            maxFiles : '30d'
        },

        error : {
            dailyrotate : true,
            filename : 'error-%DATE%.log',
            datePattern : 'YYYY-MM-DD',
            maxSize : '20m',
            maxFiles : '30d'
        },

        emerg : {
            dailyrotate : true,
            filename : 'emerg-%DATE%.log',
            datePattern : 'YYYY-MM-DD',
            maxSize : '20m',
            maxFiles : '30d'
        }
    } ;
};
