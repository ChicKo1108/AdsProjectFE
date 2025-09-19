import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  InputNumber,
  Popconfirm,
  Descriptions,
  App,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { AD_PLAN_TABLE_COLUMNS } from '../../../utils/constants';
import './AdPlanManagement.css';
import {
  getAdPlanList,
  createAdPlan,
  updateAdPlan,
  deleteAdPlan,
} from '../../../apis';
import { useUser } from '../../../contexts/UserContext';
import dayjs from 'dayjs';

const { Option } = Select;

function AdPlanManagement() {
  const { message } = App.useApp();
  const { currentAccount } = useUser();

  // 检查当前用户是否只能查看统计数据（ad_operator角色）
  const isStatsReadOnly = currentAccount?.user_role === 'ad_operator';

  // ==================== 状态管理 ====================
  // 广告计划列表相关状态
  const [adPlans, setAdPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 搜索相关状态
  const [searchName, setSearchName] = useState('');

  // 添加/编辑广告计划弹窗状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form] = Form.useForm();

  // 查看详情弹窗状态
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [viewingPlan, setViewingPlan] = useState(null);

  // ==================== 数据加载 ====================
  useEffect(() => {
    loadAdPlans();
  }, [currentPage, currentAccount]);

  const loadAdPlans = async (searchKeyword = searchName) => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        pageSize,
      };

      // 如果有搜索关键词，添加到请求参数中
      if (searchKeyword && searchKeyword.trim()) {
        params.name = searchKeyword.trim();
      }

      const { ad_plans: adPlans, pagination } = await getAdPlanList(params, currentAccount?.id);
      setTotal(pagination.total);
      setAdPlans(adPlans);
    } catch (error) {
      message.error('加载广告计划列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索处理
  const handleSearch = value => {
    const keyword = value || searchName;
    setSearchName(keyword);
    setCurrentPage(1); // 搜索时重置到第一页
    // 立即执行搜索
    loadAdPlans(keyword);
  };

  const handleSearchClear = () => {
    setSearchName('');
    setCurrentPage(1);
    // 清空搜索时立即刷新数据
    loadAdPlans('');
  };

  // ==================== 广告计划操作处理 ====================
  const handleAdd = () => {
    setEditingPlan(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = record => {
    setEditingPlan(record);
    form.setFieldsValue({
      ...record,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async id => {
    try {
      setLoading(true);
      await deleteAdPlan(id);
      setAdPlans(adPlans.filter(plan => plan.id !== id));
      message.success('广告计划删除成功');
    } catch (error) {
      message.error('广告计划删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleView = record => {
    setViewingPlan(record);
    setIsDetailModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const planData = await form.validateFields();
      setLoading(true);

      if (editingPlan) {
        // 编辑广告计划
        await updateAdPlan(editingPlan.id, planData);
        setAdPlans(
          adPlans.map(plan =>
            plan.id === editingPlan.id ? { ...plan, ...planData } : plan
          )
        );
        message.success('广告计划更新成功');
      } else {
        const { ad_plan: newData } = await createAdPlan(planData);
        setAdPlans([newData, ...adPlans]);
        message.success('广告计划创建成功');
      }

      handleModalCancel();
    } catch (error) {
      if (error.errorFields) {
        console.log('表单验证失败:', error);
      } else {
        message.error(editingPlan ? '广告计划更新失败' : '广告计划创建失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingPlan(null);
    form.resetFields();
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
    setViewingPlan(null);
  };

  // ==================== 渲染配置 ====================
  const getStatusConfig = status => {
    const statusConfigs = {
      0: { color: 'orange', text: '草稿' },
      1: { color: 'green', text: '已发布' },
      2: { color: 'blue', text: '已暂停' },
      3: { color: 'red', text: '已结束' },
    };
    return statusConfigs[status] || { color: 'default', text: status };
  };

  const getTargetText = target => {
    const targetMap = {
      app: '应用推广',
      web: '网页推广',
      quick_app: '快应用推广',
      mini_app: '小程序推广',
      download: '应用下载',
    };
    return targetMap[target] || target;
  };

  const getPriceStrategyText = strategy => {
    const strategyMap = {
      stable_cost: '稳定成本',
      max_conversion: '最大转化',
      optimal_cost: '最优成本',
    };
    return strategyMap[strategy] || strategy;
  };

  // 使用constants中的列配置，并添加操作列
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 50,
    },
    ...AD_PLAN_TABLE_COLUMNS.map(col => ({
      ...col,
      render:
        col.render ||
        (text => {
          if (col.dataIndex === 'budget' || col.dataIndex === 'cost') {
            return `¥${text?.toLocaleString() || 0}`;
          }
          if (
            col.dataIndex === 'click_per_price' ||
            col.dataIndex === 'ecpm' ||
            col.dataIndex === 'download_per_count'
          ) {
            return `¥${text?.toFixed(2) || 0}`;
          }
          return text;
        }),
    })),
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个广告计划吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ==================== 组件渲染 ====================
  const renderHeader = () => (
    <div className="ad-plan-header">
      <h2>广告计划管理</h2>
      <div className="header-actions">
        <Input.Search
          placeholder="搜索 ID / 计划名称"
          allowClear
          enterButton={<SearchOutlined />}
          size="middle"
          style={{ width: 300, marginRight: 16 }}
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          onSearch={handleSearch}
          onClear={handleSearchClear}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建计划
        </Button>
      </div>
    </div>
  );

  const renderFormModal = () => (
    <Modal
      title={editingPlan ? '编辑广告计划' : '新建广告计划'}
      open={isModalVisible}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      okText="保存"
      cancelText="取消"
      confirmLoading={loading}
      width={800}
    >
      <Form form={form} layout="vertical" name="adPlanForm">
        <Form.Item
          name="name"
          label="计划名称"
          rules={[
            { required: true, message: '请输入计划名称' },
            { min: 2, message: '计划名称至少2个字符' },
            { max: 50, message: '计划名称最多50个字符' },
          ]}
        >
          <Input placeholder="请输入广告计划名称" />
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="plan_type"
            label="计划类型"
            style={{ flex: 1 }}
            rules={[{ required: true, message: '请选择计划类型' }]}
          >
            <Input placeholder="请输入计划类型" />
          </Form.Item>

          <Form.Item
            name="target"
            label="推广目标"
            style={{ flex: 1 }}
            rules={[{ required: true, message: '请选择推广目标' }]}
          >
            <Select placeholder="请选择推广目标">
              <Option value="app">应用推广</Option>
              <Option value="web">网页推广</Option>
              <Option value="quick_app">快应用推广</Option>
              <Option value="mini_app">小程序推广</Option>
              <Option value="download">应用下载</Option>
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="price_stratagy"
            label="竞价策略"
            style={{ flex: 1 }}
            rules={[{ required: true, message: '请选择竞价策略' }]}
          >
            <Select placeholder="请选择竞价策略">
              <Option value="stable_cost">稳定成本</Option>
              <Option value="max_conversion">最大转化</Option>
              <Option value="optimal_cost">最优成本</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="placement_type"
            label="投放类型"
            style={{ flex: 1 }}
            rules={[{ required: true, message: '请选择投放类型' }]}
          >
            <Select placeholder="请选择投放类型">
              <Option value="自动投放">自动投放</Option>
              <Option value="手动投放">手动投放</Option>
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="budget"
            label="预算（元）"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: '请输入预算' },
              { type: 'number', min: 100, message: '预算不能少于100元' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入预算"
              min={100}
              precision={0}
              formatter={value =>
                `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/¥\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="chuang_yi_you_xuan"
            label="智能创意优选"
            style={{ flex: 1 }}
            rules={[{ required: true, message: '请选择智能创意优选' }]}
          >
            <Select placeholder="请选择智能创意优选">
              <Option value="1">开启</Option>
              <Option value="0">关闭</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="status"
          label="计划状态"
          rules={[{ required: true, message: '请选择计划状态' }]}
        >
          <Select placeholder="请选择计划状态">
            <Option value={0}>草稿</Option>
            <Option value={1}>已发布</Option>
            <Option value={2}>已暂停</Option>
            <Option value={3}>已结束</Option>
          </Select>
        </Form.Item>

        <div style={{ marginTop: '24px', marginBottom: '16px' }}>
          <h4
            style={{ margin: '0 0 16px 0', color: '#262626', fontSize: '16px' }}
          >
            统计数据
          </h4>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="cost"
            label="花费（元）"
            style={{ flex: 1 }}
            rules={[{ type: 'number', min: 0, message: '花费不能为负数' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入花费"
              min={0}
              precision={2}
              disabled={isStatsReadOnly}
              formatter={value =>
                `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/¥\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="display_count"
            label="曝光量"
            style={{ flex: 1 }}
            rules={[{ type: 'number', min: 0, message: '曝光量不能为负数' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入曝光量"
              min={0}
              precision={0}
              disabled={isStatsReadOnly}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/(,*)/g, '')}
            />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="click_count"
            label="点击量"
            style={{ flex: 1 }}
            rules={[{ type: 'number', min: 0, message: '点击量不能为负数' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入点击量"
              min={0}
              precision={0}
              disabled={isStatsReadOnly}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="download_count"
            label="下载量"
            style={{ flex: 1 }}
            rules={[{ type: 'number', min: 0, message: '下载量不能为负数' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入下载量"
              min={0}
              precision={0}
              disabled={isStatsReadOnly}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/(,*)/g, '')}
            />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="click_per_price"
            label="点击均价（元）"
            style={{ flex: 1 }}
            rules={[{ type: 'number', min: 0, message: '点击均价不能为负数' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入点击均价"
              min={0}
              precision={2}
              disabled={isStatsReadOnly}
              formatter={value =>
                `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/¥\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="click_rate"
            label="点击率（%）"
            style={{ flex: 1 }}
            rules={[
              {
                type: 'number',
                min: 0,
                max: 100,
                message: '点击率应在0-100之间',
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入点击率"
              min={0}
              max={100}
              precision={2}
              disabled={isStatsReadOnly}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
            />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="ecpm"
            label="ECPM（元）"
            style={{ flex: 1 }}
            rules={[{ type: 'number', min: 0, message: 'ECPM不能为负数' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入ECPM"
              min={0}
              precision={2}
              disabled={isStatsReadOnly}
              formatter={value =>
                `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/¥\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="download_per_count"
            label="下载均价（元）"
            style={{ flex: 1 }}
            rules={[{ type: 'number', min: 0, message: '下载均价不能为负数' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入下载均价"
              min={0}
              precision={2}
              disabled={isStatsReadOnly}
              formatter={value =>
                `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/¥\s?|(,*)/g, '')}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="download_rate"
          label="下载率（%）"
          style={{ width: '50%' }}
          rules={[
            {
              type: 'number',
              min: 0,
              max: 100,
              message: '下载率应在0-100之间',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入下载率"
            min={0}
            max={100}
            precision={2}
            disabled={isStatsReadOnly}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderDetailModal = () => (
    <Modal
      title="广告计划详情"
      open={isDetailModalVisible}
      onCancel={handleDetailModalCancel}
      footer={[
        <Button key="close" onClick={handleDetailModalCancel}>
          关闭
        </Button>,
        <Button
          key="edit"
          type="primary"
          onClick={() => {
            handleDetailModalCancel();
            handleEdit(viewingPlan);
          }}
        >
          编辑
        </Button>,
      ]}
      width={800}
    >
      {viewingPlan && (
        <Descriptions
          bordered
          column={2}
          size="middle"
          labelStyle={{ fontWeight: 'bold', color: '#595959' }}
          contentStyle={{ color: '#262626' }}
        >
          <Descriptions.Item label="计划名称" span={2}>
            {viewingPlan.name}
          </Descriptions.Item>
          <Descriptions.Item label="计划类型">
            {viewingPlan.plan_type}
          </Descriptions.Item>
          <Descriptions.Item label="推广目标">
            {getTargetText(viewingPlan.target)}
          </Descriptions.Item>
          <Descriptions.Item label="竞价策略">
            {getPriceStrategyText(viewingPlan.price_stratagy)}
          </Descriptions.Item>
          <Descriptions.Item label="投放类型">
            {viewingPlan.placement_type}
          </Descriptions.Item>
          <Descriptions.Item label="计划状态">
            <Tag color={getStatusConfig(viewingPlan.status).color}>
              {getStatusConfig(viewingPlan.status).text}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="智能创意优选">
            {viewingPlan.chuang_yi_you_xuan ? '开' : '关'}
          </Descriptions.Item>
          <Descriptions.Item label="预算">
            ¥{viewingPlan.budget.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="花费">
            ¥{viewingPlan.cost.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="曝光量">
            {viewingPlan.display_count.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="点击量">
            {viewingPlan.click_count.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="下载量">
            {viewingPlan.download_count.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="点击率">
            {viewingPlan.click_rate}%
          </Descriptions.Item>
          <Descriptions.Item label="下载率">
            {viewingPlan.download_rate}%
          </Descriptions.Item>
          <Descriptions.Item label="计划描述" span={2}>
            {viewingPlan.description || '暂无描述'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(viewingPlan.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {dayjs(viewingPlan.updated_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );

  return (
    <div className="ad-plan-management">
      {renderHeader()}

      <Table
        columns={columns}
        dataSource={adPlans}
        rowKey="id"
        size="middle"
        loading={loading}
        pagination={{
          onChange: setCurrentPage,
          total,
          current: currentPage,
          pageSize,
        }}
        scroll={{ x: 1200 }}
      />

      {renderFormModal()}
      {renderDetailModal()}
    </div>
  );
}

export default AdPlanManagement;
