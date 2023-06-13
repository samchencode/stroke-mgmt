module.exports = {
  expo: {
    name: 'Stroke Management',
    slug: 'stroke-mgmt',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.samuel88835.strokemgmt',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.samuel88835.strokemgmt',
    },
    androidNavigationBar: {
      barStyle: 'dark-content',
      backgroundColor: '#fafafa',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: '935f864e-12bb-456a-8214-8070b8ba5baa',
      },
      NODE_ENV: process.env.NODE_ENV,
    },
  },
};
