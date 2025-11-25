import { instance } from './axios';

/**
 * Get all messages
 * @returns {Promise} Promise with messages array
 */
export const getMessages = async () => {
  const token = localStorage.getItem('token');
  
  const response = await instance.get('/api/messages', {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  
  return response.data;
};
