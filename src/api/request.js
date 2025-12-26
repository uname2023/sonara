import axios from "axios";
const requests = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

// 从存储中获取 token 的函数
function getToken() {
  // 根据实际存储方式选择
  return localStorage.getItem('sonara_token') ||
    sessionStorage.getItem('sonara_token') ||
    ''
}

// 配置请求拦截器
requests.interceptors.request.use((config) => {
  // 配置对象，对象里面的header请求头很重要
  const timestamp = Date.now(); // 获取当前时间戳

  const token = getToken()
  if (token) {
    // 根据后端要求设置 token
    config.headers['Authorization'] = `Bearer ${token}`
  }

  if (config.method === 'get') {
    config.params = {
      ...config.params,
      // 将时间戳添加到 GET 请求的参数中
      // _t: timestamp, 
    };
  } else if (config.method === 'post') {
    config.data = {
      ...config.data,
      // 将时间戳添加到 POST 请求的 body 中
      // _t: timestamp, 
    };
  }
  return config;
});

// 响应拦截器
requests.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    return Promise.reject(new Error("faile"));
  }
);

export default requests;
