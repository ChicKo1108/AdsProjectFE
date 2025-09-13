import React from 'react';
import './AdPlanList.css';
import Navigation from '../../components/Navigation';
import { Table } from 'antd';

function AdPlanList() {
  // 模拟广告计划数据
  const adPlans = [
    {
      id: 1,
      name: 'xxxxx',
      type: 'xxx',
      status: '投放中',
      smartBid: '未启动',
      budget: 'xxx',
      impressions: 0,
      clicks: 0,
      cost: 0,
      downloads: 0,
      clickRate: 0,
      ecpm: 0,
      downloadRate: 0,
      downloadCost: 0,
    },
    {
      id: 2,
      name: 'xxxxx',
      type: 'xxx',
      status: '投放中',
      smartBid: '未启动',
      budget: 'xxx',
      impressions: 0,
      clicks: 0,
      cost: 0,
      downloads: 0,
      clickRate: 0,
      ecpm: 0,
      downloadRate: 0,
      downloadCost: 0,
    },
    {
      id: 3,
      name: 'xxxxx',
      type: 'xxx',
      status: '投放中',
      smartBid: '未启动',
      budget: 'xxx',
      impressions: 0,
      clicks: 0,
      cost: 0,
      downloads: 0,
      clickRate: 0,
      ecpm: 0,
      downloadRate: 0,
      downloadCost: 0,
    },
    {
      id: 4,
      name: 'xxxxx',
      type: 'xxx',
      status: '投放中',
      smartBid: '未启动',
      budget: 'xxx',
      impressions: 0,
      clicks: 0,
      cost: 0,
      downloads: 0,
      clickRate: 0,
      ecpm: 0,
      downloadRate: 0,
      downloadCost: 0,
    },
    {
      id: 5,
      name: 'xxxxx',
      type: 'xxx',
      status: '投放中',
      smartBid: '未启动',
      budget: 'xxx',
      impressions: 0,
      clicks: 0,
      cost: 0,
      downloads: 0,
      clickRate: 0,
      ecpm: 0,
      downloadRate: 0,
      downloadCost: 0,
    },
    {
      id: 6,
      name: 'xxxxx',
      type: 'xxx',
      status: '投放中',
      smartBid: '未启动',
      budget: 'xxx',
      impressions: 0,
      clicks: 0,
      cost: 0,
      downloads: 0,
      clickRate: 0,
      ecpm: 0,
      downloadRate: 0,
      downloadCost: 0,
    },
    {
      id: 7,
      name: 'xxxxx',
      type: 'xxx',
      status: '投放中',
      smartBid: '未启动',
      budget: 'xxx',
      impressions: 0,
      clicks: 0,
      cost: 0,
      downloads: 0,
      clickRate: 0,
      ecpm: 0,
      downloadRate: 0,
      downloadCost: 0,
    },
    {
      id: 8,
      name: 'xxxxx',
      type: 'xxx',
      status: '投放中',
      smartBid: '未启动',
      budget: 'xxx',
      impressions: 0,
      clicks: 0,
      cost: 0,
      downloads: 0,
      clickRate: 0,
      ecpm: 0,
      downloadRate: 0,
      downloadCost: 0,
    },
  ];

  return (
    <>
      <Navigation pageKey="adPlans" />
      <div className="ad-plan-list">
        <div className="ad-plan-list-container">
          <h2 className="ad-plan-list-title">广告计划</h2>

          <div className="ad-plan-table-container">
            <Table
            dataSource={adPlans}
            // pagination={false}
            size="large"
            scroll={{ x: 1200 }}
            columns={[
              {
                title: '计划名称',
                dataIndex: 'name',
                key: 'name',
                width: 120,
                fixed: 'left',
              },
              {
                title: '计划类型',
                dataIndex: 'type',
                key: 'type',
                width: 80,
              },
              {
                title: '投放类型',
                key: 'deliveryType',
                width: 80,
                render: () => '-',
              },
              {
                title: '投放状态',
                dataIndex: 'status',
                key: 'status',
                width: 80,
                render: status => (
                  <span
                    style={{
                      padding: '2px 8px',
                      backgroundColor:
                        status === '投放中' ? '#52c41a' : '#f5222d',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  >
                    {status}
                  </span>
                ),
              },
              {
                title: '智能创意优选',
                dataIndex: 'chuang_yi_you_xuan',
                key: 'chuang_yi_you_xuan',
                width: 100,
              },
              {
                title: '预算/天',
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
                dataIndex: 'impressions',
                key: 'impressions2',
                width: 60,
              },
              {
                title: '点击量',
                dataIndex: 'clicks',
                key: 'clicks',
                width: 60,
              },
              {
                title: '下载量',
                dataIndex: 'downloads',
                key: 'downloads',
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
                dataIndex: 'clickRate',
                key: 'clickRate',
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
                dataIndex: 'downloadCost',
                key: 'downloadCost',
                width: 70,
              },
              {
                title: '下载率',
                dataIndex: 'downloadRate',
                key: 'downloadRate',
                width: 60,
                render: rate => `${rate}%`,
              },
            ]}
          />
          </div>

          
        </div>
      </div>
    </>
  );
}

export default AdPlanList;
