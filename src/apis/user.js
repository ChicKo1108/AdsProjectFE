import request from '../utils/request';
import { logger } from '../config';

export const getUserList = async (params, accountId) => {
  logger.info('Get user list API call');
  
  const requestParams = { ...params };
  if (accountId) {
    requestParams.accountId = accountId;
  }
  
  return await request.get('/admin/users', { params: requestParams });
};

export const updateUser = async (id, data, accountId) => {
  logger.info('Update user API call');
  
  const requestData = { ...data };
  if (accountId) {
    requestData.accountId = accountId;
  }
  
  return await request.put(`/admin/users/${id}`, requestData);
};

export const createUser = async (data, accountId) => {
  logger.info('Create user API call');
  
  const requestData = { ...data };
  if (accountId) {
    requestData.accountId = accountId;
  }
  
  return await request.post('/admin/users', requestData);
};