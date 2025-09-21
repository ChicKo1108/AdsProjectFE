// API模块统一导出

// 认证相关API
export { login, logout, getUserInfo, updateName, updatePassword, validateToken } from './auth';

// 首页API
export { getHomeInfo } from './home';

// 广告计划API
export {
  getAdPlanList,
  createAdPlan,
  updateAdPlan,
  deleteAdPlan,
} from './adPlan';

// 广告创意相关API
export {
  getAdCreativeList,
  createAdCreative,
  updateAdCreative,
  deleteAdCreative,
} from './adCreatives';

// 用户管理相关API
export { 
  getUserList, 
  updateUser, 
  createUser,
  getUserAccounts,
  bindUserAccount,
  unbindUserAccount,
  updateUserAccountRole
} from './user';

// 账户相关API
export { getAccountInfo, updateAccountInfo, getAccountList } from './account';

// 广告组相关API
export {
  getAdGroups,
  createAdGroup,
  updateAdGroup,
  deleteAdGroup,
  bindAdGroupToPlan,
  unbindAdGroupFromPlan,
} from './adGroup';

// 导出请求实例和工具方法
export { default as request } from '../utils/request';
export { get, post, put, del, patch, upload, download } from '../utils/request';
