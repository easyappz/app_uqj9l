import { instance } from './axios';

/**
 * Get current authenticated member data
 * @returns {Promise} Promise with member data
 */
export const getMe = async () => {
  const token = localStorage.getItem('token');
  
  const response = await instance.get('/api/auth/me', {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  
  return response.data;
};

export default getMe;
