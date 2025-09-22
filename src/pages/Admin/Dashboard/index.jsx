import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Statistic,
  Row,
  Col,
  Modal,
  InputNumber,
  Space,
  Divider,
  App,
} from 'antd';
import {
  DollarOutlined,
  // TrendingUpOutlined,
  CalendarOutlined,
  EditOutlined,
  ContactsOutlined,
} from '@ant-design/icons';
import './Dashboard.css';
import { getAccountInfo, updateAccountInfo } from '../../../apis';
import { useUser } from '../../../contexts/UserContext';
import useAuth from '../../../hooks/useAuth';

function Dashboard() {
  const { message } = App.useApp();
  const { currentAccount } = useUser();
  const { isAccountAdmin } = useAuth();

  // ==================== 状态管理 ====================
  const [accountData, setAccountData] = useState({
    balance: 0,
    today_cost: 0,
    account_daily_budget: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  // ==================== 数据加载 ====================
  useEffect(() => {
    loadAccountData();
  }, [currentAccount?.id]);

  const loadAccountData = async () => {
    try {
      setLoading(true);

      const data = await getAccountInfo(currentAccount?.id);
      setAccountData(data);
    } catch (error) {
      message.error('加载账户数据失败');
    } finally {
      setLoading(false);
    }
  };

  // ==================== 编辑处理 ====================
  const handleEdit = () => {
    form.setFieldsValue(accountData);
    setIsEditModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await updateAccountInfo(values, currentAccount?.id);

      setAccountData(values);
      message.success('账户数据更新成功');
      setIsEditModalVisible(false);
    } catch (error) {
      if (error.errorFields) {
        console.log('表单验证失败:', error);
      } else {
        message.error('账户数据更新失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  // ==================== 渲染函数 ====================
  const renderStatisticCard = (title, value, prefix, suffix, icon, color) => (
    <Card className="statistic-card" hoverable>
      <Statistic
        title={title}
        value={value}
        precision={2}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ color }}
      />
      <div className="statistic-icon" style={{ color }}>
        {icon}
      </div>
    </Card>
  );

  const renderEditModal = () => (
    <Modal
      title="编辑账户数据"
      open={isEditModalVisible}
      onOk={handleSave}
      onCancel={handleCancel}
      okText="保存"
      cancelText="取消"
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical" name="accountForm">
        <Form.Item
          name="balance"
          label="账户余额（元）"
          rules={[
            { required: true, message: '请输入账户余额' },
            { type: 'number', min: 0, message: '账户余额不能为负数' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入账户余额"
            precision={2}
            min={0}
            formatter={value =>
              `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={value => value.replace(/￥\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="today_cost"
          label="今日广告消耗（元）"
          rules={[
            { required: true, message: '请输入今日广告消耗' },
            { type: 'number', min: 0, message: '消耗金额不能为负数' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入今日广告消耗"
            precision={2}
            min={0}
            formatter={value =>
              `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={value => value.replace(/￥\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="account_daily_budget"
          label="账户日预算（元）"
          rules={[
            { required: true, message: '请输入账户日预算' },
            { type: 'number', min: 0, message: '预算金额不能为负数' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入账户日预算"
            precision={2}
            min={0}
            formatter={value =>
              `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={value => value.replace(/￥\s?|(,*)/g, '')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>账户数据</h2>
        {isAccountAdmin() && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
            loading={loading}
          >
            编辑数据
          </Button>
        )}
      </div>

      <Row gutter={[32, 32]} justify="center" style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          {renderStatisticCard(
            '账户余额',
            accountData.balance,
            '￥',
            '',
            <DollarOutlined />,
            '#1890ff'
          )}
        </Col>

        <Col xs={24} sm={12} lg={8}>
          {renderStatisticCard(
            '今日广告消耗',
            accountData.today_cost,
            '￥',
            '',
            <ContactsOutlined />,
            '#f5222d'
          )}
        </Col>

        <Col xs={24} sm={12} lg={8}>
          {renderStatisticCard(
            '账户日预算',
            accountData.account_daily_budget,
            '￥',
            '',
            <CalendarOutlined />,
            '#52c41a'
          )}
        </Col>
      </Row>

      {renderEditModal()}
    </div>
  );
}

export default Dashboard;
