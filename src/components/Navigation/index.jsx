import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Button, Modal, Input, message } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import './Navigation.css';
import { updateName, updatePassword } from '../../apis';
import useApp from 'antd/es/app/useApp';

function Navigation({ pageKey }) {
  const {
    isLoggedIn,
    userInfo,
    loading,
    error,
    logout,
    getDisplayName,
    clearError,
    updateUserInfo,
    isAdmin,
  } = useAuth();

  const { message } = useApp();

  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  // 显示修改密码模态框
  const showPasswordModal = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsPasswordModalVisible(true);
  };

  // 处理修改用户名
  const handleUpdateUsername = async () => {
    if (newUsername.trim() && newUsername !== getDisplayName()) {
      await updateName(newUsername.trim());
      updateUserInfo({ name: newUsername.trim() });
      message.success('用户名修改成功');
    }
    setIsModalVisible(false);
  };

  // 处理修改密码
  const handleUpdatePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    // 表单验证
    if (!currentPassword.trim()) {
      message.error('请输入当前密码');
      return;
    }
    if (!newPassword.trim()) {
      message.error('请输入新密码');
      return;
    }
    if (newPassword.length < 6) {
      message.error('新密码长度至少6位');
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    if (currentPassword === newPassword) {
      message.error('新密码不能与当前密码相同');
      return;
    }

    try {
      // 这里需要调用修改密码的API
      await updatePassword(currentPassword, newPassword, confirmPassword);
      message.success('密码修改成功，请重新登录');
      setIsPasswordModalVisible(false);
      // 修改密码成功后退出登录
      logout();
    } catch (error) {
      message.error(error.message || '密码修改失败');
    }
  };

  // 处理密码表单输入
  const handlePasswordFormChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 取消修改用户名
  const handleCancel = () => {
    setIsModalVisible(false);
    setNewUsername('');
  };

  // 跳转到管理后台
  const handleAdminPanel = () => {
    navigate('/admin/dashboard');
  };

  // 下拉菜单项
  const menuItems = [
    ...(isAdmin()
      ? [
          {
            key: 'admin',
            icon: <SettingOutlined />,
            label: '管理后台',
            onClick: handleAdminPanel,
          },
          {
            type: 'divider',
          },
        ]
      : []),
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '修改昵称',
      onClick: showModal,
    },
    {
      type: 'divider',
    },
    {
      key: 'password',
      icon: <KeyOutlined />,
      label: '修改密码',
      onClick: showPasswordModal,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <nav className="navigation">
      <div className="navigation-wrapper">
        <div className="navigation-links">
          <Link
            to="/"
            className="navigation-link"
            data-active={pageKey === 'home'}
          >
            首页
          </Link>
          <Link
            to="/ad-plans"
            className="navigation-link"
            data-active={pageKey === 'adPlans'}
          >
            广告计划
          </Link>
          <Link
            to="/ad-groups"
            className="navigation-link"
            data-active={pageKey === 'adGroups'}
          >
            广告组
          </Link>
          <Link
            to="/ad-creatives"
            className="navigation-link"
            data-active={pageKey === 'adCreatives'}
          >
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
                  <UserOutlined style={{ marginRight: 5 }} />
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
                  onChange={e => setNewUsername(e.target.value)}
                  onPressEnter={handleUpdateUsername}
                />
              </Modal>

              <Modal
                title="修改密码"
                open={isPasswordModalVisible}
                onOk={handleUpdatePassword}
                onCancel={() => setIsPasswordModalVisible(false)}
                okText="确认修改"
                cancelText="取消"
                width={400}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                      }}
                    >
                      当前密码
                    </label>
                    <Input.Password
                      placeholder="请输入当前密码"
                      value={passwordForm.currentPassword}
                      onChange={e =>
                        handlePasswordFormChange(
                          'currentPassword',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                      }}
                    >
                      新密码
                    </label>
                    <Input.Password
                      placeholder="请输入新密码（至少6位）"
                      value={passwordForm.newPassword}
                      onChange={e =>
                        handlePasswordFormChange('newPassword', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                      }}
                    >
                      确认新密码
                    </label>
                    <Input.Password
                      placeholder="请再次输入新密码"
                      value={passwordForm.confirmPassword}
                      onChange={e =>
                        handlePasswordFormChange(
                          'confirmPassword',
                          e.target.value
                        )
                      }
                      onPressEnter={handleUpdatePassword}
                    />
                  </div>
                </div>
              </Modal>
            </>
          ) : (
            <Button onClick={handleLogin} type="primary" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
