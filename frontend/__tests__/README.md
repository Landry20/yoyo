# Tests YoYo Frontend

## Structure des Tests

```
__tests__/
├── App.test.tsx              # Test du composant App principal
├── setup.ts                  # Configuration globale des tests
├── screens/                  # Tests des écrans
│   ├── LoginScreen.test.tsx
│   └── RegisterScreen.test.tsx
├── services/                 # Tests des services
│   └── apiService.test.ts
├── store/                    # Tests des stores (Zustand)
│   └── authStore.test.ts
└── utils/                    # Tests des utilitaires
    └── screenshotPrevention.test.ts
```

## Exécuter les Tests

### Tous les tests
```bash
npm test
```

### En mode watch
```bash
npm test -- --watch
```

### Un fichier spécifique
```bash
npm test -- LoginScreen.test.tsx
```

### Avec couverture
```bash
npm test -- --coverage
```

## Mocks Configurés

- `@react-native-async-storage/async-storage` - AsyncStorage mocké
- `@react-navigation/native` - Navigation mockée
- `react-native-vector-icons` - Icons mockées
- `react-native-video` - Video player mocké
- `react-native-image-picker` - Image picker mocké
- `react-native-fast-image` - FastImage mocké
- `react-native-linear-gradient` - LinearGradient mocké

## Écrire de Nouveaux Tests

### Exemple de test d'écran

```typescript
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import MyScreen from '../../src/screens/MyScreen';

describe('MyScreen', () => {
  it('renders correctly', () => {
    const {getByText} = render(<MyScreen />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('handles button press', () => {
    const {getByText} = render(<MyScreen />);
    const button = getByText('Press me');
    
    fireEvent.press(button);
    // Assert expected behavior
  });
});
```

### Exemple de test de service

```typescript
import {myService} from '../../src/services/myService';
import {apiService} from '../../src/services/apiService';

jest.mock('../../src/services/apiService');

describe('myService', () => {
  it('calls API correctly', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({data: {}});
    
    await myService.fetchData();
    
    expect(apiService.get).toHaveBeenCalledWith('/endpoint');
  });
});
```

## Coverage

Le coverage est configuré pour collecter les données de:
- Tous les fichiers `.ts` et `.tsx` dans `src/`
- Exclut les fichiers de déclaration `.d.ts`
- Exclut les fichiers de test eux-mêmes

Objectif de coverage: 70%+

