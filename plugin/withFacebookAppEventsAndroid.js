const { withAndroidManifest, withStringsXml, AndroidConfig } = require("@expo/config-plugins");

const { addOrReplaceManifestMetaData, boolToAndroidString } = require("./utils");

const withFacebookAppEventsAndroid = (config, props) => {
  config = withStringsXml(config, (config) => {
    let strings = config.modResults;

    strings = AndroidConfig.Strings.setStringItem(
      [{ name: "facebook_app_id", value: props.appId }],
      strings
    );

    if (props.clientToken) {
      strings = AndroidConfig.Strings.setStringItem(
        [{ name: "facebook_client_token", value: props.clientToken }],
        strings
      );
    }

    config.modResults = strings;
    return config;
  });

  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const application = manifest.application?.[0];
    if (!application) return config;

    addOrReplaceManifestMetaData(
      application,
      "com.facebook.sdk.ApplicationId",
      "@string/facebook_app_id"
    );

    if (props.clientToken) {
      addOrReplaceManifestMetaData(
        application,
        "com.facebook.sdk.ClientToken",
        "@string/facebook_client_token"
      );
    }

    if (typeof props.autoLogAppEventsEnabled === "boolean") {
      addOrReplaceManifestMetaData(
        application,
        "com.facebook.sdk.AutoLogAppEventsEnabled",
        boolToAndroidString(props.autoLogAppEventsEnabled)
      );
    }

    if (typeof props.advertiserIDCollectionEnabled === "boolean") {
      addOrReplaceManifestMetaData(
        application,
        "com.facebook.sdk.AdvertiserIDCollectionEnabled",
        boolToAndroidString(props.advertiserIDCollectionEnabled)
      );
    }

    if (typeof props.autoInitEnabled === "boolean") {
      addOrReplaceManifestMetaData(
        application,
        "com.facebook.sdk.AutoInitEnabled",
        boolToAndroidString(props.autoInitEnabled)
      );
    }

    config.modResults.manifest = manifest;
    return config;
  });

  return config;
};

module.exports = withFacebookAppEventsAndroid;


