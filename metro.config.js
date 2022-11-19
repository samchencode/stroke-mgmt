const { getDefaultConfig } = require('@expo/metro-config');
const config = getDefaultConfig(__dirname);

// preserve argument names for dependnecy injection
config.transformer.minifierConfig.mangle = false;

module.exports = config;
