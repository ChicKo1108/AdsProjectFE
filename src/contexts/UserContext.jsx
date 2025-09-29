import React, { createContext, useContext, useReducer } from 'react';
import {
  login as apiLogin,
  logout as apiLogout,
  validateToken,
  getUserAccounts,
} from '../apis/auth';
import { logger } from '../config';
import { message } from 'antd';

// 用户状态的初始值
const initialState = {
  isLoggedIn: false,
  userInfo: {
    id: null,
    name: '',
    email: '',
    avatar: '',
    role: 'user',
  },
  loading: false,
  error: null,
  // 新增账户相关状态
  accounts: [], // 用户可访问的账户列表
  currentAccount: null, // 当前选中的账户
  accountsLoading: false, // 账户加载状态
};

// Action types
export const USER_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER_INFO: 'UPDATE_USER_INFO',
  CLEAR_ERROR: 'CLEAR_ERROR',
  // 新增账户相关actions
  LOAD_ACCOUNTS_START: 'LOAD_ACCOUNTS_START',
  LOAD_ACCOUNTS_SUCCESS: 'LOAD_ACCOUNTS_SUCCESS',
  LOAD_ACCOUNTS_FAILURE: 'LOAD_ACCOUNTS_FAILURE',
  SET_CURRENT_ACCOUNT: 'SET_CURRENT_ACCOUNT',
};

// Reducer function
function userReducer(state, action) {
  switch (action.type) {
    case USER_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case USER_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userInfo: action.payload,
        loading: false,
        error: null,
      };

    case USER_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        loading: false,
        error: action.payload,
      };

    case USER_ACTIONS.LOGOUT:
      return {
        ...initialState,
      };

    case USER_ACTIONS.UPDATE_USER_INFO:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
      };

    case USER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    // 新增账户相关的状态处理
    case USER_ACTIONS.LOAD_ACCOUNTS_START:
      return {
        ...state,
        accountsLoading: true,
      };

    case USER_ACTIONS.LOAD_ACCOUNTS_SUCCESS:
      return {
        ...state,
        accounts: action.payload,
        accountsLoading: false,
      };

    case USER_ACTIONS.LOAD_ACCOUNTS_FAILURE:
      return {
        ...state,
        accountsLoading: false,
        error: action.payload,
      };

    case USER_ACTIONS.SET_CURRENT_ACCOUNT:
      return {
        ...state,
        currentAccount: action.payload,
      };

    default:
      return state;
  }
}

// Create Context
const UserContext = createContext();

