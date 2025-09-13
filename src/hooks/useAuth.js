import { useUser } from '../contexts/UserContext';
import { USER_ROLE } from '../utils/constants';

/**
 * 认证相关的自定义Hook
 * 提供登录、登出等认证功能的便捷接口
 */
export function useAuth() {
  const {
    isLoggedIn,
    userInfo,
    loading,
    error,
    login,
    logout,
    updateUserInfo,
    clearError,
    initializeUser,
  } = useUser();

  // 检查用户是否有特定权限
  const hasPermission = permission => {
    if (!isLoggedIn) return false;

    // 这里可以根据实际需求实现权限检查逻辑
    // 例如检查用户角色、权限列表等
    switch (permission) {
      case USER_ROLE.SUPER_ADMIN:
        return userInfo.role === USER_ROLE.SUPER_ADMIN;
      case USER_ROLE.ADMIN:
        return (
          userInfo.role === USER_ROLE.ADMIN ||
          userInfo.role === USER_ROLE.SUPER_ADMIN
        );
      case USER_ROLE.USER:
        return (
          userInfo.role === USER_ROLE.USER ||
          userInfo.role === USER_ROLE.ADMIN ||
          userInfo.role === USER_ROLE.SUPER_ADMIN
        );
      default:
        return false;
    }
  };

  // 检查用户是否为管理员
  const isAdmin = () => {
    return (
      isLoggedIn &&
      (userInfo.role === USER_ROLE.ADMIN ||
        userInfo.role === USER_ROLE.SUPER_ADMIN)
    );
  };

  const isSuperAdmin = () => {
    return isLoggedIn && userInfo.role === USER_ROLE.SUPER_ADMIN;
  };

  // 获取用户显示名称
  const getDisplayName = () => {
    if (!isLoggedIn) return '';
    return userInfo.name || userInfo.email || '未知用户';
  };

  // 快速登录（用于演示）
  const quickLogin = async (username = '演示用户') => {
    return await login({ username, email: `${username}@demo.com` });
  };

  return {
    // 状态
    isLoggedIn,
    userInfo,
    loading,
    error,

    // 操作
    login,
    logout,
    updateUserInfo,
    clearError,
    initializeUser,
    quickLogin,

    // 工具函数
    hasPermission,
    isAdmin,
    getDisplayName,
  };
}

export default useAuth;
