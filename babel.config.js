module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo', // Preset  Expo
      ['@babel/preset-env', { targets: { node: 'current' } }], //  Jest
      '@babel/preset-typescript', // TypeScript
    ],
    plugins: [
      'nativewind/babel', //  Nativewind
      [
        'module-resolver',
        {
          root: ['./src'], // Configurare pentru alias-uri
          alias: {
            '@': './src', // Alias main directory
            '@assets': './src/assets', // Alias resources
          },
        },
      ],
      '@babel/plugin-transform-runtime', // Reducerea codului duplicat
    ],
  };
};
