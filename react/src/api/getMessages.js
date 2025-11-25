import instance from './axios';

export const getMessages = async () => {
  const token = localStorage.getItem('token');
  
  const response = await instance.get('/api/messages', {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  
  return response.data;
};
