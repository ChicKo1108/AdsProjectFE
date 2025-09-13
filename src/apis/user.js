import request from '../utils/request';
import { logger } from '../config';

// 获取用户列表API
export const getUserList = async (params = {}) => {
  logger.info('Get user list API call:', params);
  
  // return await request.get('/users', { params });
  
  // 模拟用户列表数据
  const mockUsers = [
    {
      id: 1,
      username: '管理员',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      createTime: '2024-01-01 10:00:00',
      lastLogin: '2024-01-15 14:30:00'
    },
    {
      id: 2,
      username: '普通用户1',
      email: 'user1@example.com',
      role: 'user',
      status: 'active',
      createTime: '2024-01-02 11:00:00',
      lastLogin: '2024-01-14 16:20:00'
    },
    {
      id: 3,
      username: '普通用户2',
      email: 'user2@example.com',
      role: 'user',
      status: 'inactive',
      createTime: '2024-01-03 12:00:00',
      lastLogin: '2024-01-10 09:15:00'
    }
  ];
  
  return {
    success: true,
    data: {
      list: mockUsers,
      total: mockUsers.length,
      page: params.page || 1,
      pageSize: params.pageSize || 20
    }
  };
};

// 创建用户API
export const createUser = async (userData) => {
  logger.info('Create user API call:', userData);
  
  // return await request.post('/users', userData);
  
  // 模拟创建用户
  return {
    success: true,
    data: {
      id: Date.now(),
      ...userData,
      createTime: new Date().toLocaleString('zh-CN'),
      lastLogin: '-'
    },
    message: '用户创建成功'
  };
};

// 更新用户API
export const updateUser = async (userId, userData) => {
  logger.info('Update user API call:', { userId, userData });
  
  // return await request.put(`/users/${userId}`, userData);
  
  // 模拟更新用户
  return {
    success: true,
    data: {
      id: userId,
      ...userData,
      updateTime: new Date().toLocaleString('zh-CN')
    },
    message: '用户信息更新成功'
  };
};

// 删除用户API
export const deleteUser = async (userId) => {
  logger.info('Delete user API call:', userId);
  
  // return await request.delete(`/users/${userId}`);
  
  // 模拟删除用户
  return {
    success: true,
    message: '用户删除成功'
  };
};

// 批量删除用户API
export const batchDeleteUsers = async (userIds) => {
  logger.info('Batch delete users API call:', userIds);
  
  try {
    // return await request.post('/users/batch-delete', { ids: userIds });
    
    // 模拟批量删除用户
    return {
      success: true,
      message: `成功删除 ${userIds.length} 个用户`
    };
  } catch (error) {
    logger.error('Batch delete users API error:', error);
    throw error;
  }
};

// 重置用户密码API
export const resetUserPassword = async (userId, newPassword) => {
  logger.info('Reset user password API call:', userId);
  
  try {
    // return await request.post(`/users/${userId}/reset-password`, { password: newPassword });
    
    // 模拟重置密码
    return {
      success: true,
      message: '密码重置成功'
    };
  } catch (error) {
    logger.error('Reset user password API error:', error);
    throw error;
  }
};

// 切换用户状态API
export const toggleUserStatus = async (userId, status) => {
  logger.info('Toggle user status API call:', { userId, status });
  
  try {
    // return await request.patch(`/users/${userId}/status`, { status });
    
    // 模拟切换用户状态
    return {
      success: true,
      data: { status },
      message: `用户状态已${status === 'active' ? '激活' : '禁用'}`
    };
  } catch (error) {
    logger.error('Toggle user status API error:', error);
    throw error;
  }
};

// 获取用户详情API
export const getUserDetail = async (userId) => {
  logger.info('Get user detail API call:', userId);
  
  try {
    // return await request.get(`/users/${userId}`);
    
    // 模拟获取用户详情
    return {
      success: true,
      data: {
        id: userId,
        username: '示例用户',
        email: 'example@example.com',
        role: 'user',
        status: 'active',
        createTime: '2024-01-01 10:00:00',
        lastLogin: '2024-01-15 14:30:00',
        profile: {
          avatar: '',
          phone: '',
          address: '',
          bio: ''
        }
      }
    };
  } catch (error) {
    logger.error('Get user detail API error:', error);
    throw error;
  }
};