import request from "../utils/request";

export const getAccountInfo = async (accountId) => {
  const config = {};
  if (accountId) {
    config.params = { accountId };
  }
  
  return await request.get('/admin/account', config);
};

export const updateAccountInfo = async (data, accountId) => {
  const requestData = { ...data };

  return await request.put(`/admin/account/${accountId}`, requestData);
};

// 获取所有账户列表
export const getAccountList = async () => {
  const config = {};
  
  return await request.get('/admin/account/list', config);
};

// 创建账户
export const createAccount = async (data) => {
  return await request.post('/admin/account', data);
};

// 删除账户
export const deleteAccount = async (accountId) => {
  return await request.delete(`/admin/account/${accountId}`);
};

// 获取账户下的用户列表
export const getAccountUsers = async (accountId) => {
  return await request.get(`/admin/account/${accountId}/users`);
};