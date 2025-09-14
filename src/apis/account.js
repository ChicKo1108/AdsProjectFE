import request from "../utils/request";

export const getAccountInfo = async () => {
  return await request.get('/admin/account');
};

export const updateAccountInfo = async (data) => {
  return await request.put('/admin/account', data);
};