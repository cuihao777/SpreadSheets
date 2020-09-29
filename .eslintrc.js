module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    globals: {
        "document": true,
        "console": true,
        "HTMLElement": true,
        "getComputedStyle": true
    }
};
