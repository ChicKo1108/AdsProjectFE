import request from '../utils/request';
import { logger } from '../config';

export const getUserList = async () => {
  logger.info('Get user list API call');
  
  return await request.get('/admin/users');
};

export const updateUser = async (id, data) => {
  logger.info('Update user API call');
  
  return await request.put(`/admin/users/${id}`, data);
};

export const createUser = async (data, accountId) => {
  logger.info('Create user API call');
  
  const requestData = { ...data };
  if (accountId) {
    requestData.accountId = accountId;
  }
  
  return await request.post('/admin/users', requestData);
};

// 获取用户的账户绑定信息
export const getUserAccounts = async (userId) => {
  logger.info('Get user accounts API call');
  
  return await request.get(`/admin/users/${userId}/accounts`);
};

// 绑定用户到账户
export const bindUserAccount = async (userId, data) => {
  logger.info('Bind user account API call');
  
  const requestData = { ...data };
  
  return await request.post(`/admin/users/${userId}/accounts`, requestData);
};

// 解绑用户账户
export const unbindUserAccount = async (userId, data) => {
  logger.info('Unbind user account API call');
  
  const requestData = { ...data };
  
  return await request.delete(`/admin/users/${userId}/accounts`, { data: requestData });
};

// 更新用户账户权限
export const updateUserAccountRole = async (userId, data) => {
  logger.info('Update user account role API call');
  
  const requestData = { ...data };
  
  return await request.put(`/admin/users/${userId}/accounts`, requestData);
};