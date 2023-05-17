const path = require("path");

module.exports = {
    preset: "@vue/cli-plugin-unit-jest",
    moduleNameMapper: {
        "^@/(.*)$": path.join(__dirname, "src/$1"),
    },
    transform: {
        "^.+\\.vue$": "@vue/vue3-jest",
        "^.+\\.jsx?$": "babel-jest",
    },
    testMatch: ["**/test/components/*.spec.[jt]s?(x)", "**/__tests__/*.[jt]s?(x)"],
};