import request from '../utils/request';
import { logger } from '../config';

// 登录API
export const login = async (credentials) => {
  logger.info('Login attempt:', credentials.username);
  return await request.post('/auth/login', {
    username: credentials.username,
    password: credentials.password
  });
};

// 退出登录API
export const logout = async () => {
  logger.info('Logout API call');

  // return await request.post('/auth/logout');

  // 模拟退出登录
  return { success: true, message: '退出登录成功' };
};


// 获取用户信息API
export const getUserInfo = async () => {
  logger.info('Get user info API call');

  // return await request.get('/auth/user');

  // 模拟获取用户信息
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  return {
    success: true,
    data: userInfo
  };
};


// 验证token
export const validateToken = async (token) => {
  logger.info('Validate token API call');

  return await request.post('/auth/validate-token', { token });
};