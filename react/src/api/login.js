import { instance } from './axios';

/**
 * Login member
 * @param {Object} data - Login data
 * @param {string} data.login - Member's unique login identifier
 * @returns {Promise} Response with token and member data
 */
export const login = async (data) => {
  const response = await instance.post('/api/auth/login', data);
  return response.data;
};
