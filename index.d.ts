import type { ConfigPlugin } from "@expo/config-plugins";

export type ExpoFacebookAppEventsPluginProps = {
  /**
   * Your Meta/Facebook App ID (numbers only, as a string).
   * iOS: sets Info.plist FacebookAppID and URL scheme "fb{appId}"
   * Android: sets string resource "facebook_app_id" and AndroidManifest meta-data.
   */
  appId: string;

  /**
   * Your Meta/Facebook Client Token.
   * iOS: sets Info.plist FacebookClientToken
   * Android: sets string resource "facebook_client_token" and AndroidManifest meta-data.
   */
  clientToken?: string;

  /**
   * iOS Info.plist FacebookDisplayName. Defaults to Expo config.name when omitted.
   */
  displayName?: string;

  /**
   * Enables/disables automatic app event logging.
   * Android: com.facebook.sdk.AutoLogAppEventsEnabled
   * iOS: FacebookAutoLogAppEventsEnabled
   */
  autoLogAppEventsEnabled?: boolean;

  /**
   * Enables/disables advertiser ID collection.
   * Android: com.facebook.sdk.AdvertiserIDCollectionEnabled
   * iOS: FacebookAdvertiserIDCollectionEnabled
   */
  advertiserIDCollectionEnabled?: boolean;

  /**
   * Enables/disables automatic SDK initialization.
   * Android: com.facebook.sdk.AutoInitEnabled
   */
  autoInitEnabled?: boolean;

  /**
   * Optional. If provided, sets iOS Info.plist NSUserTrackingUsageDescription (recommended when advertiserIDCollectionEnabled is true).
   */
  iosUserTrackingUsageDescription?: string;
};

declare const withFacebookAppEvents: ConfigPlugin<ExpoFacebookAppEventsPluginProps>;

export default withFacebookAppEvents;


