import axios from 'axios';
import { config, logger } from '../config';
import { message } from 'antd';

// 创建axios实例
const request = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');

    if (token) {
      // 在请求头中添加token
      config.headers.Authorization = `Bearer ${token}`;
      logger.debug('Request with token:', token.substring(0, 10) + '...');
    }

    // 记录请求信息
    logger.debug('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    logger.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 记录响应信息
    logger.debug('API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });

    // 检查业务状态码
    const { data } = response;

    if (response.headers['X-New-Token']) {
      localStorage.setItem('token', response.headers['X-New-Token']);
    }
    if (data.success) {
      return data.data;
    } else {
      const errorMessage = data.message || '请求失败';
      logger.warn('Business logic error:', errorMessage);
      message.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

  },
  (error) => {
    logger.error('Response interceptor error:', error);

    // 处理HTTP状态码错误
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = '请求失败';

      switch (status) {
        case 401:
          errorMessage = '未授权，请重新登录';
          // 清除本地存储的用户信息和token
          
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          // 重定向到登录页面
          window.location.href = '/login';
          break;
        case 403:
          errorMessage = '拒绝访问，权限不足';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        case 502:
          errorMessage = '网关错误';
          break;
        case 503:
          errorMessage = '服务不可用';
          break;
        case 504:
          errorMessage = '网关超时';
          break;
        default:
          errorMessage = data?.message || `请求失败 (${status})`;
      }

      message.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // 网络错误
      const errorMessage = '网络连接失败，请检查网络设置';
      logger.error('Network error:', error.request);
      message.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    } else {
      // 其他错误
      const errorMessage = error.message || '未知错误';
      logger.error('Unknown error:', error.message);
      message.error(errorMessage);
      return Promise.reject(error);
    }
  }
);

// 导出请求实例
export default request;

// 导出常用的请求方法
export const get = (url, config) => request.get(url, config);
export const post = (url, data, config) => request.post(url, data, config);
export const put = (url, data, config) => request.put(url, data, config);
export const del = (url, config) => request.delete(url, config);
export const patch = (url, data, config) => request.patch(url, data, config);

// 文件上传方法
export const upload = (url, formData, onUploadProgress) => {
  return request.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

// 下载文件方法
export const download = (url, filename, config) => {
  return request.get(url, {
    ...config,
    responseType: 'blob',
  }).then(response => {
    // 创建下载链接
    const blob = new Blob([response]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  });
};