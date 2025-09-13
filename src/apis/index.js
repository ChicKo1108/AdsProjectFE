// API模块统一导出

// 认证相关API
export {
  login,
  logout,
  getUserInfo,
  validateToken
} from './auth';

// 首页API
export {
  getHomeInfo
} from './home';

// 用户管理相关API
export {
  getUserList,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  resetUserPassword,
  toggleUserStatus,
  getUserDetail
} from './user';

// 导出请求实例和工具方法
export { default as request } from '../utils/request';
export {
  get,
  post,
  put,
  del,
  patch,
  upload,
  download
} from '../utils/request';