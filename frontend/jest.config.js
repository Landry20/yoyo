module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-vector-icons|react-native-video|react-native-fast-image|react-native-linear-gradient|@react-native-async-storage|@react-native-firebase)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx}',
    '**/?(*.)+(spec|test).{ts,tsx}',
  ],
};

