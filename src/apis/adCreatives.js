import { logger } from '../config';
import request from '../utils/request';

export const getAdCreativeList = async params => {
  logger.info('Get ad creative list API call');

  return await request.get('/ad-creatives', { params });
};

export const createAdCreative = async data => {
  logger.info('Create ad creative API call');

  return await request.post('/admin/ad-creatives', data);
};

export const updateAdCreative = async (id, data) => {
  logger.info('Update ad creative API call');

  return await request.put(`/admin/ad-creatives/${id}`, data);
};

export const deleteAdCreative = async id => {
  logger.info('Delete ad creative API call');

  return await request.delete(`/ad-creatives/${id}`);
};
