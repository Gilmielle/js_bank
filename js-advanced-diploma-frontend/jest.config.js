// eslint-disable-next-line no-undef
module.exports = {
  // testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '\\.js$': 'babel-jest',
    '\\.(jpe?g|png|svg)$': '<rootDir>/fileTransformer.js',
  },
};
