const {
  createRunOncePlugin,
  WarningAggregator,
} = require("@expo/config-plugins");

const withFacebookAppEventsIos = require("./withFacebookAppEventsIos");
const withFacebookAppEventsAndroid = require("./withFacebookAppEventsAndroid");

/**
 * @typedef {import("../index.d.ts").ExpoFacebookAppEventsPluginProps} ExpoFacebookAppEventsPluginProps
 */

/**
 * @type {import("@expo/config-plugins").ConfigPlugin<ExpoFacebookAppEventsPluginProps>}
 */
const withFacebookAppEvents = (config, props) => {
  if (!props || typeof props.appId !== "string" || props.appId.length === 0) {
    throw new Error(
      "expo-facebook-app-events: missing required plugin prop `appId`."
    );
  }

  if (!/^\d+$/.test(props.appId)) {
    WarningAggregator.addWarningIOS(
      "expo-facebook-app-events",
      "`appId` should be a numeric string (e.g. \"1234567890\")."
    );
  }

  config = withFacebookAppEventsIos(config, props);
  config = withFacebookAppEventsAndroid(config, props);

  return config;
};

module.exports = createRunOncePlugin(
  withFacebookAppEvents,
  "expo-facebook-app-events",
  "0.1.0"
);


