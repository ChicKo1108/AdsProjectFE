import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
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
import { AD_CREATIVES_TABLE_COLUMNS } from '../../../utils/constants';
import './AdCreativeManagement.css';
import {
  createAdCreative,
  deleteAdCreative,
  getAdCreativeList,
  updateAdCreative,
} from '../../../apis';
import { useUser } from '../../../contexts/UserContext';
import dayjs from 'dayjs';
import useAuth from '../../../hooks/useAuth';

const { Option } = Select;

function AdCreativeManagement() {
  const { message } = App.useApp();
  const { currentAccount } = useUser();
  const { isAccountAdmin } = useAuth();

  // 检查当前用户是否只能查看统计数据（ad_operator角色）
  const isStatsReadOnly = currentAccount?.user_role === 'ad_operator';

  // ==================== 状态管理 ====================
  // 广告创意列表相关状态
  const [adCreatives, setAdCreatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });

  // 添加/编辑广告创意弹窗状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCreative, setEditingCreative] = useState(null);
  const [form] = Form.useForm();

  // 查看详情弹窗状态
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [viewingCreative, setViewingCreative] = useState(null);

  // 搜索相关状态
  const [searchName, setSearchName] = useState('');

  // ==================== 数据加载 ====================
  useEffect(() => {
    loadAdCreatives();
  }, [pagination.current, currentAccount]);

  const loadAdCreatives = async (searchKeyword = searchName) => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
      };

      if (searchKeyword && searchKeyword.trim()) {
        params.name = searchKeyword.trim();
      }

      const { ad_creatives: adCreatives, pagination: paginationData } =
        await getAdCreativeList(params, currentAccount?.id);
      setPagination({
        ...paginationData,
        current: paginationData.current,
        pageSize: paginationData.pageSize,
      });
      setAdCreatives(adCreatives);
    } catch (error) {
      message.error('加载广告创意列表失败' + error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索处理
  const handleSearch = value => {
    const keyword = value || searchName;
    setSearchName(keyword);
    setPagination(prev => ({ ...prev, current: 1 })); // 搜索时重置到第一页
    // 立即执行搜索
    loadAdCreatives(1, pagination.pageSize, keyword);
  };

  const handleSearchClear = () => {
    setSearchName('');
    setPagination(prev => ({ ...prev, current: 1 }));
    // 清空搜索时立即刷新数据
    loadAdCreatives(1, pagination.pageSize, '');
  };

  const handleTableChange = paginationConfig => {
    loadAdCreatives(paginationConfig.current, paginationConfig.pageSize);
  };

  // ==================== 广告创意操作处理 ====================
  const handleAdd = () => {
    setEditingCreative(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = record => {
    setEditingCreative(record);
    form.setFieldsValue({
      ...record,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async id => {
    try {
      setLoading(true);
      await deleteAdCreative(id, currentAccount?.id);

      setAdCreatives(adCreatives.filter(creative => creative.id !== id));
      message.success('广告创意删除成功');
    } catch (error) {
      message.error('广告创意删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleView = record => {
    setViewingCreative(record);
    setIsDetailModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingCreative) {
        const { ad_creative: newData } = await updateAdCreative(
          editingCreative.id,
          values,
          currentAccount?.id
        );
        setAdCreatives(
          adCreatives.map(creative =>
            creative.id === editingCreative.id ? newData : creative
          )
        );
        message.success('广告创意更新成功');
      } else {
        const { ad_creative: res } = await createAdCreative(
          values,
          currentAccount?.id
        );
        setAdCreatives([res, ...adCreatives]);
        message.success('广告创意创建成功');
      }

      handleModalCancel();
    } catch (error) {
      if (error.errorFields) {
        console.log('表单验证失败:', error);
      } else {
        message.error(
          editingCreative ? '广告创意更新失败' : '广告创意创建失败'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingCreative(null);
    form.resetFields();
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
    setViewingCreative(null);
  };

  // ==================== 渲染配置 ====================
  // 使用constants中的列配置，并添加操作列
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      fixed: 'left',
    },
    ...AD_CREATIVES_TABLE_COLUMNS.map(col => ({
      ...col,
      render:
        col.render ||
        (text => {
          if (
            col.dataIndex === 'budget' ||
            col.dataIndex === 'download_cost' ||
            col.dataIndex === 'click_cost' ||
            col.dataIndex === 'costs' ||
            col.dataIndex === 'ecpm'
          ) {
            return `¥${text?.toLocaleString() || 0}`;
          }
          return text;
        }),
    })),
    {
      title: '操作',
      key: 'action',
      width: isAccountAdmin() ? 200 : 150,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
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
          {isAccountAdmin() && (
            <Popconfirm
              title="确定要删除这个广告创意吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  // ==================== 组件渲染 ====================
  const renderHeader = () => (
    <div className="ad-creative-header">
      <h2>广告创意管理</h2>
      <div className="header-actions">
        <Input.Search
          placeholder="搜索 ID/ 创意名称 / DisplayID"
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
          新建创意
        </Button>
      </div>
    </div>
  );

  const renderFormModal = () => (
    <Modal
      title={editingCreative ? '编辑广告创意' : '新建广告创意'}
      open={isModalVisible}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      okText="保存"
      cancelText="取消"
      confirmLoading={loading}
      width={800}
    >
      <Form form={form} layout="vertical" name="adCreativeForm">
        <Form.Item
          name="name"
          label="广告创意名称"
          rules={[
            { required: true, message: '请输入广告创意名称' },
            { min: 2, message: '创意名称至少2个字符' },
          ]}
        >
          <Input placeholder="请输入广告创意名称" />
        </Form.Item>

        <Form.Item
          name="display_id"
          label="Display ID"
          rules={[{ required: true, message: '请输入Display ID' }]}
        >
          <Input placeholder="请输入Display ID（如：CR001）" />
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="status"
            label="开关状态"
            style={{ flex: 1 }}
            initialValue={0}
            rules={[{ required: true, message: '请选择开关状态' }]}
          >
            <Select placeholder="请选择开关状态">
              <Option value={1}>开启</Option>
              <Option value={0}>关闭</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="budget"
            label="计划日预算（元）"
            style={{ flex: 1 }}
            rules={[{ required: true, message: '请输入计划日预算' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入计划日预算"
              min={0}
              precision={0}
              formatter={value =>
                `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/¥\s?|(,*)/g, '')}
            />
          </Form.Item>
        </div>

        {isAccountAdmin() && (
          <div>
            <div style={{ marginTop: '24px', marginBottom: '16px' }}>
              <h4
                style={{
                  margin: '0 0 16px 0',
                  color: '#262626',
                  fontSize: '16px',
                }}
              >
                统计数据
              </h4>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                name="download_cost"
                label="下载成本（元）"
                style={{ flex: 1 }}
                rules={[
                  { type: 'number', min: 0, message: '下载成本不能为负数' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入下载成本"
                  min={0}
                  precision={2}
                  formatter={value =>
                    `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={value => value.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item
                name="click_cost"
                label="点击成本（元）"
                style={{ flex: 1 }}
                rules={[
                  { type: 'number', min: 0, message: '点击成本不能为负数' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入点击成本"
                  min={0}
                  precision={2}
                  formatter={value =>
                    `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={value => value.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                name="costs"
                label="消耗金额（元）"
                style={{ flex: 1 }}
                rules={[
                  { type: 'number', min: 0, message: '消耗金额不能为负数' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入消耗金额"
                  min={0}
                  disabled={isStatsReadOnly}
                  precision={2}
                  formatter={value =>
                    `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={value => value.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item name="ecpm" label="ECPM" style={{ flex: 1 }}>
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
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                name="display_count"
                label="曝光量"
                style={{ flex: 1 }}
                rules={[
                  { type: 'number', min: 0, message: '曝光量不能为负数' },
                ]}
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

              <Form.Item
                name="click_count"
                label="点击量"
                style={{ flex: 1 }}
                rules={[
                  { type: 'number', min: 0, message: '点击量不能为负数' },
                ]}
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
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Form.Item
                name="download_count"
                label="下载量"
                style={{ flex: 1 }}
                rules={[
                  { type: 'number', min: 0, message: '下载量不能为负数' },
                ]}
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

              <Form.Item
                name="download_rate"
                label="下载率（%）"
                style={{ flex: 1 }}
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
            </div>

            <Form.Item
              name="click_rate"
              label="点击率（%）"
              style={{ width: '50%' }}
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
        )}
      </Form>
    </Modal>
  );

  const renderDetailModal = () => (
    <Modal
      title="广告创意详情"
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
            handleEdit(viewingCreative);
          }}
        >
          编辑
        </Button>,
      ]}
      width={800}
    >
      {viewingCreative && (
        <Descriptions
          bordered
          column={2}
          size="middle"
          labelStyle={{ fontWeight: 'bold', color: '#595959' }}
          contentStyle={{ color: '#262626' }}
        >
          <Descriptions.Item label="创意名称" span={2}>
            {`${viewingCreative.name} (ID:${viewingCreative.id})`}
          </Descriptions.Item>
          <Descriptions.Item label="Display ID">
            {viewingCreative.display_id}
          </Descriptions.Item>
          <Descriptions.Item label="开关状态">
            <span
              style={{
                padding: '2px 8px',
                backgroundColor: viewingCreative.status ? '#52c41a' : '#f5222d',
                color: 'white',
                borderRadius: '12px',
                fontSize: '11px',
              }}
            >
              {viewingCreative.status ? '开启' : '关闭'}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="计划日预算">
            ¥{viewingCreative?.budget?.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="下载成本">
            ¥{viewingCreative?.download_cost?.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="点击成本">
            ¥{viewingCreative?.click_cost?.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="消耗金额">
            ¥{viewingCreative?.costs?.toLocaleString() || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="ECPM">
            ¥{viewingCreative?.ecpm?.toFixed(2) || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="曝光量">
            {viewingCreative?.display_count?.toLocaleString() || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="点击量">
            {viewingCreative?.click_count?.toLocaleString() || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="下载量">
            {viewingCreative?.download_count?.toLocaleString() || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="点击率">
            {viewingCreative?.click_rate?.toFixed(2) || '-'}%
          </Descriptions.Item>
          <Descriptions.Item label="下载率">
            {viewingCreative?.download_rate?.toFixed(2) || '-'}%
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(viewingCreative.created_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {dayjs(viewingCreative.updated_at).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );

  return (
    <div className="ad-creative-management">
      {renderHeader()}

      <Table
        columns={columns}
        dataSource={adCreatives}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showTotal: total => `共 ${total} 条记录`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />

      {renderFormModal()}
      {renderDetailModal()}
    </div>
  );
}

export default AdCreativeManagement;
