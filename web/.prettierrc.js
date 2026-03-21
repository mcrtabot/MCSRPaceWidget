module.exports = {
  printWidth: 120,
  tabWidth: 2,
  trailingComma: 'all',
  singleQuote: true,
  semi: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['^react$', '<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
