/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicit to enable control over style prop
import {render} from '@testing-library/react-native';

it('renders correctly', () => {
  render(<App />);
});

