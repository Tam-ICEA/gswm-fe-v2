import axios from 'axios';

const HttpService = axios.create({
  baseURL: 'http://117.0.35.45:8866/',
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
  config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6eyJpZCI6MSwidXNlcl9uYW1lIjoia2hhbmh0diIsInBhc3N3b3JkIjoiJDJhJDEwJDNDZGVCMWpSa1BDTUp1WG1iQWJUVHVzbktDbUxTdENnOWZXT2dSMEQ0L1Y0anRhSExTQkwyIiwibG9naW5fdHlwZSI6bnVsbCwiaXNfYWN0aXZlIjp0cnVlLCJjcmVhdGVkX2F0IjoiMjAyNC0wNi0wN1QwNDoyNToyMS42MjFaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDYtMDdUMDQ6MjU6MjEuNjIxWiIsImFwaV9rZXkiOiI4YzM1MWU3Ni0xZTMxLTRmYjMtYmZkYi1lOTA3YmIxMWZkN2UifSwiaWF0IjoxNzE3NzM1NTUyLCJleHAiOjE3MjEzMzU1NTJ9.5tQFohy8PZaP2WNK9odAGkELV14h2v9Nbow-8gOVtcw`;
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
