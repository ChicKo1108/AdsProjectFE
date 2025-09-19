import request from "../utils/request";

export const getHomeInfo = async (accountId) => {
  const params = accountId ? { accountId } : {};
  return await request.get('/home', { params });
}