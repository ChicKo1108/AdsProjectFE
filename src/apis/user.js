import request from '../utils/request';
import { logger } from '../config';

export const getUserList = async (params) => {
  logger.info('Get user list API call');
  return await request.get('/admin/users', { params });
};

export const updateUser = async (id, data) => {
  logger.info('Update user API call');
  return await request.put(`/admin/users/${id}`, data);
};

export const createUser = async (data) => {
  logger.info('Create user API call');
  return await request.post('/admin/users', data);
};