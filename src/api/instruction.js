import request from '../tools/request';

export const getInstructionList = params => {
  return request({
    url: '/instructions',
    method: 'GET',
    params: params,
  });
};

export const deleteInstruction = id => {
  return request({
    url: `/instructions/${id}`,
    method: 'DELETE',
  });
};
