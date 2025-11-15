import {renderHook, act} from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthStore} from '../../src/store/authStore';
import {apiService} from '../../src/services/apiService';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../src/services/apiService');

describe('authStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('initializes with empty state', () => {
    const {result} = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('login stores token and user', async () => {
    const mockUser = {id: 1, nom: 'Test User', email: 'test@example.com'};
    const mockToken = 'test-token';
    
    (apiService.post as jest.Mock).mockResolvedValue({
      data: {
        data: {
          user: mockUser,
          token: mockToken,
        },
      },
    });

    const {result} = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('logout clears state', async () => {
    const {result} = renderHook(() => useAuthStore());

    // First login
    (apiService.post as jest.Mock).mockResolvedValue({
      data: {data: {user: {id: 1}, token: 'token'}},
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    // Then logout
    (apiService.post as jest.Mock).mockResolvedValue({});

    await act(async () => {
      await result.current.logout();
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('token');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});

