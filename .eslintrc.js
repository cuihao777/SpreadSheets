module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true
    },
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    globals: {
    }
};
