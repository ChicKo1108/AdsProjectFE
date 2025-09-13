import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import { UserOutlined, DashboardOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import UserManagement from './UserManagement';
import './Admin.css';

const { Sider, Content } = Layout;

function Admin() {
  const [selectedKey, setSelectedKey] = useState('users');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, getDisplayName } = useAuth();

  // 权限检查
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, navigate]);

  // 如果不是管理员，跳转404
  if (!isAdmin()) {
    navigate('/404', { replace: true })
    return null;
  }

  const menuItems = [
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理'
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '数据统计'
    }
  ];

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'users':
        return <UserManagement />;
      // case 'dashboard':
      //   return <Dashboard />;
      default:
        return <UserManagement />;
    }
  };

  const getBreadcrumbItems = () => {
    const items = [
      {
        title: '管理后台'
      }
    ];

    switch (selectedKey) {
      case 'users':
        items.push({ title: '用户管理' });
        break;
      default:
        items.push({ title: '用户管理' });
    }

    return items;
  };

  return (
    <Layout className="admin-layout">
      <Sider
        width={200}
        className="admin-sider"
        theme="dark"
      >
        <div className="admin-logo">
          <DashboardOutlined style={{ marginRight: 8 }} />
          管理后台
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          theme="dark"
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Content className="admin-content">
          <Breadcrumb
            className="admin-breadcrumb"
            items={getBreadcrumbItems()}
          />

          <div className="admin-main-content">
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Admin;