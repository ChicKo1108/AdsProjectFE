import { logger } from '../config';
import request from '../utils/request';

export const getAdPlanList = async params => {
  logger.info('Get ad plan list API call');

  return await request.get('/ad-plans', { params });
};

export const createAdPlan = async data => {
  logger.info('Create ad plan API call');

  return await request.post('/admin/ad-plans', data);
};

export const updateAdPlan = async (id, data) => {
  logger.info('Update ad plan API call');

  return await request.put(`/admin/ad-plans/${id}`, data);
};

export const deleteAdPlan = async id => {
  logger.info('Delete ad plan API call');

  return await request.delete(`/admin/ad-plans/${id}`);
};
