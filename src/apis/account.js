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