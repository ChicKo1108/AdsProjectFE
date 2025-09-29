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
} from 'antd';
import {
  PlusOutlined,
  SettingOutlined,
  KeyOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import {
  getUserList,
  updateUser,
  createUser,
  getUserAccounts,
  bindUserAccount,
  unbindUserAccount,
  updateUserAccountRole,
  getAccountList,
} from '../../../apis';
import { ACCOUNT_ROLE } from '../../../utils/constants';

const { Option } = Select;

function UserManagement() {
  const { message } = App.useApp();

  // ==================== 状态管理 ====================
  // 用户列表相关状态
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 添加/编辑用户弹窗状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // 权限设置弹窗状态
  const [isPermissionModalVisible, setIsPermissionModalVisible] =
    useState(false);
  const [permissionUser, setPermissionUser] = useState(null);
  const [permissionForm] = Form.useForm();

  // 重置密码弹窗状态
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [resetPasswordForm] = Form.useForm();

  // 账户绑定弹窗状态
  const [isAccountBindModalVisible, setIsAccountBindModalVisible] =
    useState(false);
  const [accountBindUser, setAccountBindUser] = useState(null);
  const [userAccounts, setUserAccounts] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [accountBindForm] = Form.useForm();

  // ==================== 数据加载 ====================
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const users = await getUserList();
      setUsers(users);
    } catch (error) {
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // ==================== 用户操作处理 ====================
  const handleToggleUserStatus = async record => {
    try {
      await updateUser(record.id, { ban: !record.ban });
      setUsers(
        users.map(user =>
          user.id === record.id ? { ...user, ban: !record.ban } : user
        )
      );
      message.success('用户状态更新成功');
    } catch (error) {
      message.error('用户状态更新失败');
    }
  };

  // ==================== 权限设置处理 ====================
  const handlePermissionSetting = record => {
    setPermissionUser(record);
    permissionForm.setFieldsValue({ role: record.role });
    setIsPermissionModalVisible(true);
  };

  const handlePermissionOk = async () => {
    try {
      const values = await permissionForm.validateFields();
      await updateUser(permissionUser.id, { role: values.role });
      setUsers(
        users.map(user =>
          user.id === permissionUser.id ? { ...user, role: values.role } : user
        )
      );
      message.success('权限设置成功');
      handlePermissionCancel();
    } catch (error) {
      if (error.errorFields) {
        console.log('表单验证失败:', error);
      } else {
        message.error('权限设置失败');
      }
    }
  };

  const handlePermissionCancel = () => {
    setIsPermissionModalVisible(false);
    setPermissionUser(null);
    permissionForm.resetFields();
  };

  // ==================== 重置密码处理 ====================
  const handleResetPassword = record => {
    setResetPasswordUser(record);
    resetPasswordForm.resetFields();
    setIsResetPasswordModalVisible(true);
  };

  const handleResetPasswordOk = async () => {
    try {
      const values = await resetPasswordForm.validateFields();
      await updateUser(resetPasswordUser.id, {
        password: values.newPassword,
        resetPassword: true,
      });
      message.success(
        `用户 "${resetPasswordUser.username}" 密码重置成功，新密码为：${values.newPassword}`
      );
      handleResetPasswordCancel();
    } catch (error) {
      if (error.errorFields) {
        console.log('表单验证失败:', error);
      } else {
        message.error('密码重置失败，请稍后重试');
      }
    }
  };

  const handleResetPasswordCancel = () => {
    setIsResetPasswordModalVisible(false);
    setResetPasswordUser(null);
    resetPasswordForm.resetFields();
  };

  // ==================== 账户绑定处理 ====================
  const handleAccountBind = async record => {
    try {
      setAccountBindUser(record);

      // 加载所有账户列表
      const accounts = await getAccountList();
      setAllAccounts(accounts || []);

      // 加载用户已绑定的账户
      const { accounts: userAccountsData } = await getUserAccounts(record.id);
      setUserAccounts(userAccountsData || []);

      setIsAccountBindModalVisible(true);
    } catch (error) {
      message.error('加载账户信息失败');
    }
  };

  const handleAccountBindCancel = () => {
    setIsAccountBindModalVisible(false);
    setAccountBindUser(null);
    setUserAccounts([]);
    setAllAccounts([]);
    accountBindForm.resetFields();
  };

  const handleBindAccount = async (accountId, role) => {
    try {
      await bindUserAccount(accountBindUser.id, { accountId, role });

      // 重新加载用户已绑定的账户
      const { accounts: userAccountsData } = await getUserAccounts(
        accountBindUser.id
      );
      setUserAccounts(userAccountsData || []);

      message.success('账户绑定成功');
    } catch (error) {
      message.error('账户绑定失败');
    }
  };

  const handleUnbindAccount = async accountId => {
    try {
      await unbindUserAccount(accountBindUser.id, { accountId });

      // 重新加载用户已绑定的账户
      const { accounts: userAccountsData } = await getUserAccounts(
        accountBindUser.id
      );
      setUserAccounts(userAccountsData || []);

      message.success('账户解绑成功');
    } catch (error) {
      message.error('账户解绑失败');
    }
  };

  const handleUpdateAccountRole = async (accountId, role) => {
    try {
      await updateUserAccountRole(accountBindUser.id, { accountId, role });

      // 重新加载用户已绑定的账户
      const { accounts: userAccountsData } = await getUserAccounts(
        accountBindUser.id
      );
      setUserAccounts(userAccountsData || []);

      message.success('权限更新成功');
    } catch (error) {
      message.error('权限更新失败');
    }
  };

  // ==================== 添加/编辑用户处理 ====================
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingUser) {
        // 编辑用户
        await updateUser(editingUser.id, values);
        setUsers(
          users.map(user =>
            user.id === editingUser.id ? { ...user, ...values } : user
          )
        );
        message.success('用户更新成功');
      } else {
        // 添加用户
        const { user: newUser } = await createUser(values);
        setUsers([newUser, ...users]);
        message.success('用户创建成功');
      }

      handleModalCancel();
    } catch (error) {
      if (error.errorFields) {
        console.log('表单验证失败:', error);
      } else {
        message.error(editingUser ? '用户更新失败' : '用户创建失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  // ==================== 渲染配置 ====================
  const getRoleConfig = role => {
    const roleConfigs = {
      'super-admin': { color: 'purple', text: '超级管理员' },
      user: { color: 'blue', text: '普通用户' },
    };
    return roleConfigs[role] || { color: 'default', text: role };
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      minWidth: 100,
      ellipsis: false,
    },
    {
      title: '昵称',
      dataIndex: 'name',
      key: 'name',
      minWidth: 100,
      ellipsis: true,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: role => {
        const config = getRoleConfig(role);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'ban',
      key: 'ban',
      width: 100,
      render: ban => (
        <Tag color={ban ? 'red' : 'green'}>{ban ? '禁用' : '正常'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 350,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => handleToggleUserStatus(record)}
          >
            {record.ban ? '激活' : '禁用'}
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handlePermissionSetting(record)}
          >
            权限设置
          </Button>
          <Button
            type="link"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => handleResetPassword(record)}
          >
            重置密码
          </Button>
          <Button
            type="link"
            size="small"
            icon={<LinkOutlined />}
            onClick={() => handleAccountBind(record)}
          >
            账户绑定
          </Button>
        </Space>
      ),
    },
  ];

  // ==================== 组件渲染 ====================
  const renderHeader = () => (
    <div
      style={{
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h2 style={{ margin: 0 }}>用户管理</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        添加用户
      </Button>
    </div>
  );

  const renderUserModal = () => (
    <Modal
      title={editingUser ? '编辑用户' : '添加用户'}
      open={isModalVisible}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" name="userForm">
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 2, message: '用户名至少2个字符' },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name="name" label="昵称">
          <Input placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item
          name="role"
          label="角色"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select placeholder="请选择角色">
            <Option value="super-admin">超级管理员</Option>
            <Option value="user">普通用户</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderAccountBindModal = () => (
    <Modal
      title={`账户绑定 - ${accountBindUser?.username || ''}`}
      open={isAccountBindModalVisible}
      onCancel={handleAccountBindCancel}
      footer={null}
      width={800}
    >
      <div style={{ marginBottom: 16 }}>
        <h4>已绑定账户</h4>
        {userAccounts.length > 0 ? (
          <div style={{ marginBottom: 16 }}>
            {userAccounts.map(account => (
              <div
                key={account.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  marginBottom: '8px',
                }}
              >
                <div>
                  <span style={{ fontWeight: 'bold' }}>{account.name}</span>
                  <span style={{ marginLeft: 8, color: '#666' }}>
                    ({account.display_id})
                  </span>
                  <Tag
                    color={
                      account.user_role === ACCOUNT_ROLE.SITE_ADMIN
                        ? 'blue'
                        : 'green'
                    }
                    style={{ marginLeft: 8 }}
                  >
                    {account.user_role === ACCOUNT_ROLE.SITE_ADMIN
                      ? '站点管理员'
                      : '广告操作员'}
                  </Tag>
                </div>
                <Space>
                  <Select
                    value={account.user_role}
                    style={{ width: 120 }}
                    onChange={role => handleUpdateAccountRole(account.id, role)}
                  >
                    <Option value={ACCOUNT_ROLE.SITE_ADMIN}>
                      站点管理员
                    </Option>
                    <Option value={ACCOUNT_ROLE.AD_OPERATOR}>
                      广告操作员
                    </Option>
                  </Select>
                  <Button
                    type="link"
                    danger
                    onClick={() => handleUnbindAccount(account.id)}
                  >
                    解绑
                  </Button>
                </Space>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#999', marginBottom: 16 }}>暂无绑定账户</div>
        )}
      </div>

      <div>
        <h4>绑定新账户</h4>
        <Form
          form={accountBindForm}
          layout="inline"
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name="accountId"
            rules={[{ required: true, message: '请选择账户' }]}
          >
            <Select
              placeholder="选择要绑定的账户"
              style={{ width: 200 }}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {allAccounts
                .filter(account => {
                  return !userAccounts?.some(ua => ua.id === account.id);
                })
                .map(account => (
                  <Option key={account.id} value={account.id}>
                    {account.name} ({account.display_id})
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            rules={[{ required: true, message: '请选择权限' }]}
          >
            <Select placeholder="选择权限" style={{ width: 120 }}>
              <Option value={ACCOUNT_ROLE.SITE_ADMIN}>站点管理员</Option>
              <Option value={ACCOUNT_ROLE.AD_OPERATOR}>广告操作员</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={async () => {
                try {
                  const values = await accountBindForm.validateFields();
                  await handleBindAccount(values.accountId, values.role);
                  accountBindForm.resetFields();
                } catch (error) {
                  console.log('表单验证失败:', error);
                }
              }}
            >
              绑定
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );

  const renderPermissionModal = () => (
    <Modal
      title="权限设置"
      open={isPermissionModalVisible}
      onOk={handlePermissionOk}
      onCancel={handlePermissionCancel}
      okText="确定"
      cancelText="取消"
    >
      <Form form={permissionForm} layout="vertical" name="permissionForm">
        <Form.Item
          name="role"
          label="用户权限"
          rules={[{ required: true, message: '请选择用户权限' }]}
        >
          <Select placeholder="请选择用户权限">
            <Select.Option value="user">普通用户</Select.Option>
            <Select.Option value="super-admin">超级管理员</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderResetPasswordModal = () => (
    <Modal
      title="重置用户密码"
      open={isResetPasswordModalVisible}
      onOk={handleResetPasswordOk}
      onCancel={handleResetPasswordCancel}
      okText="确定"
      cancelText="取消"
    >
      {resetPasswordUser && (
        <div style={{ marginBottom: 16 }}>
          <span>
            用户：<strong>{resetPasswordUser.username}</strong>
          </span>
        </div>
      )}
      <Form form={resetPasswordForm} layout="vertical" name="resetPasswordForm">
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码至少6位字符' },
            { max: 20, message: '密码最多20位字符' },
          ]}
        >
          <Input.Password placeholder="请输入新密码（6-20位字符）" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div>
      {renderHeader()}

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        loading={loading}
      />

      {renderUserModal()}
      {renderPermissionModal()}
      {renderResetPasswordModal()}
      {renderAccountBindModal()}
    </div>
  );
}

export default UserManagement;
