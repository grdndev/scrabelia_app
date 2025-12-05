// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add alias for react/jsx-dev-runtime
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
  },
  resolveRequest: (context, realModuleName, platform, moduleName) => {
    // Handle react/jsx-dev-runtime and react/jsx-runtime
    if (realModuleName === 'react/jsx-dev-runtime' || realModuleName === 'react/jsx-runtime') {
      const reactPath = path.resolve(__dirname, 'node_modules/react');
      return {
        type: 'sourceFile',
        filePath: path.join(reactPath, realModuleName.replace('react/', '') + '.js'),
      };
    }
    // Use default resolution
    return context.resolveRequest(context, realModuleName, platform, moduleName);
  },
};

module.exports = config;

