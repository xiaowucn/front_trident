import request from '@/tools/request';

export const fetchManagerLogs = params => {
  return request({
    url: '/jhzq/manage-records',
    method: 'GET',
    params: params,
  });
};

export const fetchCustomLogs = params => {
  return request({
    url: '/jhzq/custom-logs',
    method: 'GET',
    params: params,
  });
};
