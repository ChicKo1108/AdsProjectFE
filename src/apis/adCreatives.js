import { logger } from '../config';
import request from '../utils/request';

export const getAdCreativeList = async (params, accountId) => {
  logger.info('Get ad creative list API call');
  
  const requestParams = { ...params };
  if (accountId) {
    requestParams.accountId = accountId;
  }

  return await request.get('/ad-creatives', { params: requestParams });
};

export const createAdCreative = async (data, accountId) => {
  logger.info('Create ad creative API call');
  
  const requestData = { ...data };
  if (accountId) {
    requestData.accountId = accountId;
  }

  return await request.post('/admin/ad-creatives', requestData);
};

export const updateAdCreative = async (id, data, accountId) => {
  logger.info('Update ad creative API call');
  
  const requestData = { ...data };
  if (accountId) {
    requestData.accountId = accountId;
  }

  return await request.put(`/admin/ad-creatives/${id}`, requestData);
};

export const deleteAdCreative = async (id, accountId) => {
  logger.info('Delete ad creative API call');
  
  const config = {};
  if (accountId) {
    config.params = { accountId };
  }

  return await request.delete(`/ad-creatives/${id}`, config);
};
