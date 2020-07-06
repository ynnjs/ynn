module.exports = {
    parser : '@typescript-eslint/parser',
    plugins : [
        '@typescript-eslint'
    ],
    env : {
        node : true
    },
    globals : {
        define : true,
        describe : true,
        xdescribe : true,
        it : true,
        xit : true,
        beforeEach : true,
        beforeAll : true,
        afterEach : true,
        afterAll : true,
        expect : true
    },
    extends : [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    root : true,
    parserOptions : {
        project : 'tsconfig.json',
        tsconfigRootDir : __dirname,
        sourceType : 'module'
    },
    rules: {
        'no-console' : 0,
        'linebreak-style': [
            'error',
            'unix'
        ],
        quotes : [ 'error', 'single' ],
        semi : [ 0 ]
    }
}
