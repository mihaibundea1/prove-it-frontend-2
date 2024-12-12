// postcss.config.js
module.exports = {
    plugins: {
      'nativewind/postcss': {
        ...(process.env.NODE_ENV === 'production' ? { minify: true } : {}),
      },
    },
  };