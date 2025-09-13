import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import './Home.css';
import { Cost, Yuan, Manage } from './icon.jsx';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation/index.jsx';
import { getHomeInfo } from '../../apis';
import { AD_CREATIVES_TABLE_COLUMNS, AD_PLAN_TABLE_COLUMNS } from '../../utils/constants';

function Home() {
  const [accountInfo, setAccount] = useState({});
  const [adPlans, setAdPlans] = useState([]);
  const [adCreatives, setAdCreatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomeInfo().then(res => {
      setAccount(res.account);
      setAdPlans(res.adPlans);
      setAdCreatives(res.adCreatives);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Navigation pageKey="home" />
      <div className="home">
        <div className="home-promotion">
          <div className="home-promotion-info">
            <span>
              <Yuan />
              账户余额：￥{accountInfo.balance}
            </span>
            <span>
              <Cost />
              今日广告消耗：￥{accountInfo.today_cost}
            </span>
            <span>
              <Manage />
              账户日预算：￥{accountInfo.account_daily_budget}
            </span>
          </div>
        </div>

        {/* 广告计划列表 */}
        <div className="home-section">
          <h3><Link to="/adPlan">广告计划 &gt;</Link></h3>
          <Table
            dataSource={adPlans}
            pagination={false}
            size="small"
            loading={loading}
            scroll={{ x: 1200 }}
            columns={AD_PLAN_TABLE_COLUMNS}
          />
        </div>

        {/* 广告创意列表 */}
        <div className="home-section">
          <h3><Link to="/adCreative">广告创意 &gt;</Link></h3>
          <Table
            dataSource={adCreatives}
            pagination={false}
            size="small"
            scroll={{ x: 1200 }}
            columns={AD_CREATIVES_TABLE_COLUMNS}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
