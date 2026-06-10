const appJson = require('./app.json');

/** @type {import('expo/config').ExpoConfig} */
module.exports = () => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  const plugins = [...(appJson.expo.plugins ?? [])];

  if (googleMapsApiKey && !plugins.some((entry) => entry === 'react-native-maps' || entry?.[0] === 'react-native-maps')) {
    plugins.push([
      'react-native-maps',
      {
        iosGoogleMapsApiKey: googleMapsApiKey,
        androidGoogleMapsApiKey: googleMapsApiKey,
      },
    ]);
  }

  return {
    ...appJson,
    expo: {
      ...appJson.expo,
      plugins,
    },
  };
};
