import React from 'react';
import './AdCreativeList.css';
import Navigation from '../../components/Navigation';

function AdCreativeList() {
  // 模拟广告创意数据
  const adCreatives = [
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
    {
      id: 7,
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
      <Navigation pageKey="adCreatives" />
      <div className="ad-creative-list">
        <div className="ad-creative-list-container">
          <h2 className="ad-creative-list-title">广告创意列表</h2>

          <div className="ad-creative-table-container">
            <table className="ad-creative-table">
              <thead>
                <tr>
                  <th>广告创意名称</th>
                  <th>广告创意数量</th>
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
                {adCreatives.map(creative => (
                  <tr key={creative.id}>
                    <td>{creative.name}</td>
                    <td>{creative.planName}</td>
                    <td>
                      <button className="ad-creative-toggle-button">开启</button>
                    </td>
                    <td>{creative.planDayBudget}</td>
                    <td>{creative.downloadCost}</td>
                    <td>{creative.clickCost}</td>
                    <td>{creative.consumptionAmount}</td>
                    <td>{creative.downloadCount}</td>
                    <td>{creative.downloadRate}%</td>
                    <td>{creative.ecpm}</td>
                    <td>{creative.exposure}</td>
                    <td>{creative.clickCount}</td>
                    <td>{creative.clickRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ad-creative-pagination">
            <span>共 {adCreatives.length} 条记录</span>
            <div className="ad-creative-pagination-controls">
              <button className="ad-creative-pagination-button">上一页</button>
              <span className="ad-creative-pagination-current">1</span>
              <button className="ad-creative-pagination-button">下一页</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdCreativeList;
