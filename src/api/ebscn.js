import request, { autodocRequest, bufferToUnit8Array } from '@/tools/request';

export const getEBSCNEntries = () => request.get('/ebscn/entries');

export const loginEBSCNSubSystem = async () => {
  const { data } = await getEBSCNEntries();
  await Promise.all(Object.values(data).map(url => fetch(url)));
};

export const getAutodocConfig = () => {
  let url = `/config/feature`;
  return new Promise((resolve, reject) => {
    autodocRequest
      .get(url, { responseType: 'arraybuffer' })
      .then(bufferData => {
        const data = bufferToUnit8Array(bufferData, true);
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getUserLoginStat = params =>
  autodocRequest.get('/user/log', { params });

export const getAutoDocUserInfo = () => autodocRequest.get('/user/me');
