import config from '@antfu/eslint-config'

export default config({
  stylistic: false,
  rules: {
    'antfu/no-top-level-await': 'off',
    'jsonc/sort-keys': 'off',
    'max-lines': 'off',
    'perfectionist/sort-named-exports': 'off',
    'perfectionist/sort-named-imports': 'off',
    'pnpm/yaml-enforce-settings': 'off'
  },
  typescript: {
    overrides: {
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',
      'ts/ban-ts-comment': 'off',
      'ts/no-use-before-define': 'off',
      'ts/strict-boolean-expressions': 'off'
    }
  }
})
