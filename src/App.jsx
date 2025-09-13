import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
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

// 应用布局组件
function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname === '/admin';
  
  return (
    <div className="App">
      {!isLoginPage && !isAdminPage && <Navigation />}
      <main style={{ padding: (isLoginPage || isAdminPage) ? '0' : '0' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
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
  return (
    <UserProvider>
      <Router>
        <AppLayout />
      </Router>
    </UserProvider>
  );
}

export default App;
