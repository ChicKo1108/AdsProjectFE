import { logger } from '../config';
import request from '../utils/request';

export const getAdPlanList = async (params, accountId) => {
  logger.info('Get ad plan list API call');
  
  const requestParams = { ...params };
  if (accountId) {
    requestParams.accountId = accountId;
  }

  return await request.get('/ad-plans', { params: requestParams });
};

export const createAdPlan = async (data, accountId) => {
  logger.info('Create ad plan API call');
  
  const requestData = { ...data };
  if (accountId) {
    requestData.accountId = accountId;
  }

  return await request.post('/admin/ad-plans', requestData);
};

export const updateAdPlan = async (id, data, accountId) => {
  logger.info('Update ad plan API call');
  
  const requestData = { ...data };
  if (accountId) {
    requestData.accountId = accountId;
  }

  return await request.put(`/admin/ad-plans/${id}`, requestData);
};

export const deleteAdPlan = async (id, accountId) => {
  logger.info('Delete ad plan API call');
  
  const config = {};
  if (accountId) {
    config.params = { accountId };
  }

  return await request.delete(`/admin/ad-plans/${id}`, config);
};
