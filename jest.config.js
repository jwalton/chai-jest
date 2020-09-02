module.exports = {
    collectCoverage: true,
    transform: {
        '.(ts|tsx)': 'ts-jest',
    },
    testEnvironment: 'node',
    testRegex: '(/test/.*|\\.(test|spec))\\.(ts|tsx|js)$',
    moduleFileExtensions: ['ts', 'tsx', 'js'],
};
