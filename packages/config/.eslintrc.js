const formatting = {
  'array-bracket-newline': 'off',
  'array-bracket-spacing': [
    'error',
    'never',
  ],
  'array-element-newline': [
    'error',
    'consistent',
  ],
  'arrow-parens': 'off',
  'arrow-spacing': [
    'error',
    {
      after: true,
      before: true,
    },
  ],
  'block-scoped-var': 'warn',
  'block-spacing': [
    'error',
    'always',
  ],
  'brace-style': [
    'error',
    '1tbs',
    {
      allowSingleLine: true,
    },
  ],
  'no-console': 'off',
  'react-hooks/exhaustive-deps': 'off',
  'callback-return': 'error',
  camelcase: 'off',
  'comma-dangle': [
    'warn',
    'always-multiline',
  ],
  'comma-spacing': [
    'error',
    {
      after: true,
      before: false,
    },
  ],
  'comma-style': [
    'error',
    'last',
  ],
  'computed-property-spacing': [
    'error',
    'never',
  ],
  'consistent-this': 'error',
  curly: ['error', 'multi-line'],
  'dot-location': ['warn', 'property'],
  'dot-notation': [
    'warn',
    {
      allowKeywords: true,
    },
  ],
  quotes: ['warn', 'single', {
    avoidEscape: true,
    allowTemplateLiterals: true,
  }],
  'eol-last': 'error',
  eqeqeq: 'off',
  'func-call-spacing': 'error',
  'func-name-matching': 'error',
  'func-names': [
    'error',
    'never',
  ],
  'implicit-arrow-linebreak': [
    'warn',
    'beside',
  ],
  indent: ['error', 2, {
    SwitchCase: 1,
  }],
  'jsx-quotes': [
    'warn',
    'prefer-single',
  ],
  'key-spacing': 'error',
  'keyword-spacing': [
    'error',
    {
      after: true,
      before: true,
    },
  ],
  'linebreak-style': [
    'off',
  ],
  'lines-between-class-members': [
    'error',
    'always',
  ],
  'max-len': ['warn', { code: 160, tabWidth: 3 }],
  'max-lines': ['warn', {
    max: 250,
    skipComments: true,
    skipBlankLines: true,
  }],
  'max-lines-per-function': 'off',
  'new-parens': 'error',
  'newline-after-var': 'off',
  'newline-before-return': 'off',
  'newline-per-chained-call': [
    'warn',
    { ignoreChainWithDepth: 3 },
  ],
  'func-style': [
    'error',
    'declaration',
    { allowArrowFunctions: true },
  ],
  'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 1 }],
  semi: ['error', 'never'],
  'semi-spacing': 'error',
  'semi-style': 'error',
}

const codeQuality = {
  'global-require': 'off',
  'handle-callback-err': 'warn',
  'callback-return': 'off',
}

const typescript = {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '_ig|jsx' }],
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-empty-function': 'off',

}

module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
  ],
  globals: {
    warn: true,
    log: true,
    deb: true,
    error: true,
    info: true,
    fetch: true,
    Tools: true,
    __DEV__: true,
  },
  rules: {
    ...formatting,
    ...codeQuality,
    ...typescript,
  },
}
