import { logger } from '../config';
import request from '../utils/request';

export const getAdCreativeList = async params => {
  logger.info('Get ad creative list API call');

  return await request.get('/ad-creatives', { params });
};
