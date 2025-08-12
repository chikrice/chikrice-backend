module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },

  restoreMocks: true,
  coveragePathIgnorePatterns: ['node_modules', '/archive/', 'src/config', 'src/app.js', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  testPathIgnorePatterns: ['/node_modules/', '/archive/'],

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^axios$': 'axios/dist/node/axios.cjs',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
