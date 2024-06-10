import axios from 'axios';

const REACT_APP_API = 'http://117.0.35.45:8866/'
// const REACT_APP_API = 'http://localhost:8086/'

const HttpService = axios.create({
  baseURL: REACT_APP_API,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  timeout: 30000
});

HttpService.interceptors.request.use(function (config) {
  // let user = loadFromLocalStorageObjectFromBase64(contantAuthentication.DATA_AUTH);
  // if (!isEmpty(user)) {
  //   user = JSON.parse(user);
  // }
  config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJ1c2VyX25hbWUiOiJUYW1JQ0VBIiwicGFzc3dvcmQiOiIkMmEkMTAkcW12VjNNd0loaFRQb29oZXlNNXBZT3ZxNDBQQkJpZERCeDZqYTVoa1VqOW1qb1Boa25ZRjIiLCJsb2dpbl90eXBlIjpudWxsLCJpc19hY3RpdmUiOnRydWUsImNyZWF0ZWRfYXQiOiIyMDI0LTA2LTEwVDE1OjA5OjM4LjE1OVoiLCJ1cGRhdGVkX2F0IjoiMjAyNC0wNi0xMFQxNTowOTozOC4xNTlaIiwiYXBpX2tleSI6IjMwZmRiNmQwLTk3MDUtNDg4Mi1hNWVjLTg2Y2VkZDYzYzAwNSIsInJvbGUiOjF9LCJpYXQiOjE3MTgwMzIxOTksImV4cCI6MzYwMDE3MTgwMzIxOTl9.KtZB-snWiwFnJZXjk_K_e0CAP0hG1NH6J2Vkz36pvl0`;
  return config;
});

HttpService.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    return Promise.reject(error.response?.data.status.message);
  }
);

export default HttpService;
