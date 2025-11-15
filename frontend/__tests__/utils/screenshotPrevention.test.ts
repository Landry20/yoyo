import {preventScreenshot} from '../../src/utils/screenshotPrevention';
import {NativeModules, Platform} from 'react-native';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    select: jest.fn(),
  },
  NativeModules: {
    ScreenshotPrevent: {
      enabled: jest.fn(),
      disabled: jest.fn(),
    },
  },
}));

describe('screenshotPrevention', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('enables screenshot prevention on Android', () => {
    (Platform.OS as any) = 'android';
    
    preventScreenshot(true);

    expect(NativeModules.ScreenshotPrevent?.enabled).toHaveBeenCalled();
  });

  it('disables screenshot prevention', () => {
    (Platform.OS as any) = 'android';
    
    preventScreenshot(false);

    expect(NativeModules.ScreenshotPrevent?.disabled).toHaveBeenCalled();
  });

  it('handles unsupported platforms gracefully', () => {
    (NativeModules.ScreenshotPrevent as any) = null;
    
    expect(() => preventScreenshot(true)).not.toThrow();
  });
});

