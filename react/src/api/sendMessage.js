import instance from './axios';

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
