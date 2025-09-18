// 环境配置管理
import { getEnv, getBoolEnv, getNumberEnv, isDevelopment, isProduction } from '@/utils/env';

// 环境配置
export const config = {
  // 环境信息
  env: getEnv('VITE_APP_ENV', 'development'),
  title: getEnv('VITE_APP_TITLE', '广告管理系统'),
  version: getEnv('VITE_APP_VERSION', '1.0.0'),
  debug: getBoolEnv('VITE_APP_DEBUG', false),
  logLevel: getEnv('VITE_APP_LOG_LEVEL', 'info'),
  
  // API配置
  api: {
    baseURL: getEnv('VITE_API_BASE_URL', 'http://localhost:3000/api'),
    timeout: getNumberEnv('VITE_API_TIMEOUT', 10000),
  },
  
  // 功能开关
  features: {
    admin: getBoolEnv('VITE_FEATURE_ADMIN', true),
    analytics: getBoolEnv('VITE_FEATURE_ANALYTICS', true),
  },
  
  // 应用配置
  app: {
    uploadMaxSize: getNumberEnv('VITE_UPLOAD_MAX_SIZE', 10485760), // 10MB
    pageSize: getNumberEnv('VITE_PAGE_SIZE', 20),
  },
};

// 开发环境检查
export const isDev = isDevelopment();
export const isProd = isProduction();

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