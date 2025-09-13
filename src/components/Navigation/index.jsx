import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Button, Modal, Input, message } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import './Navigation.css';

function Navigation({ pageKey }) {
  const {
    isLoggedIn,
    userInfo,
    loading,
    error,
    logout,
    getDisplayName,
    initializeUser,
    clearError,
    updateUserInfo,
    isAdmin
  } = useAuth();

  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  // 组件挂载时初始化用户状态
  useEffect(() => {
    initializeUser();
  }, []);

  // 处理登录 - 跳转到登录页面
  const handleLogin = () => {
    navigate('/login');
  };

  // 处理登出
  const handleLogout = () => {
    logout();
  };

  // 显示修改用户名模态框
  const showModal = () => {
    setNewUsername(getDisplayName());
    setIsModalVisible(true);
  };

  // 处理修改用户名
  const handleUpdateUsername = () => {
    if (newUsername.trim() && newUsername !== getDisplayName()) {
      updateUserInfo({ name: newUsername.trim() });
      message.success('用户名修改成功');
    }
    setIsModalVisible(false);
  };

  // 取消修改用户名
  const handleCancel = () => {
    setIsModalVisible(false);
    setNewUsername('');
  };

  // 跳转到管理后台
  const handleAdminPanel = () => {
    navigate('/admin');
  };

  // 下拉菜单项
  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '修改用户名',
      onClick: showModal
    },
    ...(isAdmin() ? [{
      key: 'admin',
      icon: <SettingOutlined />,
      label: '管理后台',
      onClick: handleAdminPanel
    }] : []),
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ];

  return (
    <nav className="navigation">
      <div className="navigation-wrapper">
        <div className="navigation-links">
          <Link to="/" className="navigation-link" data-active={pageKey === 'home'}>
            首页
          </Link>
          <Link to="/ad-plans" className="navigation-link" data-active={pageKey === 'adPlans'}>
            广告计划
          </Link>
          <Link to="/ad-groups" className="navigation-link" data-active={pageKey === 'adGroups'}>
            广告组
          </Link>
          <Link to="/ad-creatives" className="navigation-link" data-active={pageKey === 'adCreatives'}>
            广告创意
          </Link>
        </div>

        <div className="navigation-user">
          {isLoggedIn ? (
            <>
              <Dropdown
                menu={{ items: menuItems }}
                trigger={['hover']}
                placement="bottomRight"
              >
                <div>
                  <UserOutlined style={{marginRight: 5}} />
                  欢迎，{getDisplayName()}
                  <DownOutlined style={{ fontSize: '12px', marginLeft: 5 }} />
                </div>
              </Dropdown>

              <Modal
                title="修改用户名"
                open={isModalVisible}
                onOk={handleUpdateUsername}
                onCancel={handleCancel}
                okText="确认"
                cancelText="取消"
              >
                <Input
                  placeholder="请输入新的用户名"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  onPressEnter={handleUpdateUsername}
                />
              </Modal>
            </>
          ) : (
            <Button
              onClick={handleLogin}
              type="primary"
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
