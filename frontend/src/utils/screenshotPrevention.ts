import { Platform, NativeModules } from 'react-native';

let ScreenshotPrevent: any = null;

if (Platform.OS === 'android') {
  ScreenshotPrevent = NativeModules.ScreenshotPrevent;
} else if (Platform.OS === 'ios') {
  // Pour iOS, utiliser react-native-screenshot-prevent ou une solution native
  ScreenshotPrevent = NativeModules.ScreenshotPrevent;
}

export const preventScreenshot = (enable: boolean) => {
  if (ScreenshotPrevent) {
    if (enable) {
      ScreenshotPrevent.enabled();
    } else {
      ScreenshotPrevent.disabled();
    }
  }
};

export const isScreenshotPreventionSupported = () => {
  return ScreenshotPrevent !== null;
};

