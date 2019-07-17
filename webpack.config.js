const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(
    { ...env, removeUnusedImportExports: false },
    argv,
  );

  // Customize the config before returning it.
  return config;
};
