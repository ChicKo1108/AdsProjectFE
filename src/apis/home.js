import request from "../utils/request";

export const getHomeInfo = async () => {
  return await request.get('/home');
}