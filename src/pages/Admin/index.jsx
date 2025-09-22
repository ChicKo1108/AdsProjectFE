import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Button, Select, Space } from 'antd';
import { UserOutlined, DashboardOutlined, AuditOutlined, ForkOutlined, FireOutlined, HomeOutlined, SwapOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../contexts/UserContext';
import UserManagement from './UserManagement';
import AccountManagement from './AccountManagement';
import Dashboard from './Dashboard';
import AdPlanManagement from './AdPlanManagement';
import AdCreativeManagement from './AdCreativeManagement';
import AdGroupManagement from './AdGroupManagement';
import './Admin.css';

const { Sider, Content } = Layout;
const { Option } = Select;

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuth();
  const { accounts, currentAccount, switchAccount, accountsLoading } = useUser();
  
  // 根据当前路径确定选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/accounts')) return 'accounts';
    if (path.includes('/admin/dashboard')) return 'dashboard';
    if (path.includes('/admin/ad-plans')) return 'adPlans';
    if (path.includes('/admin/ad-groups')) return 'adGroup';
    if (path.includes('/admin/ad-creatives')) return 'adCreative';
    return 'dashboard';
  };
  
  const selectedKey = getSelectedKey();


  // 根据用户权限过滤菜单项
  const getMenuItems = () => {
    const baseItems = [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: '账户数据'
      },
      {
        key: 'adPlans',
        icon: <AuditOutlined />,
        label: '广告计划'
      },
      {
        key: 'adGroup',
        icon: <ForkOutlined />,
        label: '广告组'
      },
      {
        key: 'adCreative',
        icon: <FireOutlined />,
        label: '广告创意'
      }
    ];
    
    // 只有超级管理员可以看到用户管理和账户管理
    if (userInfo?.role === 'super-admin') {
      baseItems.unshift({
        key: 'accounts',
        icon: <TeamOutlined />,
        label: '账户管理'
      });
      baseItems.unshift({
        key: 'users',
        icon: <UserOutlined />,
        label: '用户管理'
      });
    }
    
    return baseItems;
  };
  
  const menuItems = getMenuItems();

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'users':
        navigate('/admin/users');
        break;
      case 'accounts':
        navigate('/admin/accounts');
        break;
      case 'dashboard':
        navigate('/admin/dashboard');
        break;
      case 'adPlans':
        navigate('/admin/ad-plans');
        break;
      case 'adGroup':
        navigate('/admin/ad-groups');
        break;
      case 'adCreative':
        navigate('/admin/ad-creatives');
        break;
      default:
        navigate('/admin/dashboard');
    }
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  // 超级管理员权限检查组件
  const SuperAdminRoute = ({ children }) => {
    if (userInfo?.role !== 'super-admin') {
      return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h3>权限不足</h3>
          <p>只有超级管理员才能访问此页面</p>
        </div>
      );
    }
    return children;
  };
  
  // 占位组件
  const PlaceholderComponent = ({ title }) => (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h3>{title}</h3>
      <p>功能开发中...</p>
    </div>
  );

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
      case 'accounts':
        items.push({ title: '账户管理' });
        break;
      case 'dashboard':
        items.push({ title: '账户数据' });
        break;
      case 'adPlans':
        items.push({ title: '广告计划' });
        break;
      case 'adGroup':
        items.push({ title: '广告组' });
        break;
      case 'adCreative':
        items.push({ title: '广告创意' });
        break;
      default:
        items.push({ title: '账户数据' });
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
          style={{ borderRight: 0, flex: 1 }}
        />
        
        <div className="admin-sider-footer">
          <Button
            type="text"
            icon={<HomeOutlined />}
            onClick={handleBackToMain}
            className="back-to-home-btn"
            block
          >
            返回首页
          </Button>
        </div>
      </Sider>

      <Layout>
        <Content className="admin-content">
          <div className="admin-header">
            <Breadcrumb
              className="admin-breadcrumb"
              items={getBreadcrumbItems()}
            />
            
            {/* 账户切换组件 */}
            <div className="admin-account-switcher">
              <div>
                {/* <SwapOutlined />
                <span style={{ margin: '0 8px' }}>当前账户:</span> */}
                <Select
                  value={currentAccount?.id}
                  onChange={switchAccount}
                  loading={accountsLoading}
                  style={{ minWidth: 200 }}
                  placeholder="选择账户"
                >
                  {accounts.map(account => (
                    <Option key={account.id} value={account.id}>
                      <>
                        <span>{account.name}</span>
                        <span style={{marginLeft:8, color: '#666', fontSize: '12px' }}>
                          ({account.display_id})
                        </span>
                      </>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div className="admin-main-content">
            <Routes>
              <Route path="users" element={
                <SuperAdminRoute>
                  <UserManagement />
                </SuperAdminRoute>
              } />
              <Route path="accounts" element={
                <SuperAdminRoute>
                  <AccountManagement />
                </SuperAdminRoute>
              } />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="ad-plans" element={<AdPlanManagement />} />
              <Route path="ad-groups" element={<AdGroupManagement />} />
              <Route path="ad-creatives" element={<AdCreativeManagement />} />
              <Route path="" element={<AdPlanManagement />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Admin;