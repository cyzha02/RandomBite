// Created after upgrading to expo 53.0.13
const { getDefaultConfig } = require("expo/metro-config"); 

/** @type {import('expo/metro-config').MetroConfig} */

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.unstable_enablePackageExports = false;
module.exports = defaultConfig;