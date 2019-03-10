// Babel configuration
// https://babeljs.io/docs/usage/api/
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-flow'
  ],
  plugins: [
    // Stage 2
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-optional-chaining'],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-export-default-from',
    [
      '@babel/plugin-transform-modules-commonjs',
      {
        // allowTopLevelThis: true
      }
    ],
    [
      'module-resolver',
      {
        root: ['./packages'],
        alias: {}
      }
    ],
    // Stage 3
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta'
    // '@babel/plugin-proposal-json-strings'
  ],
  ignore: ['node_modules', 'build']
};
