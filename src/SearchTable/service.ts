import request from '@/utils/request';

export async function fetchCommonAsync({
  url,
  method = 'get',
  ...restParams
}: any): Promise<any> {
  const params: any = {
    method,
  };
  if (method.toLowerCase() === 'get') {
    params.params = restParams;
  } else {
    params.data = restParams;
  }
  return request(url, params);
}
