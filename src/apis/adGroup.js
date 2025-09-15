import { logger } from '../config';
import request from '../utils/request';

export const getAdGroups = async () => {
  logger.info('Get ad group list API call');

  return await request.get('/ad-plans/ad-groups');
};

export const createAdGroup = async name => {
  logger.info('Create ad group API call');

  return await request.post('admin/ad-plans/ad-groups', {
    name,
  });
};

export const updateAdGroup = async (id, name) => {
  logger.info('Update ad group API call');

  return await request.put(`admin/ad-plans/ad-groups/${id}`, {
    name,
  });
};

export const deleteAdGroup = async id => {
  logger.info('Delete ad group API call');

  return await request.delete(`admin/ad-plans/ad-groups/${id}`);
};

export const bindAdGroupToPlan = async (id, planIds) => {
  logger.info('Bind ad group to plan API call');

  return await request.post(`/admin/ad-plans/bind`, {
    ad_group_ids: [id],
    ad_plan_ids: planIds,
  });
};

export const unbindAdGroupFromPlan = async (id, planId) => {
  logger.info('Unbind ad group from plan API call');

  return await request.delete(`/admin/ad-plans/bind`, {
    data: {
      ad_group_id: id,
      ad_plan_id: planId,
    },
  });
};
