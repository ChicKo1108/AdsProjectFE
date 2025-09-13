import React from 'react';
import './AdGroupList.css';
import Navigation from '../../components/Navigation';

function AdGroupList() {
  // 模拟广告组数据
  const adGroups = [
    {
      id: 1,
      name: 'xxxxxx',
      planName: '50646461',
      status: '开启/关闭',
      planDayBudget: 0,
      downloadCost: 0,
      clickCost: 0,
      consumptionAmount: 0,
      downloadCount: 0,
      downloadRate: 0,
      ecpm: 0,
      exposure: 0,
      clickCount: 0,
      clickRate: 0,
    },
    {
      id: 2,
      name: 'xxxxxx',
      planName: '50646461',
      status: '开启/关闭',
      planDayBudget: 0,
      downloadCost: 0,
      clickCost: 0,
      consumptionAmount: 0,
      downloadCount: 0,
      downloadRate: 0,
      ecpm: 0,
      exposure: 0,
      clickCount: 0,
      clickRate: 0,
    },
    {
      id: 3,
      name: 'xxxxxx',
      planName: '50646461',
      status: '开启/关闭',
      planDayBudget: 0,
      downloadCost: 0,
      clickCost: 0,
      consumptionAmount: 0,
      downloadCount: 0,
      downloadRate: 0,
      ecpm: 0,
      exposure: 0,
      clickCount: 0,
      clickRate: 0,
    },
    {
      id: 4,
      name: 'xxxxxx',
      planName: '50646461',
      status: '开启/关闭',
      planDayBudget: 0,
      downloadCost: 0,
      clickCost: 0,
      consumptionAmount: 0,
      downloadCount: 0,
      downloadRate: 0,
      ecpm: 0,
      exposure: 0,
      clickCount: 0,
      clickRate: 0,
    },
    {
      id: 5,
      name: 'xxxxxx',
      planName: '50646461',
      status: '开启/关闭',
      planDayBudget: 0,
      downloadCost: 0,
      clickCost: 0,
      consumptionAmount: 0,
      downloadCount: 0,
      downloadRate: 0,
      ecpm: 0,
      exposure: 0,
      clickCount: 0,
      clickRate: 0,
    },
    {
      id: 6,
      name: 'xxxxxx',
      planName: '50646461',
      status: '开启/关闭',
      planDayBudget: 0,
      downloadCost: 0,
      clickCost: 0,
      consumptionAmount: 0,
      downloadCount: 0,
      downloadRate: 0,
      ecpm: 0,
      exposure: 0,
      clickCount: 0,
      clickRate: 0,
    },
  ];

  return (
    <>
      <Navigation pageKey="adGroups" />
      <div className="ad-group-list">
      <div className="ad-group-list-container">
        <h2 className="ad-group-list-title">广告组列表</h2>

        <div className="ad-group-table-container">
          <table className="ad-group-table">
            <thead>
              <tr>
                <th>广告组名称</th>
                <th>广告计划数量</th>
                <th>开关</th>
                <th>计划日预算</th>
                <th>下载成本</th>
                <th>点击成本</th>
                <th>消耗金额</th>
                <th>下载量</th>
                <th>下载率</th>
                <th>ECPM</th>
                <th>曝光量</th>
                <th>点击量</th>
                <th>点击率</th>
              </tr>
            </thead>
            <tbody>
              {adGroups.map(group => (
                <tr key={group.id}>
                  <td>{group.name}</td>
                  <td>{group.planName}</td>
                  <td>
                    <button className="ad-group-toggle-button">开启</button>
                  </td>
                  <td>{group.planDayBudget}</td>
                  <td>{group.downloadCost}</td>
                  <td>{group.clickCost}</td>
                  <td>{group.consumptionAmount}</td>
                  <td>{group.downloadCount}</td>
                  <td>{group.downloadRate}%</td>
                  <td>{group.ecpm}</td>
                  <td>{group.exposure}</td>
                  <td>{group.clickCount}</td>
                  <td>{group.clickRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ad-group-pagination">
          <span>共 {adGroups.length} 条记录</span>
          <div className="ad-group-pagination-controls">
            <button className="ad-group-pagination-button">上一页</button>
            <span className="ad-group-pagination-current">1</span>
            <button className="ad-group-pagination-button">下一页</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default AdGroupList;
