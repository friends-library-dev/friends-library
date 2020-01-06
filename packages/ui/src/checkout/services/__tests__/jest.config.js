module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    window: {
      fetch: require('node-fetch'),
    },
  },
};
