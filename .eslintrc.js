module.exports = {
    // ...
    root: true,
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    plugins: [
        // ...
        'vue',
        'jest'
    ],
    extends: [
        // ...
        'plugin:vue/vue3-essential',
        //'@vue/standard',
        //'@vue/typescript/recommended',
        'plugin:jest/recommended'
    ],
    // ...
}