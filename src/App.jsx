import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { App as AntdApp, Spin } from 'antd';
import { UserProvider, useUser } from './contexts/UserContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AdPlanList from './pages/AdPlanList';
import AdGroupList from './pages/AdGroupList';
import AdCreativeList from './pages/AdCreativeList';
import NotFound from './pages/404';
import './App.css';
import { ENV_VARS } from './utils/env';

// 应用布局组件
function AppLayout() {
  const location = useLocation();
  const { loading, initializeUser } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // 初始化用户状态
  useEffect(() => {
    const initialize = async () => {
      await initializeUser();
      setIsInitialized(true);
    };
    initialize();
    
  }, []); // 移除initializeUser依赖，只在组件挂载时执行一次
  
  // 如果正在初始化，显示加载状态
  if (!isInitialized || loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', color: '#666', fontSize: '16px' }}>
          加载中...
        </div>
      </div>
    );
  }
  
  return (
    <div className="App">
      {!isLoginPage && !isAdminPage && <Navigation />}
      <main style={{ padding: (isLoginPage || isAdminPage) ? '0' : '0' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/ad-plans" element={
            <ProtectedRoute>
              <AdPlanList />
            </ProtectedRoute>
          } />
          <Route path="/ad-groups" element={
            <ProtectedRoute>
              <AdGroupList />
            </ProtectedRoute>
          } />
          <Route path="/ad-creatives" element={
            <ProtectedRoute>
              <AdCreativeList />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const { message } = AntdApp.useApp();
  useEffect(() => {
    const errMsgEvent = (e) => {
      message.error(e.detail || 'Something Wrong!');
    };
    window.addEventListener('popMsg', errMsgEvent);
    return () => {
      window.removeEventListener('popMsg', errMsgEvent);
    };
  }, []);

  return (
    <UserProvider>
      <Router>
        <AppLayout />
      </Router>
    </UserProvider>
  );
}

export default App;
