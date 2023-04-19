const path = require("path");

module.exports = {
    preset: "@vue/cli-plugin-unit-jest",
    moduleNameMapper: {
        "^@/(.*)$": path.join(__dirname, "src/$1"),
        //'^axios$': require.resolve('axios')
    },
    transform: {
        "^.+\\.vue$": "@vue/vue3-jest",
    },
    //transformIgnorePatterns: ["node_modules/(?!axios)"],
    testMatch: ["**/test/**/*.spec.[jt]s?(x)", "**/__tests__/*.[jt]s?(x)"],
};