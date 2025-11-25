import { instance } from './axios';

/**
 * Register a new member
 * @param {Object} data - Registration data
 * @param {string} data.username - Member's display name
 * @param {string} data.login - Unique login identifier
 * @returns {Promise} Response with token and member data
 */
export const register = async (data) => {
  const response = await instance.post('/api/auth/register', data);
  return response.data;
};
