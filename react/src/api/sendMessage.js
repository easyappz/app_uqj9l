import { instance } from './axios';

/**
 * Send a new message
 * @param {string} text - Message text content
 * @returns {Promise} Promise with created message data
 */
export const sendMessage = async (text) => {
  const token = localStorage.getItem('token');
  
  const response = await instance.post('/api/messages', 
    { text },
    {
      headers: {
        'Authorization': `Token ${token}`
      }
    }
  );
  
  return response.data;
};
