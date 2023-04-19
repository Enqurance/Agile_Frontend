const path = require("path");

module.exports = {
    preset: "@vue/cli-plugin-unit-jest",
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // 请注意这里的路径
        //'^element-plus(.*)$': '<rootDir>/node_modules/element-plus/theme-chalk$1',
        //'^element-plus-theme-chalk(.*)$': '<rootDir>/node_modules/element-plus/theme-chalk$1', // 新增这一行

    },
    transform: {
        "^.+\\.vue$": "@vue/vue3-jest",
        '^.+\\.css$': 'jest-transform-stub',
    },
    testMatch: ["**/test/**/*.spec.[jt]s?(x)", "**/__tests__/*.[jt]s?(x)"],
    //setupFiles: ['./test/components/setup.js'],
};