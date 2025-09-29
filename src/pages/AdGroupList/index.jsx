import React, { useEffect, useState } from 'react';
import './AdGroupList.css';
import Navigation from '../../components/Navigation';
import { getAdGroups } from '../../apis';
import { Collapse, Table } from 'antd';
import { AD_PLAN_TABLE_COLUMNS } from '../../utils/constants';
import { useUser } from '../../contexts/UserContext';

function AdGroupList() {
  const [adGroups, setAdGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentAccount } = useUser();

  useEffect(() => {
    getAdGroups(currentAccount?.id).then(({ ad_groups: adGroups, pagination }) => {
      setLoading(false);
      setAdGroups(adGroups);
    });
  }, [currentAccount?.id]);

  return (
    <>
      <Navigation pageKey="adGroups" />
      <div className="ad-group-list">
        <div className="ad-group-list-container">
          <h2 className="ad-group-list-title">广告组列表</h2>
          <Collapse
            items={adGroups.map(adGroup => ({
              key: adGroup.id,
              label: `${adGroup.name}（${adGroup.ad_plans.length}个广告计划）`,
              children: (
                <Table
                  loading={loading}
                  columns={AD_PLAN_TABLE_COLUMNS}
                  size='small'
                  dataSource={adGroup.ad_plans}
                  pagination={false}
                />
              ),
            }))}
          />
        </div>
      </div>
    </>
  );
}

export default AdGroupList;
