module.exports = {
  presets: [
    [
      '@vue/app', {
        useBuiltIns: 'entry',
        polyfills: [
          'es6.promise',
          'es6.symbol',
          'es6.array.find-index',
          'es7.array.includes',
          'es6.string.includes',
        ]
      },
    ]
  ]
};
