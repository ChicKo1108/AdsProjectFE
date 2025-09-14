import React, { createContext, useContext, useReducer } from 'react';
import {
  login as apiLogin,
  logout as apiLogout,
  validateToken,
} from '../apis/auth';
import { config, logger } from '../config';
import { USER_ROLE } from '../utils/constants';
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
};

// Action types
export const USER_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER_INFO: 'UPDATE_USER_INFO',
  CLEAR_ERROR: 'CLEAR_ERROR',
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

      const { token, userInfo } = await apiLogin(credentials);

      dispatch({
        type: USER_ACTIONS.LOGIN_SUCCESS,
        payload: userInfo,
      });

      // 保存到localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('token', token);

      logger.info('登录成功:', userInfo.name);
      return { success: true };
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

    // 初始化用户状态（从localStorage恢复）
    initializeUser: async () => {
      const savedUser = localStorage.getItem('userInfo');
      const token = localStorage.getItem('token');

      if (savedUser && token) {
        const userData = JSON.parse(savedUser);

        // 验证token是否有效
        const tokenValidation = await validateToken().catch(() => ({
          success: false,
        }));

        if (tokenValidation.valid) {
          dispatch({
            type: USER_ACTIONS.LOGIN_SUCCESS,
            payload: userData,
          });
          logger.info('用户状态恢复成功:', userData.name);
          message.success(`欢迎回来，${userData.name}`, 3);
        } else {
          // Token无效，清除本地数据

          logger.warn('Token无效，清除本地用户数据');
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token');
        }
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
