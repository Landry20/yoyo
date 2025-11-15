import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import LoginScreen from '../../src/screens/auth/LoginScreen';
import {useAuthStore} from '../../src/store/authStore';

// Mock the auth store
jest.mock('../../src/store/authStore');

describe('LoginScreen', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
    mockLogin.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByPlaceholderText, getByText} = render(<LoginScreen />);
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    expect(getByText('Se connecter')).toBeTruthy();
  });

  it('allows user to enter email and password', () => {
    const {getByPlaceholderText} = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Mot de passe');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('calls login function when submit button is pressed', async () => {
    const {getByPlaceholderText, getByText} = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Mot de passe');
    const submitButton = getByText('Se connecter');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});

