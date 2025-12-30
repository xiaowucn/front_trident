import request from '@/tools/request';

export const checkFaultyWord = data => {
  return request({
    url: '/faulty-wordings',
    method: 'POST',
    data: data,
  });
};
