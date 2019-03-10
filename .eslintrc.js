// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  parser: 'babel-eslint',
  extends: [
    // 'airbnb',
    // 'plugin:flowtype/recommended',
    // 'plugin:css-modules/recommended',
    'prettier',
    // 'prettier/flowtype',
    // 'prettier/react'
  ],

  plugins: [
    // 'flowtype',
		// 'css-modules',
		'prettier'
  ],

  globals: {
  },

  env: {
    browser: true
  },

  rules: {
    'one-var': 'off',
    'no-plusplus': 'off',
    'no-template-curly-in-string': 'off',
    'no-debugger': 2,
    'class-methods-use-this': 0,
    'import/prefer-default-export': [
      'allow', {
        packageDir: '.'
      }
    ],
    'import/named': 'allow',

    // 'react/prop-types': [
    //   1, {
    //     ignore: ['children']
    //   }
    // ],
    // 'react/require-default-props': 'off',

    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    // 'import/no-extraneous-dependencies': [
    //   'error', {
    //     packageDir: '.'
    //   }
    // ],

    'no-unused-vars': [
      'error', {
        varsIgnorePattern: '^_+|Log|Debug',
        argsIgnorePattern: '^_+'
      }
    ],
    'no-unused-expressions': [0],
    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    'no-console': [
      'error', {
        allow: ['warn', 'error', 'info', 'time', 'timeEnd']
      }
    ],

    //  Allow only special identifiers
    //  https://eslint.org/docs/rules/no-underscore-dangle
    'no-underscore-dangle': [0],

    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': [
      'error', {
        VariableDeclarator: {
          array: false,
          object: true
        },
        AssignmentExpression: {
          array: false,
          object: false
        }
      }, {
        enforceForRenamedProperties: false
      }
    ],
    'no-param-reassign': 'off',
    // Ensure <a> tags are valid
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    // 'jsx-a11y/anchor-is-valid': [
    //   'error', {
    //     components: ['Link'],
    //     specialLink: ['to'],
    //     aspects: ['noHref', 'invalidHref', 'preferButton']
    //   }
    // ],

    // 'react/forbid-prop-types': 'off',
    // 'react/no-unknown-property': [
    //   1, {
    //     ignore: ['for']
    //   }
    // ],

    // Allow .js files to use JSX syntax
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    // 'react/jsx-filename-extension': [
    //   'error', {
    //     extensions: ['.js', '.jsx']
    //   }
    // ],

    // Functional and class components are equivalent from React’s point of view
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    // 'react/prefer-stateless-function': 'off',
    // 'react/destructuring-assignment': 'off',
    // 'react/no-access-state-in-setstate': 'off',

    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    'prettier/prettier': 'error'
  },

  settings: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'packages/']
      }
    }
  }
};
