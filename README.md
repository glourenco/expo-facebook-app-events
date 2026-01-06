# expo-facebook-app-events

Expo **config plugin** to configure the native Facebook (Meta) SDK **App Events** settings for iOS + Android.

This package is intended to be used together with a native Facebook SDK wrapper such as `react-native-fbsdk-next` (this plugin configures native files; it does **not** ship the SDK itself).

## Install

```sh
npx expo install react-native-fbsdk-next
npm i expo-facebook-app-events
```

> Note: This will not work in **Expo Go** (it requires native code). Use a dev build / EAS Build.

## Configure (app.json / app.config.js)

Add the plugin and pass your Meta app credentials:

```js
// app.config.js
export default {
  expo: {
    name: "MyApp",
    plugins: [
      [
        "expo-facebook-app-events",
        {
          appId: "123456789012345",
          clientToken: "YOUR_FACEBOOK_CLIENT_TOKEN",
          displayName: "MyApp",
          autoLogAppEventsEnabled: true,
          advertiserIDCollectionEnabled: true,
          autoInitEnabled: true,
          iosUserTrackingUsageDescription:
            "We use your device identifier to measure ad performance."
        }
      ]
    ]
  }
};
```

Then run:

```sh
npx expo prebuild
```

## Log events (JS)

Use `react-native-fbsdk-next` to log App Events:

```js
import { AppEventsLogger } from "react-native-fbsdk-next";

AppEventsLogger.logEvent("BattleTheMonster");
AppEventsLogger.logPurchase(10.99, "USD");
```

## What this plugin changes

- **iOS**
  - Sets `Info.plist` keys:
    - `FacebookAppID`
    - `FacebookClientToken` (if provided)
    - `FacebookDisplayName` (defaults to `expo.name` when omitted)
    - `FacebookAutoLogAppEventsEnabled` (if provided)
    - `FacebookAdvertiserIDCollectionEnabled` (if provided)
    - `NSUserTrackingUsageDescription` (if provided)
  - Adds URL scheme: `fb{appId}` (via `CFBundleURLTypes`)
  - Adds `LSApplicationQueriesSchemes`: `fbapi`, `fb-messenger-api`, `fbauth2`, `fbshareextension`
  - Injects minimal Facebook SDK initialization into `AppDelegate` (Swift/ObjC), if not already present.

- **Android**
  - Adds `strings.xml`:
    - `facebook_app_id`
    - `facebook_client_token` (if provided)
  - Adds `AndroidManifest.xml` `<application>` meta-data:
    - `com.facebook.sdk.ApplicationId`
    - `com.facebook.sdk.ClientToken` (if provided)
    - `com.facebook.sdk.AutoLogAppEventsEnabled` (if provided)
    - `com.facebook.sdk.AdvertiserIDCollectionEnabled` (if provided)
    - `com.facebook.sdk.AutoInitEnabled` (if provided)

## References

- Meta App Events overview: `https://developers.facebook.com/docs/app-events/overview`
- Meta App Events getting started: `https://developers.facebook.com/docs/app-events/getting-started`
- Meta App Events Android: `https://developers.facebook.com/docs/app-events/getting-started-app-events-android`
- Meta App Events iOS: `https://developers.facebook.com/docs/app-events/getting-started-app-events-ios`
- Expo config plugins: `https://docs.expo.dev/config-plugins/introduction/`
- Expo config plugin list/usage: `https://docs.expo.dev/config-plugins/plugins/`

