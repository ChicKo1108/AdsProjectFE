import React from 'react';
import { Tag } from 'antd';
import dayjs from 'dayjs';

export const USER_ROLE = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  USER: 'user',
};

const AD_PLAN_FIELDS = {
  TARGET: {
    app: '应用推广',
    web: '网页推广',
    quick_app: '快应用推广',
    mini_app: '小程序推广',
    download: '应用下载',
  },

  // 竞价策略（更新后的枚举值）
  PRICE_STRATEGY: {
    stable_cost: '稳定成本',
    max_conversion: '最大转化',
    optimal_cost: '最优成本',
  },

  STATUS: {
    0: '草稿',
    1: '已发布',
    2: '已暂停',
    3: '已结束',
  },
};

const TAG_COLOR = {
  0: 'orange',
  1: 'green',
  2: 'blue',
  3: 'red',
  4: 'cyan',
  5: 'purple',
  6: 'white',
  7: 'default',
};

export const AD_PLAN_TABLE_COLUMNS = [
  {
    title: '计划名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    fixed: 'left',
  },
  {
    title: '计划类型',
    dataIndex: 'plan_type',
    key: 'plan_type',
    width: 100,
    render: text => text ?? '-',
  },
  {
    title: '推广目标',
    dataIndex: 'target',
    key: 'target',
    width: 100,
    render: (target, record, index) => {
      const targetColors = {
        app: 'blue',
        web: 'green',
        quick_app: 'orange',
        mini_app: 'purple',
        download: 'cyan',
      };
      return (
        <Tag color={targetColors[target] || 'default'}>
          {AD_PLAN_FIELDS.TARGET[target]}
        </Tag>
      );
    },
  },
  {
    title: '竞价策略',
    dataIndex: 'price_stratagy',
    key: 'price_stratagy',
    width: 100,
    render: (priceStratagy, record, index) => {
      const strategyColors = {
        stable_cost: 'geekblue',
        max_conversion: 'volcano',
        optimal_cost: 'gold',
      };
      return (
        <Tag color={strategyColors[priceStratagy] || 'default'}>
          {AD_PLAN_FIELDS.PRICE_STRATEGY[priceStratagy]}
        </Tag>
      );
    },
  },
  {
    title: '投放类型',
    dataIndex: 'placement_type',
    key: 'placement_type',
    width: 100,
    render: text => text ?? '-',
  },
  {
    title: '投放状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: status => (
      <Tag color={TAG_COLOR[status] || 'default'}>
        {AD_PLAN_FIELDS.STATUS[status]}
      </Tag>
    ),
  },
  {
    title: '智能创意优选',
    dataIndex: 'chuang_yi_you_xuan',
    key: 'chuang_yi_you_xuan',
    width: 100,
    render: text =>
      text ? (
        <Tag color={TAG_COLOR[text]}>开</Tag>
      ) : (
        <Tag color={TAG_COLOR[text]}>开</Tag>
      ),
  },
  {
    title: '预算',
    dataIndex: 'budget',
    key: 'budget',
    width: 100,
    render: text => text ?? '-',
  },
  {
    title: '花费',
    dataIndex: 'cost',
    key: 'cost',
    width: 80,
    render: text => text ?? '-',
  },
  {
    title: '曝光量',
    dataIndex: 'display_count',
    key: 'display_count',
    width: 80,
    render: text => text ?? '-',
  },
  {
    title: '点击量',
    dataIndex: 'click_count',
    key: 'click_count',
    width: 80,
    render: text => text ?? '-',
  },
  {
    title: '下载量',
    dataIndex: 'download_count',
    key: 'download_count',
    width: 80,
    render: text => text ?? '-',
  },
  {
    title: '点击均价',
    dataIndex: 'click_per_price',
    key: 'click_per_price',
    width: 100,
    render: text => text ?? '-',
  },
  {
    title: '点击率',
    dataIndex: 'click_rate',
    key: 'click_rate',
    width: 80,
    render: rate => (rate != null ? `${rate}%` : '-'),
  },
  {
    title: 'ECPM',
    dataIndex: 'ecpm',
    key: 'ecpm',
    width: 80,
    render: text => text ?? '-',
  },
  {
    title: '下载均价',
    dataIndex: 'download_per_count',
    key: 'download_per_count',
    width: 100,
    render: text => text ?? '-',
  },
  {
    title: '下载率',
    dataIndex: 'download_rate',
    key: 'download_rate',
    width: 80,
    render: rate => (rate != null ? `${rate}%` : '-'),
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 155,
    render: createdAt => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
  },
  {
    title: '最后更新时间',
    dataIndex: 'updated_at',
    key: 'updated_at',
    width: 155,
    render: updatedAt => dayjs(updatedAt).format('YYYY-MM-DD HH:mm'),
  },
];

export const AD_CREATIVES_TABLE_COLUMNS = [
  {
    title: '广告创意名称',
    dataIndex: 'name',
    key: 'name',
    width: 180,
    fixed: 'left',
  },
  {
    title: 'display ID',
    dataIndex: 'display_id',
    width: 170,
    key: 'display_id',
  },
  {
    title: '开关',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: status => (
      <span
        style={{
          padding: '2px 8px',
          backgroundColor: status ? '#52c41a' : '#f5222d',
          color: 'white',
          borderRadius: '12px',
          fontSize: '11px',
        }}
      >
        {status ? '开启' : '关闭'}
      </span>
    ),
  },
  {
    title: '计划日预算',
    dataIndex: 'budget',
    key: 'budget',
    width: 110,
    render: text => text ?? '-',
  },
  {
    title: '下载成本',
    dataIndex: 'download_cost',
    key: 'download_cost',
    width: 100,
    render: text => text ?? '-',
  },
  {
    title: '点击成本',
    dataIndex: 'click_cost',
    key: 'click_cost',
    width: 100,
    render: text => text ?? '-',
  },
  {
    title: '消耗金额',
    dataIndex: 'costs',
    key: 'costs',
    width: 100,
    render: text => text ?? '-',
  },
  {
    title: '下载量',
    dataIndex: 'download_count',
    key: 'download_count',
    width: 100,
    render: text => text ?? '-',
  },
  {
    title: '下载率',
    dataIndex: 'download_rate',
    key: 'download_rate',
    width: 100,
    render: rate => (rate != null ? `${rate}%` : '-'),
  },
  {
    title: 'ECPM',
    dataIndex: 'ecpm',
    key: 'ecpm',
    width: 80,
    render: text => text ?? '-',
  },
  {
    title: '曝光量',
    dataIndex: 'display_count',
    key: 'display_count',
    width: 100,
    render: text => text ?? '-',
  },
  {
    title: '点击量',
    dataIndex: 'click_count',
    key: 'click_count',
    width: 100,
    render: text => (text != null ? text : '-'),
  },
  {
    title: '点击率',
    dataIndex: 'click_rate',
    key: 'click_rate',
    width: 100,
    render: rate => (rate != null ? `${rate}%` : '-'),
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 160,
    render: createdAt => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
  },
  {
    title: '最后更新时间',
    dataIndex: 'updated_at',
    key: 'updated_at',
    width: 160,
    render: updatedAt => dayjs(updatedAt).format('YYYY-MM-DD HH:mm'),
  },
];
