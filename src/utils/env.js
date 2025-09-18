// 环境变量工具函数

/**
 * 获取环境变量值
 * @param {string} key - 环境变量键名
 * @param {string} defaultValue - 默认值
 * @returns {string} 环境变量值
 */
export const getEnv = (key, defaultValue = '') => {
  // 在浏览器环境中，只能使用 import.meta.env
  if (typeof window !== 'undefined') {
    return import.meta.env[key] || defaultValue;
  }
  
  // 在Node.js环境中（构建时），可以使用 process.env
  return process.env[key] || import.meta.env[key] || defaultValue;
};

/**
 * 获取布尔类型的环境变量
 * @param {string} key - 环境变量键名
 * @param {boolean} defaultValue - 默认值
 * @returns {boolean} 布尔值
 */
export const getBoolEnv = (key, defaultValue = false) => {
  const value = getEnv(key, String(defaultValue));
  return value === 'true' || value === '1';
};

/**
 * 获取数字类型的环境变量
 * @param {string} key - 环境变量键名
 * @param {number} defaultValue - 默认值
 * @returns {number} 数字值
 */
export const getNumberEnv = (key, defaultValue = 0) => {
  const value = getEnv(key, String(defaultValue));
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * 获取JSON类型的环境变量
 * @param {string} key - 环境变量键名
 * @param {any} defaultValue - 默认值
 * @returns {any} 解析后的JSON值
 */
export const getJsonEnv = (key, defaultValue = null) => {
  const value = getEnv(key);
  if (!value) return defaultValue;
  
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`Failed to parse JSON env var ${key}:`, error);
    return defaultValue;
  }
};

/**
 * 检查是否为开发环境
 * @returns {boolean}
 */
export const isDevelopment = () => {
  return getEnv('VITE_APP_ENV', 'development') === 'development';
};

/**
 * 检查是否为生产环境
 * @returns {boolean}
 */
export const isProduction = () => {
  return getEnv('VITE_APP_ENV', 'development') === 'production';
};

/**
 * 获取所有以指定前缀开头的环境变量
 * @param {string} prefix - 前缀
 * @returns {object} 环境变量对象
 */
export const getEnvByPrefix = (prefix) => {
  const result = {};
  
  // 在浏览器环境中遍历 import.meta.env
  if (typeof window !== 'undefined' && import.meta.env) {
    Object.keys(import.meta.env).forEach(key => {
      if (key.startsWith(prefix)) {
        result[key] = import.meta.env[key];
      }
    });
  }
  
  return result;
};

// 导出常用的环境变量
export const ENV_VARS = {
  // 应用配置
  APP_ENV: getEnv('VITE_APP_ENV', 'development'),
  APP_TITLE: getEnv('VITE_APP_TITLE', '广告管理系统'),
  APP_VERSION: getEnv('VITE_APP_VERSION', '1.0.0'),
  APP_DEBUG: getBoolEnv('VITE_APP_DEBUG', false),
  
  // API配置
  API_BASE_URL: getEnv('VITE_API_BASE_URL', 'http://localhost:3000/api'),
  API_TIMEOUT: getNumberEnv('VITE_API_TIMEOUT', 10000),
  
  // 功能开关
  FEATURE_ADMIN: getBoolEnv('VITE_FEATURE_ADMIN', true),
  FEATURE_ANALYTICS: getBoolEnv('VITE_FEATURE_ANALYTICS', true),
  
  // 其他配置
  UPLOAD_MAX_SIZE: getNumberEnv('VITE_UPLOAD_MAX_SIZE', 10485760),
  PAGE_SIZE: getNumberEnv('VITE_PAGE_SIZE', 20),
};