// Provider Component
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Action creators
  const actions = {
    // 登录
    login: async credentials => {
      dispatch({ type: USER_ACTIONS.LOGIN_START });
      logger.info('开始登录:', credentials.username);

      try {
        const { token, userInfo } = await apiLogin(credentials);

        dispatch({
          type: USER_ACTIONS.LOGIN_SUCCESS,
          payload: userInfo,
        });

        // 保存到localStorage
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('token', token);

        logger.info('登录成功:', userInfo.name);
        
        // 登录成功后立即加载用户账户列表
        await actions.loadUserAccounts();
        
        return { success: true };
      } catch (error) {
        logger.error('登录失败:', error);
        dispatch({
          type: USER_ACTIONS.LOGIN_FAILURE,
          payload: '登录失败，请检查用户名和密码'
        });
        throw error; // 重新抛出错误，让调用方知道登录失败
      }
    },

    // 退出登录
    logout: async () => {
      logger.info('用户退出登录');

      // 调用退出登录API（忽略可能的错误）
      await apiLogout().catch(error => {
        logger.warn('退出登录API调用失败:', error);
      });

      // 清除本地状态
      dispatch({ type: USER_ACTIONS.LOGOUT });

      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      localStorage.removeItem('currentAccount');
    },

    // 更新用户信息
    updateUserInfo: userInfo => {
      dispatch({
        type: USER_ACTIONS.UPDATE_USER_INFO,
        payload: userInfo,
      });

      // 更新localStorage
      const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const updatedUser = { ...currentUser, ...userInfo };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    },

    // 清除错误
    clearError: () => {
      dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
    },

    // 加载用户可访问的账户列表
    loadUserAccounts: async () => {
      dispatch({ type: USER_ACTIONS.LOAD_ACCOUNTS_START });
      
      try {
        const accounts = await getUserAccounts();
        
        dispatch({
          type: USER_ACTIONS.LOAD_ACCOUNTS_SUCCESS,
          payload: accounts || [],
        });

        // 自动选择账户
        await actions.selectAccount(accounts);
        
        logger.info('用户账户列表加载成功:', accounts);
      } catch (error) {
        logger.error('加载用户账户列表失败:', error);
        dispatch({
          type: USER_ACTIONS.LOAD_ACCOUNTS_FAILURE,
          payload: '加载账户列表失败',
        });
      }
    },

    // 选择账户逻辑
    selectAccount: async (accounts) => {
      if (!accounts || accounts.length === 0) {
        logger.warn('用户没有可访问的账户');
        return;
      }

      // 从localStorage读取上一次选择的账户
      const savedAccountId = localStorage.getItem('currentAccount');
      let selectedAccount = null;

      if (savedAccountId) {
        // 检查保存的账户是否在可访问列表中
        selectedAccount = accounts.find(account => account.id.toString() === savedAccountId);
        
        if (selectedAccount) {
          logger.info('恢复上次选择的账户:', selectedAccount.name);
        } else {
          logger.warn('上次选择的账户无权限访问，将选择第一个账户');
        }
      }

      // 如果没有保存的账户或保存的账户无权限，选择第一个账户
      if (!selectedAccount) {
        selectedAccount = accounts[0];
        logger.info('选择第一个可访问的账户:', selectedAccount.name);
      }

      // 设置当前账户
      dispatch({
        type: USER_ACTIONS.SET_CURRENT_ACCOUNT,
        payload: selectedAccount,
      });

      // 保存到localStorage
      localStorage.setItem('currentAccount', selectedAccount.id.toString());
      
      message.success(`已切换到账户: ${selectedAccount.name}`);
    },

    // 手动切换账户
    switchAccount: async (accountId) => {
      const account = state.accounts.find(acc => acc.id === accountId);
      
      if (!account) {
        message.error('账户不存在或无权限访问');
        return;
      }

      dispatch({
        type: USER_ACTIONS.SET_CURRENT_ACCOUNT,
        payload: account,
      });

      localStorage.setItem('currentAccount', account.id.toString());
      message.success(`已切换到账户: ${account.name}`);
      logger.info('手动切换账户:', account.name);
    },

    // 初始化用户状态（从localStorage恢复）
    initializeUser: async () => {
      dispatch({ type: USER_ACTIONS.LOGIN_START });
      
      try {
        const savedUser = localStorage.getItem('userInfo');
        const token = localStorage.getItem('token');

        if (savedUser && token) {
          const userData = JSON.parse(savedUser);

          // 验证token是否有效
          const tokenValidation = await validateToken().catch((error) => {
            // 如果是封禁错误，不需要额外处理，响应拦截器已经处理了
            if (error.message && error.message.includes('封禁')) {
              return { success: false, banned: true };
            }
            return { success: false };
          });

          if (tokenValidation.valid) {
            dispatch({
              type: USER_ACTIONS.LOGIN_SUCCESS,
              payload: userData,
            });
            logger.info('用户状态恢复成功:', userData.name);
            message.success(`欢迎回来，${userData.name}`, 3);
            
            // 恢复用户状态后加载账户列表
            await actions.loadUserAccounts();
          } else {
            // Token无效或用户被封禁，清除本地数据
            if (tokenValidation.banned) {
              logger.warn('用户已被封禁，清除本地数据');
            } else {
              logger.warn('Token无效，清除本地用户数据');
            }
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            localStorage.removeItem('currentAccount');
            dispatch({ type: USER_ACTIONS.LOGOUT });
          }
        } else {
          // 没有保存的用户信息，设置为未登录状态
          dispatch({ type: USER_ACTIONS.LOGOUT });
        }
      } catch (error) {
        logger.error('初始化用户状态失败:', error);
        // 出错时清除本地数据
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        localStorage.removeItem('currentAccount');
        dispatch({ type: USER_ACTIONS.LOGOUT });
      }
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook to use the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
