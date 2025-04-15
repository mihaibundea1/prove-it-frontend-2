const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable source maps in development
config.transformer.minifierConfig = {
  generateSourceMaps: true,
  mangle: false,
  compress: false,
};

module.exports = config;