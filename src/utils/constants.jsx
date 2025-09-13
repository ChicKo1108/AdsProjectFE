import React from 'react';
import { Tag } from 'antd';

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
    download: '应用下载'
  },

  // 竞价策略（更新后的枚举值）
  PRICE_STRATEGY: {
    stable_cost: '稳定成本',
    max_conversion: '最大转化',
    optimal_cost: '最优成本'
  },

  STATUS: {
    0: '草稿',
    1: '已发布',
    2: '已暂停',
    3: '已结束',
  }
}

const TAG_COLOR = {
  0: 'orange',
  1: 'green',
  2: 'blue',
  3: 'red',
  4: 'cyan',
  5: 'purple',
  6: 'white',
  7: 'default',
}

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
    width: 80,
  },
  {
    title: '推广目标',
    dataIndex: 'target',
    key: 'target',
    width: 80,
    render: (target, record, index) => {
      const targetColors = {
        app: 'blue',
        web: 'green',
        quick_app: 'orange',
        mini_app: 'purple',
        download: 'cyan'
      };
      return (
        <Tag color={targetColors[target] || 'default'}>
          {AD_PLAN_FIELDS.TARGET[target]}
        </Tag>
      );
    }
  },
  {
    title: '竞价策略',
    dataIndex: 'price_stratagy',
    key: 'price_stratagy',
    width: 80,
    render: (priceStratagy, record, index) => {
      const strategyColors = {
        stable_cost: 'geekblue',
        max_conversion: 'volcano',
        optimal_cost: 'gold'
      };
      return (
        <Tag color={strategyColors[priceStratagy] || 'default'}>
          {AD_PLAN_FIELDS.PRICE_STRATEGY[priceStratagy]}
        </Tag>
      );
    }
  },
  {
    title: '投放类型',
    dataIndex: 'placement_type',
    key: 'placement_type',
    width: 80,
  },
  {
    title: '投放状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
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
  },
  {
    title: '预算',
    dataIndex: 'budget',
    key: 'budget',
    width: 80,
  },
  {
    title: '花费',
    dataIndex: 'cost',
    key: 'cost',
    width: 60,
  },
  {
    title: '曝光量',
    dataIndex: 'display_count',
    key: 'display_count',
    width: 60,
  },
  {
    title: '点击量',
    dataIndex: 'click_count',
    key: 'click_count',
    width: 60,
  },
  {
    title: '下载量',
    dataIndex: 'download_count',
    key: 'download_count',
    width: 60,
  },
  {
    title: '点击均价',
    dataIndex: 'click_per_price',
    key: 'click_per_price',
    width: 70,
  },
  {
    title: '点击率',
    dataIndex: 'click_rate',
    key: 'click_rate',
    width: 60,
    render: rate => `${rate}%`,
  },
  {
    title: 'ECPM',
    dataIndex: 'ecpm',
    key: 'ecpm',
    width: 60,
  },
  {
    title: '下载均价',
    dataIndex: 'download_per_count',
    key: 'download_per_count',
    width: 70,
  },
  {
    title: '下载率',
    dataIndex: 'download_rate',
    key: 'download_rate',
    width: 60,
    render: rate => `${rate}%`,
  },
]

export const AD_CREATIVES_TABLE_COLUMNS = [
  {
    title: '广告创意名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    fixed: 'left',
  },
  {
    title: 'display id',
    dataIndex: 'display_id',
    width: 150,
    key: 'display_id',
  },
  {
    title: '开关',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (status) => (
      <span
        style={{
          padding: '2px 8px',
          backgroundColor:
            status ? '#52c41a' : '#f5222d',
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
    width: 90,
  },
  {
    title: '下载成本',
    dataIndex: 'download_cost',
    key: 'download_cost',
    width: 80,
  },
  {
    title: '点击成本',
    dataIndex: 'click_cost',
    key: 'click_cost',
    width: 80,
  },
  {
    title: '消耗金额',
    dataIndex: 'costs',
    key: 'costs',
    width: 80,
  },
  {
    title: '下载量',
    dataIndex: 'download_count',
    key: 'download_count',
    width: 70,
  },
  {
    title: '下载率',
    dataIndex: 'download_rate',
    key: 'download_rate',
    width: 70,
    render: rate => `${rate}%`,
  },
  {
    title: 'ECPM',
    dataIndex: 'ecpm',
    key: 'ecpm',
    width: 60,
  },
  {
    title: '曝光量',
    dataIndex: 'display_count',
    key: 'display_count',
    width: 70,
  },
  {
    title: '点击量',
    dataIndex: 'click_count',
    key: 'click_count',
    width: 70,
  },
  {
    title: '点击率',
    dataIndex: 'click_rate',
    key: 'click_rate',
    width: 70,
    render: rate => `${rate}%`,
  },
]