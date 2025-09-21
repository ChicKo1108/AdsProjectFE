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
  if (accountId) {
    requestData.accountId = accountId;
  }
  
  return await request.put('/admin/account', requestData);
};

// 获取所有账户列表
export const getAccountList = async () => {
  const config = {};
  
  return await request.get('/admin/account/list', config);
};