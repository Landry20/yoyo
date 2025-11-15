import axios from 'axios';
import {apiService} from '../../src/services/apiService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockedAxios);
  });

  it('makes GET request', async () => {
    mockedAxios.get.mockResolvedValue({data: {success: true}});

    await apiService.get('/test');

    expect(mockedAxios.get).toHaveBeenCalledWith('/test', undefined);
  });

  it('makes POST request', async () => {
    const data = {email: 'test@example.com', password: 'password123'};
    mockedAxios.post.mockResolvedValue({data: {success: true}});

    await apiService.post('/auth/login', data);

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', data, undefined);
  });

  it('sets token in headers', () => {
    apiService.setToken('test-token');
    
    // Token should be set in axios default headers
    expect(mockedAxios.defaults.headers.common['Authorization']).toBe('Bearer test-token');
  });
});

