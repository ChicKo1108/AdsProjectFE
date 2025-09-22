import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  App,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  getAccountList,
  updateAccountInfo,
  createAccount,
  getUserList,
  bindUserAccount,
  unbindUserAccount,
  updateUserAccountRole,
} from '../../../apis';
import useAuth from '../../../hooks/useAuth';
import { ACCOUNT_ROLE } from '../../../utils/constants';

const { Option } = Select;

function AccountManagement() {
  const { message } = App.useApp();
  const { userInfo } = useAuth();

  // 权限检查
  if (userInfo?.role !== 'super-admin') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h3>权限不足</h3>
        <p>只有超级管理员才能访问账户管理页面</p>
      </div>
    );
  }

  // ==================== 状态管理 ====================
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 账户表单相关状态
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountForm] = Form.useForm();

  // 用户管理相关状态
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [accountUsers, setAccountUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [userForm] = Form.useForm();

  // ==================== 数据加载 ====================
  useEffect(() => {
    loadAccounts();
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getUserList();
      setUsers(usersData || []);
    } catch (error) {
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const accountsData = await getAccountList();
      setAccounts(accountsData || []);
    } catch (error) {
      message.error('加载账户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // ==================== 账户操作处理 ====================
  const handleCreateAccount = () => {
    setEditingAccount(null);
    accountForm.resetFields();
    setIsAccountModalVisible(true);
  };

  const handleEditAccount = record => {
    setEditingAccount(record);
    accountForm.setFieldsValue({
      name: record.name,
      display_id: record.display_id,
      balance: record.balance,
      account_daily_budget: record.account_daily_budget,
    });
    setIsAccountModalVisible(true);
  };

  const handleAccountModalOk = async () => {
    try {
      setLoading(true);
      const values = await accountForm.validateFields();

      if (editingAccount) {
        // 编辑账户
        await updateAccountInfo(values, editingAccount.id);
        setAccounts(
          accounts.map(account =>
            account.id === editingAccount.id
              ? { ...account, ...values }
              : account
          )
        );
        message.success('账户更新成功');
      } else {
        // 创建账户
        const newAccount = await createAccount(values);
        setAccounts([newAccount, ...accounts]);
        message.success('账户创建成功');
      }

      handleAccountModalCancel();
    } catch (error) {
      if (error.errorFields) {
        console.log('表单验证失败:', error);
      } else {
        message.error(editingAccount ? '账户更新失败' : '账户创建失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccountModalCancel = () => {
    setIsAccountModalVisible(false);
    setEditingAccount(null);
    accountForm.resetFields();
  };

  // ==================== 用户管理处理 ====================
  const handleManageUsers = async record => {
    try {
      setCurrentAccount(record);
      setLoading(true);

      // 获取账户下的用户列表
      setAccountUsers(record.users || []);

      // 获取可添加的用户列表（排除已绑定的用户）
      const boundUserIds = (record.user || []).map(user => user.id);
      setAvailableUsers(users.filter(user => !boundUserIds.includes(user.id)));

      setIsUserModalVisible(true);
    } catch (error) {
      message.error('加载账户用户信息失败' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserModalCancel = () => {
    setIsUserModalVisible(false);
    setCurrentAccount(null);
    setAccountUsers([]);
    setAvailableUsers([]);
    userForm.resetFields();
  };

  const handleAddUser = async () => {
    try {
      const values = await userForm.validateFields();
      await bindUserAccount(values.userId, {
        accountId: currentAccount.id,
        role: values.role,
      });

      // 重新加载账户用户列表
      const updatedUser = users.find(user => user.id === values.userId);
      if (updatedUser) {
        setAccountUsers([
          ...accountUsers,
          {
            ...updatedUser,
            account_role: values.role,
          },
        ]);
        setAvailableUsers(
          availableUsers.filter(user => user.id !== values.userId)
        );
      }

      message.success('用户添加成功');
      userForm.resetFields();
    } catch (error) {
      if (error.errorFields) {
        console.log('表单验证失败:', error);
      } else {
        message.error('用户添加失败');
      }
    }
  };

  const handleRemoveUser = async userId => {
    try {
      await unbindUserAccount(userId, { accountId: currentAccount.id });

      // 更新本地状态
      const removedUser = accountUsers.find(user => user.id === userId);
      if (removedUser) {
        setAccountUsers(accountUsers.filter(user => user.id !== userId));
        setAvailableUsers([...availableUsers, removedUser]);
      }

      message.success('用户移除成功');
    } catch (error) {
      message.error('用户移除失败');
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      await updateUserAccountRole(userId, {
        accountId: currentAccount.id,
        role: role,
      });

      // 更新本地状态
      setAccountUsers(
        accountUsers.map(user =>
          user.id === userId ? { ...user, account_role: role } : user
        )
      );

      message.success('用户权限更新成功');
    } catch (error) {
      message.error('用户权限更新失败');
    }
  };

  // ==================== 渲染配置 ====================
  const accountColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '账户名称',
      dataIndex: 'name',
      key: 'name',
      minWidth: 150,
      ellipsis: true,
    },
    {
      title: 'display ID',
      dataIndex: 'display_id',
      key: 'display_id',
      minWidth: 120,
      ellipsis: false,
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      width: 100,
      render: balance => `¥${(balance || 0).toFixed(2)}`,
    },
    {
      title: '日预算',
      dataIndex: 'account_daily_budget',
      key: 'account_daily_budget',
      width: 100,
      render: budget => `¥${(budget || 0).toFixed(2)}`,
    },
    {
      title: '今日消耗',
      dataIndex: 'today_cost',
      key: 'today_cost',
      width: 100,
      render: cost => `¥${(cost || 0).toFixed(2)}`,
    },
    {
      title: '账号数量',
      dataIndex: 'users',
      key: 'users',
      width: 90,
      render: users => users?.length || 0,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditAccount(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<TeamOutlined />}
            onClick={() => handleManageUsers(record)}
          >
            用户管理
          </Button>
        </Space>
      ),
    },
  ];

  const renderHeader = () => (
    <div
      style={{
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h2 style={{ margin: 0 }}>账户管理</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateAccount}
      >
        新建账户
      </Button>
    </div>
  );

  const renderAccountModal = () => (
    <Modal
      title={editingAccount ? '编辑账户' : '新建账户'}
      open={isAccountModalVisible}
      onOk={handleAccountModalOk}
      onCancel={handleAccountModalCancel}
      okText="确定"
      cancelText="取消"
      confirmLoading={loading}
    >
      <Form form={accountForm} layout="vertical" name="accountForm">
        <Form.Item
          name="name"
          label="账户名称"
          rules={[
            { required: true, message: '请输入账户名称' },
            { min: 2, message: '账户名称至少2个字符' },
          ]}
        >
          <Input placeholder="请输入账户名称" />
        </Form.Item>
        <Form.Item
          name="display_id"
          label="显示ID"
          rules={[{ required: true, message: '请输入显示ID' }]}
        >
          <Input placeholder="请输入显示ID" />
        </Form.Item>
        <Form.Item
          name="balance"
          label="账户余额"
          rules={[
            { required: true, message: '请输入账户余额' },
            { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的金额' },
          ]}
        >
          <Input placeholder="请输入账户余额" addonBefore="¥" />
        </Form.Item>
        <Form.Item
          name="account_daily_budget"
          label="日预算"
          rules={[
            { required: true, message: '请输入日预算' },
            { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的金额' },
          ]}
        >
          <Input placeholder="请输入日预算" addonBefore="¥" />
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderUserModal = () => (
    <Modal
      title={`用户管理 - ${currentAccount?.name || ''}`}
      open={isUserModalVisible}
      onCancel={handleUserModalCancel}
      footer={null}
      width={800}
    >
      <div>
        <h3 style={{ margin: '16px 0' }}>添加用户</h3>
        <Form form={userForm} layout="inline" name="userForm">
          <Form.Item
            name="userId"
            rules={[{ required: true, message: '请选择用户' }]}
          >
            <Select
              placeholder="选择用户"
              style={{ width: 200 }}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {availableUsers.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.username} {user.name && `(${user.name})`}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="选择角色" style={{ width: 120 }}>
              <Option value={ACCOUNT_ROLE.SITE_ADMIN}>站点管理员</Option>
              <Option value={ACCOUNT_ROLE.AD_OPERATOR}>广告操作员</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={handleAddUser}
            >
              添加
            </Button>
          </Form.Item>
        </Form>
        <h3 style={{ margin: '16px 0' }}>账户用户列表</h3>
        {accountUsers.length > 0 ? (
          <div style={{ marginBottom: 24 }}>
            {accountUsers.map(user => (
              <div
                key={user.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderTop: '1px solid #f0f0f0',
                }}
              >
                <div>
                  <span style={{ fontWeight: 'bold' }}>{user.username}</span>
                  {user.name && (
                    <span style={{ marginLeft: 8, color: '#666' }}>
                      ({user.name})
                    </span>
                  )}
                  <Tag
                    color={
                      user.account_role === ACCOUNT_ROLE.SITE_ADMIN
                        ? 'blue'
                        : 'green'
                    }
                    style={{ marginLeft: 8 }}
                  >
                    {user.account_role === ACCOUNT_ROLE.SITE_ADMIN
                      ? '站点管理员'
                      : '广告操作员'}
                  </Tag>
                </div>
                <Space>
                  <Select
                    value={user.account_role}
                    style={{ width: 120 }}
                    onChange={role => handleUpdateUserRole(user.id, role)}
                  >
                    <Option value={ACCOUNT_ROLE.SITE_ADMIN}>站点管理员</Option>
                    <Option value={ACCOUNT_ROLE.AD_OPERATOR}>广告操作员</Option>
                  </Select>
                  <Button
                    type="link"
                    danger
                    size="small"
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    移除
                  </Button>
                </Space>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              color: '#999',
              marginBottom: 24,
              textAlign: 'center',
              padding: '20px',
            }}
          >
            暂无用户
          </div>
        )}

        <Divider />
      </div>
    </Modal>
  );

  return (
    <div>
      {renderHeader()}

      <Table
        columns={accountColumns.map(v => ({ ...v, align: 'center' }))}
        dataSource={accounts}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        loading={loading}
      />

      {renderAccountModal()}
      {renderUserModal()}
    </div>
  );
}

export default AccountManagement;
