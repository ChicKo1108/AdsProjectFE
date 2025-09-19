import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Tag,
  Popconfirm,
  Descriptions,
  List,
  Card,
  Badge,
  App,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FolderOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import './AdGroupManagement.css';
import {
  bindAdGroupToPlan,
  createAdGroup,
  deleteAdGroup,
  getAdGroups,
  getAdPlanList,
  unbindAdGroupFromPlan,
  updateAdGroup,
} from '../../../apis';
import dayjs from 'dayjs';
import { useUser } from '../../../contexts/UserContext';

function AdGroupManagement() {
  const { message } = App.useApp();
  const { currentAccount } = useUser();

  // ==================== 状态管理 ====================
  // 广告组列表相关状态
  const [adGroups, setAdGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // 添加/编辑广告组弹窗状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [form] = Form.useForm();

  // 查看详情弹窗状态
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [viewingGroup, setViewingGroup] = useState(null);

  // 广告计划详情弹窗状态
  const [isPlanDetailModalVisible, setIsPlanDetailModalVisible] =
    useState(false);
  const [viewingPlan, setViewingPlan] = useState(null);

  // 添加广告计划弹窗状态
  const [isAddPlanModalVisible, setIsAddPlanModalVisible] = useState(false);
  const [availablePlans, setAvailablePlans] = useState([]);

  // ==================== 数据加载 ====================
  useEffect(() => {
    loadAdGroups();
  }, [currentAccount]);

  const loadAdGroups = async () => {
    try {
      setLoading(true);
      const { ad_groups: adGroups } = await getAdGroups(currentAccount?.id);
      setAdGroups(adGroups);
    } catch (error) {
      message.error('加载广告组列表失败');
    } finally {
      setLoading(false);
    }
  };


  // ==================== 广告组操作处理 ====================
  const handleAdd = () => {
    setEditingGroup(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = record => {
    setEditingGroup(record);
    form.setFieldsValue({
      name: record.name,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async record => {
    // 检查是否有关联的广告计划
    if (record.ad_plans && record.ad_plans.length > 0) {
      message.error(
        `无法删除广告组，请先删除组内的 ${record.ad_plans.length} 个广告计划`
      );
      return;
    }

    try {
      setLoading(true);
      await deleteAdGroup(record.id, currentAccount?.id);

      setAdGroups(adGroups.filter(group => group.id !== record.id));
      message.success('广告组删除成功');
    } catch (error) {
      message.error('广告组删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleView = record => {
    setViewingGroup(record);
    setIsDetailModalVisible(true);
  };

  const handleViewPlan = plan => {
    setViewingPlan(plan);
    setIsPlanDetailModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingGroup) {
        await updateAdGroup(
          editingGroup.id,
          values.name,
          currentAccount?.id
        );
        
        // 编辑广告组
        setAdGroups(
          adGroups.map(group =>
            group.id === editingGroup.id ? { ...group, name: values.name } : group
          )
        );
        message.success('广告组更新成功');
      } else {
        // 添加广告组
        const { ad_group: newGroup } = await createAdGroup(values.name, currentAccount?.id);

        setAdGroups([newGroup, ...adGroups]);
        message.success('广告组创建成功');
      }

      handleModalCancel();
    } catch (error) {
      if (error.errorFields) {
        console.log('表单验证失败:', error);
      } else {
        message.error(
          (editingGroup ? '广告组更新失败' : '广告组创建失败') + error
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingGroup(null);
    form.resetFields();
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
    setViewingGroup(null);
  };

  const handlePlanDetailModalCancel = () => {
    setIsPlanDetailModalVisible(false);
    setViewingPlan(null);
  };

  // 添加广告计划相关处理
  const handleAddPlan = async () => {
    const { ad_plans: adPlans } = await getAdPlanList({
      page: 1,
      pageSize: 999999,
    }, currentAccount?.id);

    setAvailablePlans(adPlans);
    setIsAddPlanModalVisible(true);
  };

  const handleAddPlanConfirm = async selectedPlanIds => {
    if (selectedPlanIds.length === 0) {
      message.warning('请选择要添加的广告计划');
      return;
    }

    await bindAdGroupToPlan(viewingGroup.id, selectedPlanIds, currentAccount?.id);

    const selectedPlans = availablePlans.filter(plan =>
      selectedPlanIds.includes(plan.id)
    );

    // 获取当前广告组中已有的计划ID
    const existingPlanIds = (viewingGroup.ad_plans || []).map(plan => plan.id);

    // 过滤掉已存在的计划，避免重复添加
    const newPlans = selectedPlans.filter(
      plan => !existingPlanIds.includes(plan.id)
    );

    if (newPlans.length === 0) {
      message.warning('选择的广告计划已存在于当前广告组中');
      return;
    }

    const updatedGroup = {
      ...viewingGroup,
      ad_plans: [
        ...(viewingGroup.ad_plans || []),
        ...newPlans.map(plan => ({
          ...plan,
          budget: 5000,
          cost: 0,
          createdAt: new Date().toLocaleString(),
        })),
      ],
    };

    // 更新广告组列表
    setAdGroups(
      adGroups.map(group =>
        group.id === viewingGroup.id ? updatedGroup : group
      )
    );

    setViewingGroup(updatedGroup);
    setIsAddPlanModalVisible(false);
    message.success(`成功添加 ${selectedPlanIds.length} 个广告计划`);
  };

  const handleAddPlanCancel = () => {
    setIsAddPlanModalVisible(false);
    setAvailablePlans([]);
  };

  // 移除广告计划
  const handleRemovePlan = async planId => {
    await unbindAdGroupFromPlan(viewingGroup.id, planId, currentAccount?.id);
    const updatedPlans = viewingGroup.ad_plans.filter(
      plan => plan.id !== planId
    );
    const updatedGroup = {
      ...viewingGroup,
      ad_plans: updatedPlans,
    };

    // 更新广告组列表
    setAdGroups(
      adGroups.map(group =>
        group.id === viewingGroup.id ? updatedGroup : group
      )
    );

    setViewingGroup(updatedGroup);
    message.success('广告计划移除成功');
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

  const renderAdGroupCard = group => {
    const planCount = group.ad_plans ? group.ad_plans.length : 0;
    const canDelete = planCount === 0;

    return (
      <Card
        key={group.id}
        hoverable
        className="ad-group-card"
        onClick={() => handleView(group)}
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FolderOutlined style={{ color: '#1890ff', marginRight: 6 }} />
            <span className="group-name">
              {group.name}(ID: {group.id})
            </span>
          </div>
        }
        extra={
          <Space size="2px">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={e => {
                e.stopPropagation();
                handleEdit(group);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title={
                !canDelete
                  ? `该广告组包含 ${planCount} 个广告计划，请先删除组内计划`
                  : '确定要删除这个广告组吗？'
              }
              onConfirm={e => {
                e.stopPropagation();
                handleDelete(group);
              }}
              onCancel={e => {
                e.stopPropagation();
              }}
              okText="确定"
              cancelText="取消"
              disabled={!canDelete}
            >
              <Button
                type="link"
                size="small"
                onClick={e => {
                  e.stopPropagation();
                }}
                danger
                icon={<DeleteOutlined />}
                disabled={!canDelete}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        }
      >
        <div className="card-content">
          <div className="plan-count-section">
            <Badge
              count={planCount}
              style={{ backgroundColor: planCount > 0 ? '#52c41a' : '#d9d9d9' }}
              showZero
            >
              <FileTextOutlined
                style={{ fontSize: '24px', color: '#1890ff' }}
              />
            </Badge>
            <span className="plan-count-text">
              {planCount > 0 ? `包含 ${planCount} 个广告计划` : '暂无广告计划'}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  // ==================== 组件渲染 ====================
  const renderHeader = () => (
    <div className="ad-group-header">
      <h2>广告组管理</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        新建广告组
      </Button>
    </div>
  );

  const renderFormModal = () => (
    <Modal
      title={editingGroup ? '编辑广告组' : '新建广告组'}
      open={isModalVisible}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      okText="保存"
      cancelText="取消"
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical" name="adGroupForm">
        <Form.Item
          name="name"
          label="广告组名称"
          rules={[{ required: true, message: '请输入广告组名称' }]}
        >
          <Input placeholder="请输入广告组名称" />
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderDetailModal = () => (
    <Modal
      title="广告组详情"
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
            handleEdit(viewingGroup);
          }}
        >
          编辑
        </Button>,
      ]}
      width={800}
    >
      {viewingGroup && (
        <div className="group-detail">
          <Descriptions
            bordered
            column={2}
            size="middle"
            styles={{
              label: { fontWeight: 'bold', color: '#595959' },
              content: { color: '#262626' },
            }}
          >
            <Descriptions.Item label="广告组名称" span={2}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FolderOutlined style={{ color: '#1890ff', marginRight: 6 }} />
                {viewingGroup.name}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="包含广告计划">
              <span>
                {viewingGroup.ad_plans ? viewingGroup.ad_plans.length : 0}{' '}
                个计划
              </span>
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h4 style={{ margin: 0, color: '#262626' }}>广告计划列表</h4>
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={handleAddPlan}
              >
                添加计划
              </Button>
            </div>
            {viewingGroup.ad_plans && viewingGroup.ad_plans.length > 0 ? (
              <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={viewingGroup.ad_plans}
                renderItem={plan => (
                  <List.Item>
                    <Card
                      size="small"
                      hoverable
                      onClick={() => handleViewPlan(plan)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Meta
                        avatar={
                          <FileTextOutlined
                            style={{ fontSize: '16px', color: '#1890ff' }}
                          />
                        }
                        title={
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Space>
                              <span>{plan.name}</span>
                              <Tag color={getStatusConfig(plan.status).color}>
                                {getStatusConfig(plan.status).text}
                              </Tag>
                            </Space>
                            <Popconfirm
                              title="确定要从该广告组中移除此计划吗？"
                              onConfirm={e => {
                                e.stopPropagation();
                                handleRemovePlan(plan.id);
                              }}
                              onCancel={e => e && e.stopPropagation()}
                              okText="确定"
                              cancelText="取消"
                            >
                              <Button
                                type="link"
                                size="small"
                                onClick={e => e.stopPropagation()}
                                danger
                                icon={<DeleteOutlined />}
                                style={{ padding: 0 }}
                              />
                            </Popconfirm>
                          </div>
                        }
                        description={
                          <Space
                            split={<span style={{ color: '#d9d9d9' }}>|</span>}
                          >
                            <span>
                              预算: ¥{plan.budget?.toLocaleString() || 0}
                            </span>
                            <span>
                              花费: ¥{plan.cost?.toLocaleString() || 0}
                            </span>
                            <span>
                              创建:{' '}
                              {dayjs(plan.created_at).format('YYYY-MM-DD')}
                            </span>
                          </Space>
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <div className="empty-plans">
                <FileTextOutlined
                  style={{ fontSize: '48px', color: '#d9d9d9' }}
                />
                <p style={{ color: '#999', marginTop: '16px' }}>
                  该广告组暂无广告计划
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );

  const renderPlanDetailModal = () => (
    <Modal
      title="广告计划详情"
      open={isPlanDetailModalVisible}
      onCancel={handlePlanDetailModalCancel}
      footer={[
        <Button key="close" onClick={handlePlanDetailModalCancel}>
          关闭
        </Button>,
      ]}
      width={700}
    >
      {viewingPlan && (
        <Descriptions
          bordered
          column={2}
          size="middle"
          styles={{
            label: { fontWeight: 'bold', color: '#595959' },
            content: { color: '#262626' },
          }}
        >
          <Descriptions.Item label="计划名称" span={2}>
            <Space>
              <FileTextOutlined style={{ color: '#1890ff' }} />
              {viewingPlan.name}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="计划类型">
            {viewingPlan.plan_type || '标准计划'}
          </Descriptions.Item>
          <Descriptions.Item label="推广目标">
            {viewingPlan.target || '应用推广'}
          </Descriptions.Item>
          <Descriptions.Item label="竞价策略">
            {viewingPlan.price_stratagy || 'CPC'}
          </Descriptions.Item>
          <Descriptions.Item label="投放类型">
            {viewingPlan.placement_type || '自动投放'}
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
            ¥{viewingPlan.budget?.toLocaleString() || 0}
          </Descriptions.Item>
          <Descriptions.Item label="花费">
            ¥{viewingPlan.cost?.toLocaleString() || 0}
          </Descriptions.Item>
          <Descriptions.Item label="曝光量">
            {viewingPlan.display_count?.toLocaleString() || 0}
          </Descriptions.Item>
          <Descriptions.Item label="点击量">
            {viewingPlan.click_count?.toLocaleString() || 0}
          </Descriptions.Item>
          <Descriptions.Item label="下载量">
            {viewingPlan.download_count?.toLocaleString() || 0}
          </Descriptions.Item>
          <Descriptions.Item label="点击率">
            {viewingPlan.click_rate || 0}%
          </Descriptions.Item>
          <Descriptions.Item label="下载率">
            {viewingPlan.download_rate || 0}%
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

  const renderAddPlanModal = () => {
    const [selectedPlanIds, setSelectedPlanIds] = useState([]);

    const handleSelectionChange = (planId, checked) => {
      if (checked) {
        setSelectedPlanIds([...selectedPlanIds, planId]);
      } else {
        setSelectedPlanIds(selectedPlanIds.filter(id => id !== planId));
      }
    };

    return (
      <Modal
        title="添加广告计划"
        open={isAddPlanModalVisible}
        onOk={() => handleAddPlanConfirm(selectedPlanIds)}
        onCancel={handleAddPlanCancel}
        okText="确定添加"
        cancelText="取消"
        width={600}
      >
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: '#666' }}>
            选择要添加到该广告组的广告计划：
          </span>
        </div>
        {availablePlans.length > 0 ? (
          <List
            style={{ maxHeight: '500px', overflowY: 'auto' }}
            dataSource={availablePlans}
            renderItem={plan => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  padding: '12px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => {
                  const isChecked = selectedPlanIds.includes(plan.id);
                  handleSelectionChange(plan.id, !isChecked);
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlanIds.includes(plan.id)}
                    onChange={() => {}} // 空函数，实际由父级onClick处理
                    style={{ marginRight: '12px', pointerEvents: 'none' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <FileTextOutlined style={{ color: '#1890ff' }} />
                      <span style={{ fontWeight: '500' }}>{plan.name}</span>
                      <Tag color={getStatusConfig(plan.status).color}>
                        {getStatusConfig(plan.status).text}
                      </Tag>
                    </div>
                    <div
                      style={{
                        color: '#666',
                        fontSize: '12px',
                        marginTop: '4px',
                      }}
                    >
                      ID: {plan.id}
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <p style={{ marginTop: '16px' }}>暂无可用的广告计划</p>
          </div>
        )}
        {selectedPlanIds.length > 0 && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: '6px',
            }}
          >
            <span style={{ color: '#52c41a', fontWeight: '500' }}>
              已选择 {selectedPlanIds.length} 个广告计划
            </span>
          </div>
        )}
      </Modal>
    );
  };

  return (
    <div className="ad-group-management">
      {renderHeader()}

      <Row gutter={[16, 16]}>
        {loading ? (
          <Col span={16}>
            <div className="loading-container">
              <div className="loading-text">加载中...</div>
            </div>
          </Col>
        ) : adGroups.length > 0 ? (
          adGroups.map(group => (
            <Col xs={24} sm={12} lg={12} xl={12} key={group.id}>
              {renderAdGroupCard(group)}
            </Col>
          ))
        ) : (
          <Col span={24}>
            <div className="empty-container">
              <FolderOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
              <p style={{ color: '#999', marginTop: '16px' }}>暂无广告组</p>
            </div>
          </Col>
        )}
      </Row>

      {renderFormModal()}
      {renderDetailModal()}
      {renderPlanDetailModal()}
      {renderAddPlanModal()}
    </div>
  );
}

export default AdGroupManagement;
