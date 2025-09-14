import React, { useEffect, useState } from 'react';
import './AdPlanList.css';
import Navigation from '../../components/Navigation';
import { Button, Input, Table } from 'antd';
import { getAdPlanList } from '../../apis';
import { AD_PLAN_TABLE_COLUMNS } from '../../utils/constants';
import { Link } from 'react-router-dom';

function AdPlanList() {
  const [adPlans, setAdPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState();
  const [pagination, setPagination] = useState({
    current: 1,
  });
  const pageSize = 10;

  const handleSearch = () => {
    setCurrentPage(1);
    getAdPlanList({
      page: currentPage,
      pageSize,
      name: search,
    }).then(({ ad_plans: adPlans, pagination }) => {
      setAdPlans(adPlans);
      setPagination({
        page: pagination.page,
        pageSize,
        total: pagination.total,
      });
      setLoading(false);
    });
  };

  useEffect(() => {
    getAdPlanList({
      page: currentPage,
      pageSize,
      name: search,
    }).then(({ ad_plans: adPlans, pagination }) => {
      setAdPlans(adPlans);
      setPagination({
        page: pagination.page,
        pageSize,
        total: pagination.total,
      });
      setLoading(false);
    });
  }, [currentPage]);

  return (
    <>
      <Navigation pageKey="adPlans" />
      <div className="ad-plan-list">
        <div className="ad-plan-list-container">
          <div style={{ display: 'flex' }}>
            <h2 className="ad-plan-list-title">广告计划</h2>
            <div className="ad-plan-list-search">
              <Input.Search
                placeholder="请输入广告计划名称"
                value={search}
                onChange={e => setSearch(e.target.value)}
                loading={loading}
                onSearch={handleSearch}
              />
            </div>
          </div>
          <div className="ad-plan-table-container">
            <Table
              loading={loading}
              dataSource={adPlans}
              rowKey="id"
              pagination={{
                ...pagination,
                onChange: setCurrentPage,
              }}
              size="middle"
              scroll={{ x: 800 }}
              columns={[
                ...AD_PLAN_TABLE_COLUMNS,
                {
                  title: '操作',
                  dataIndex: 'operation',
                  key: 'operation',
                  width: 70,
                  align: 'center',
                  fixed: 'right',
                  render: () => (
                    <div>
                      <Button size="small" type="link">
                        <Link to="/ad-plan/create">详情</Link>
                      </Button>
                    </div>
                  ),
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
