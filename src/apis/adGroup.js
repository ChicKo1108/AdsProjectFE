import { logger } from '../config';
import request from '../utils/request';

export const getAdGroups = async () => {
  logger.info('Get ad group list API call');

  return await request.get('/ad-plans/ad-groups');
};
