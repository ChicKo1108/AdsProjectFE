import React, { useEffect, useState } from 'react';
import './AdCreativeList.css';
import Navigation from '../../components/Navigation';
import { getAdCreativeList } from '../../apis';
import { Button, Descriptions, Modal, Table, Input } from 'antd';
import { AD_CREATIVES_TABLE_COLUMNS } from '../../utils/constants';

function AdCreativeList() {
  const [adCreatives, setAdCreatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState();
  const [pagination, setPagination] = useState({
    current: 1,
  });
  const pageSize = 10;
  const [selectedAdCreative, setSelectedAdCreative] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleSearch = () => {
    setCurrentPage(1);
    getAdCreativeList({
      page: currentPage,
      pageSize,
      name: search,
    }).then(({ ad_creatives: adCreatives, pagination }) => {
      setAdCreatives(adCreatives);
      setPagination({
        page: pagination.page,
        pageSize,
        total: pagination.total,
      });
      setLoading(false);
    });
  };

  useEffect(() => {
    getAdCreativeList({
      page: currentPage,
      pageSize,
      name: search,
    }).then(({ ad_creatives: adCreatives, pagination }) => {
      setAdCreatives(adCreatives);
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
      <Navigation pageKey="adCreatives" />
      <div className="ad-creative-list">
        <div className="ad-creative-list-container">
          <div style={{ display: 'flex' }}>
            <h2 className="ad-creative-list-title">广告创意列表</h2>
            <div className="ad-creative-list-search">
              <Input.Search
                placeholder="请输入广告创意名称"
                value={search}
                onChange={e => setSearch(e.target.value)}
                loading={loading}
                onSearch={handleSearch}
              />
            </div>
          </div>
          <div className="ad-creative-table-container">
            <Table
            loading={loading}
            dataSource={adCreatives}
            rowKey="id"
            pagination={{
              ...pagination,
              onChange: setCurrentPage,
            }}
            size="middle"
            scroll={{ x: 1200 }}
            columns={[
              ...AD_CREATIVES_TABLE_COLUMNS,
              {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 100,
                fixed: 'right',
                render: (_, record) => (
                  <div>
                    <Button type="link" size="small" onClick={() => {
                      setSelectedAdCreative(record);
                      setShowDetailModal(true);
                    }}>
                      详情
                    </Button>
                  </div>
                ),
              },
            ]}
            />
          </div>
        </div>
      </div>
      <Modal
        title="广告创意详情"
        open={showDetailModal}
        onCancel={() => {
          setShowDetailModal(false);
          setSelectedAdCreative(null);
        }}
        footer={null}
      >
        {selectedAdCreative && (
          <Descriptions column={1} bordered>
            {AD_CREATIVES_TABLE_COLUMNS.map(({ dataIndex, title }) => (
              <Descriptions.Item key={dataIndex} label={title}>{selectedAdCreative[dataIndex]}</Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </Modal>
    </>
  );
}

export default AdCreativeList;
