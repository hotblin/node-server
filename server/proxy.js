const proxy = require("http-proxy-middleware");

// 代理/proxy 到 http://123.59.136.8:8081
const proxyPath = "http://123.59.136.8:8081";

const options = {
  // target: proxyPath,
  // // 需要虚拟主机站点
  // changeOrigin: true,
  // router: {
  //   // 因为实际开发中服务可能运行在不同的服务接口，
  //   // 所以要将前端发过来的请求重定向到指定的后端服务
  //   //如果请求路径是/proxy/sdzk2，则将url的请求路由重定向
  //   "http://127.0.0.1:8081/proxy/sdzk2":
  //     "http://123.59.136.8:8081/company/query?cityId=&companyName=&page=1&size=15"
  // }
  // router: function(request, response) {
  //   console.log(request.url);
  //   console.log(response);
  // }
};
var exampleProxy = proxy("/proxy", {
  target: "https://geo.datav.aliyun.com/areas/bound/150400_full.json"
});
module.exports = exampleProxy;
