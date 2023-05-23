module.exports = {
    moduleFileExtensions: [
        'js',
        'jsx',
        'json',
        'vue',
    ],
    transform: {
        "^.+\\.vue$": "@vue/vue3-jest",
    },
    preset: '@vue/cli-plugin-unit-jest',
    setupFilesAfterEnv: ['./tests/setup.js'],
    moduleNameMapper: {
        '\\.(css|less)$': 'jest-css-modules', 
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(axios)/)'
    ],
}
