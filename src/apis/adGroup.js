import { logger } from '../config';
import request from '../utils/request';

export const getAdGroups = async (accountId) => {
  logger.info('Get ad group list API call');
  
  const config = {};
  if (accountId) {
    config.params = { accountId };
  }

  return await request.get('/ad-plans/ad-groups', config);
};

export const createAdGroup = async (name, accountId) => {
  logger.info('Create ad group API call');
  
  const requestData = { name };
  if (accountId) {
    requestData.accountId = accountId;
  }

  return await request.post('admin/ad-plans/ad-groups', requestData);
};

export const updateAdGroup = async (id, name, accountId) => {
  logger.info('Update ad group API call');
  
  const requestData = { name };
  if (accountId) {
    requestData.accountId = accountId;
  }

  return await request.put(`admin/ad-plans/ad-groups/${id}`, requestData);
};

export const deleteAdGroup = async (id, accountId) => {
  logger.info('Delete ad group API call');
  
  const config = {};
  if (accountId) {
    config.params = { accountId };
  }

  return await request.delete(`admin/ad-plans/ad-groups/${id}`, config);
};

export const bindAdGroupToPlan = async (id, planIds, accountId) => {
  logger.info('Bind ad group to plan API call');
  
  const requestData = {
    ad_group_ids: [id],
    ad_plan_ids: planIds,
  };
  if (accountId) {
    requestData.accountId = accountId;
  }

  return await request.post(`/admin/ad-plans/bind`, requestData);
};

export const unbindAdGroupFromPlan = async (id, planId, accountId) => {
  logger.info('Unbind ad group from plan API call');
  
  const requestData = {
    ad_group_id: id,
    ad_plan_id: planId,
  };
  if (accountId) {
    requestData.accountId = accountId;
  }

  return await request.delete(`/admin/ad-plans/bind`, {
    data: requestData,
  });
};
