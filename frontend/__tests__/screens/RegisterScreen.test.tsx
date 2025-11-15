import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import RegisterScreen from '../../src/screens/auth/RegisterScreen';
import {useAuthStore} from '../../src/store/authStore';

jest.mock('../../src/store/authStore');

describe('RegisterScreen', () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    (useAuthStore as jest.Mock).mockReturnValue({
      register: mockRegister,
    });
    mockRegister.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByPlaceholderText, getByText} = render(<RegisterScreen />);
    
    expect(getByPlaceholderText('Nom complet')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    expect(getByText('S\'inscrire')).toBeTruthy();
  });

  it('validates password confirmation', () => {
    const {getByPlaceholderText, getByText} = render(<RegisterScreen />);
    
    const passwordInput = getByPlaceholderText('Mot de passe');
    const confirmPasswordInput = getByPlaceholderText('Confirmer le mot de passe');
    const submitButton = getByText('S\'inscrire');

    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'different');
    fireEvent.press(submitButton);

    // Should show validation error
    expect(mockRegister).not.toHaveBeenCalled();
  });
});

