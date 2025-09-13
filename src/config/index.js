// 环境配置管理

// 获取环境变量的辅助函数
const getEnvVar = (key, defaultValue = '') => {
  return import.meta.env[key] || defaultValue;
};

// 环境配置
export const config = {
  // 环境信息
  env: getEnvVar('VITE_APP_ENV', 'development'),
  title: getEnvVar('VITE_APP_TITLE', '广告管理系统'),
  version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  debug: getEnvVar('VITE_APP_DEBUG', 'false') === 'true',
  logLevel: getEnvVar('VITE_APP_LOG_LEVEL', 'info'),
  
  // API配置
  api: {
    baseURL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api'),
    timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '10000')),
  },
  
  // 功能开关
  features: {
    admin: getEnvVar('VITE_FEATURE_ADMIN', 'true') === 'true',
    analytics: getEnvVar('VITE_FEATURE_ANALYTICS', 'true') === 'true',
  },
  
  // 应用配置
  app: {
    uploadMaxSize: parseInt(getEnvVar('VITE_UPLOAD_MAX_SIZE', '10485760')), // 10MB
    pageSize: parseInt(getEnvVar('VITE_PAGE_SIZE', '20')),
  },
};

// 开发环境检查
export const isDev = config.env === 'development';
export const isProd = config.env === 'production';

// 日志工具
export const logger = {
  debug: (...args) => {
    if (config.debug && (config.logLevel === 'debug' || isDev)) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args) => {
    if (['debug', 'info'].includes(config.logLevel) || isDev) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args) => {
    if (['debug', 'info', 'warn'].includes(config.logLevel) || isDev) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
  },
};

// 导出默认配置
export default config;