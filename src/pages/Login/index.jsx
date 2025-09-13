import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Alert, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import './Login.css';

const { Title, Text } = Typography;

function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isLoggedIn, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 获取重定向路径，默认为首页
  const from = location.state?.from?.pathname || '/';

  // 如果已经登录，重定向到目标页面
  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  // 清除错误信息当组件挂载时
  useEffect(() => {
    clearError();
  }, []); // 移除clearError依赖，避免无限循环

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    await login({
      username: values.username,
      password: values.password,
    });
    setIsSubmitting(false);

  };

  const handleFormChange = () => {
    // 清除错误信息当用户开始输入时
    if (error) {
      clearError();
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className="login">
      <div className="login-container">
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <RocketOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={2} style={{ margin: '0 0 8px 0', color: '#333' }}>
              登录
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              登录您的账户
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ textAlign: 'left' }}
            />
          )}

          <Form
            name="login"
            onFinish={handleSubmit}
            onChange={handleFormChange}
            autoComplete="off"
            size="large"
            style={{ width: '100%' }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                disabled={isLoading}
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </div>
    </div>
  );
}

export default Login;