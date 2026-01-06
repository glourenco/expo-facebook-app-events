const { withInfoPlist, withAppDelegate } = require("@expo/config-plugins");

const { uniq } = require("./utils");

function setFacebookUrlScheme(infoPlist, appId) {
  const scheme = `fb${appId}`;
  const urlTypes = Array.isArray(infoPlist.CFBundleURLTypes)
    ? infoPlist.CFBundleURLTypes
    : [];

  const hasScheme = urlTypes.some((t) =>
    Array.isArray(t?.CFBundleURLSchemes)
      ? t.CFBundleURLSchemes.includes(scheme)
      : false
  );

  if (hasScheme) {
    infoPlist.CFBundleURLTypes = urlTypes;
    return infoPlist;
  }

  urlTypes.push({
    CFBundleURLSchemes: [scheme],
  });

  infoPlist.CFBundleURLTypes = urlTypes;
  return infoPlist;
}

function addLSApplicationQueriesSchemes(infoPlist) {
  const existing = Array.isArray(infoPlist.LSApplicationQueriesSchemes)
    ? infoPlist.LSApplicationQueriesSchemes
    : [];

  // Common schemes recommended for Facebook SDK integrations.
  const next = uniq([
    ...existing,
    "fbapi",
    "fb-messenger-api",
    "fbauth2",
    "fbshareextension",
  ]);

  infoPlist.LSApplicationQueriesSchemes = next;
  return infoPlist;
}

function addFacebookAppDelegateInit(contents, language) {
  // Keep this intentionally minimal & idempotent.
  if (language === "objc") {
    if (!contents.includes("FBSDKCoreKit")) {
      contents = contents.replace(
        /#import "AppDelegate\.h"\s*\n/,
        `#import "AppDelegate.h"\n#import <FBSDKCoreKit/FBSDKCoreKit.h>\n`
      );
    }

    // didFinishLaunchingWithOptions hook
    if (
      !contents.includes(
        "[[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions]"
      )
    ) {
      contents = contents.replace(
        /(\-\s*\(BOOL\)\s*application:\(UIApplication\s*\*\)application\s*didFinishLaunchingWithOptions:\(NSDictionary\s*\*\)launchOptions\s*\{\s*\n)/,
        `$1  [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];\n`
      );
    }

    return contents;
  }

  // swift
  if (!contents.includes("import FBSDKCoreKit")) {
    contents = contents.replace(
      /^import\s+UIKit\s*\n/m,
      `import UIKit\nimport FBSDKCoreKit\n`
    );
  }

  if (
    !contents.includes(
      "ApplicationDelegate.shared.application(application, didFinishLaunchingWithOptions: launchOptions)"
    )
  ) {
    // Insert just after didFinishLaunchingWithOptions opens (handles "= nil" template variants).
    contents = contents.replace(
      /(func\s+application\([^\)]*didFinishLaunchingWithOptions[^\)]*\)\s*->\s*Bool\s*\{\s*\n)/m,
      `$1    ApplicationDelegate.shared.application(application, didFinishLaunchingWithOptions: launchOptions)\n`
    );
  }

  return contents;
}

const withFacebookAppEventsIos = (config, props) => {
  config = withInfoPlist(config, (config) => {
    const infoPlist = config.modResults;
    const appId = props.appId;

    infoPlist.FacebookAppID = appId;
    infoPlist.FacebookDisplayName =
      props.displayName ?? config.name ?? infoPlist.CFBundleDisplayName;

    if (props.clientToken) {
      infoPlist.FacebookClientToken = props.clientToken;
    }

    if (typeof props.autoLogAppEventsEnabled === "boolean") {
      infoPlist.FacebookAutoLogAppEventsEnabled = props.autoLogAppEventsEnabled;
    }

    if (typeof props.advertiserIDCollectionEnabled === "boolean") {
      infoPlist.FacebookAdvertiserIDCollectionEnabled =
        props.advertiserIDCollectionEnabled;
    }

    if (props.iosUserTrackingUsageDescription) {
      infoPlist.NSUserTrackingUsageDescription =
        props.iosUserTrackingUsageDescription;
    }

    setFacebookUrlScheme(infoPlist, appId);
    addLSApplicationQueriesSchemes(infoPlist);

    config.modResults = infoPlist;
    return config;
  });

  config = withAppDelegate(config, (config) => {
    const { modResults } = config;
    const language = modResults.language;

    if (typeof modResults.contents === "string") {
      modResults.contents = addFacebookAppDelegateInit(
        modResults.contents,
        language
      );
    }

    config.modResults = modResults;
    return config;
  });

  return config;
};

module.exports = withFacebookAppEventsIos;


