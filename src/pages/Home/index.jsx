import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import './Home.css';
import { Cost, Yuan, Manage } from './icon.jsx';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation/index.jsx';
import { getHomeInfo } from '../../apis';
import { useUser } from '../../contexts/UserContext';
import {
  AD_CREATIVES_TABLE_COLUMNS,
  AD_PLAN_TABLE_COLUMNS,
} from '../../utils/constants';

function Home() {
  const [accountInfo, setAccount] = useState({});
  const [adPlans, setAdPlans] = useState([]);
  const [adCreatives, setAdCreatives] = useState([]);
  const [loading, setLoading] = useState(true);

  // 从UserContext获取当前选中的账户
  const { currentAccount } = useUser();

  // 获取首页数据的函数
  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const accountId = currentAccount?.id;
      const res = await getHomeInfo(accountId);
      setAccount(res.account);
      setAdPlans(res.adPlans);
      setAdCreatives(res.adCreatives);
    } catch (error) {
      console.error('获取首页数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    fetchHomeData();
  }, []);

  // 当账户切换时重新加载数据
  useEffect(() => {
    if (currentAccount) {
      fetchHomeData();
    }
  }, [currentAccount]);

  return (
    <>
      <Navigation pageKey="home" />
      <div className="home">
        <div className="home-promotion">
          <div className="home-account-header">
            <h2 className="account-name">
              {accountInfo.name || '未知账户'} 
              {accountInfo.display_id && (
                <span className="account-id">({accountInfo.display_id})</span>
              )}
            </h2>
          </div>
          <div className="home-promotion-info">
            <span>
              <Yuan />
              账户余额：￥{accountInfo.balance || 0}
            </span>
            <span>
              <Cost />
              今日广告消耗：￥{accountInfo.today_cost || 0}
            </span>
            <span>
              <Manage />
              账户日预算：￥{accountInfo.account_daily_budget || 0}
            </span>
          </div>
        </div>

        {/* 广告计划列表 */}
        <div className="home-section">
          <h3>
            <Link to="/ad-plans">广告计划 &gt;</Link>
          </h3>
          <Table
            dataSource={adPlans}
            pagination={false}
            size="small"
            rowKey="id"
            loading={loading}
            scroll={{ x: 1200 }}
            columns={AD_PLAN_TABLE_COLUMNS}
          />
        </div>

        {/* 广告创意列表 */}
        <div className="home-section">
          <h3>
            <Link to="/ad-creatives">广告创意 &gt;</Link>
          </h3>
          <Table
            dataSource={adCreatives}
            pagination={false}
            size="small"
            rowKey="id"
            loading={loading}
            scroll={{ x: 1200 }}
            columns={AD_CREATIVES_TABLE_COLUMNS}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
