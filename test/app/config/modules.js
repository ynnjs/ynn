module.exports = {
    test : {
        path : '../test',
        config : {
        }
    },
    'test-router' : {
        default : true,
        path : '../test-router'
    },
    boot : '../boot',
    config : {
        path : '../config',
        configDir : './config/s',
        config : {
            runtime : {
                level : 'runtime'
            }
        }
    }
}
