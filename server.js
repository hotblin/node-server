var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var proxy = require('http-proxy-middleware');
var app = express();
var multer = require('multer');

// Multer在解析完请求体后，会向Request对象中添加一个body对象和一个file或files对象（上传多个文件时使用files对象 ）。
// 其中，body对象中包含所提交表单中的文本字段（如果有），而file(或files)对象中包含通过表单上传的文件。 diskStorage方法
// 相当于创建一个磁盘存储引擎，配置文件上传路径，文件名等，可控性更高。
var storage = multer.diskStorage({
  // destination # 设置文件上传路径,本地必须存在的物理路径
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  // filename # 重命名文件
  filename: function (req, file, cb) {
    // 重命名为现在的时间，加上自己的名字
    cb(null, Date.now() + file.originalname)
  }
})

var upload = multer({
  storage: storage
})

// 外部的js文件，本地 mock 的数据文件
var fileData = require('./data.js');

// 配置跨域
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/api', function (request, response) {
  // 输出 JSON 格式
  var data = {
    'first_name': 'roby',
    'last_name': 'zhou'
  };
  console.log(data);
  //  response.end(JSON.stringify(data));
  response.json(fileData);
});

app.get('/roby', function (request, response) {
  var hostName = request.hostname;
  console.log("hostName: %s", hostName);
  response.send("I got you!");
});

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})

app.post('/post', urlencodedParser, function (request, response) {
  // 输出 JSON 格式
  var data = {
    'name': request.body.name,
    'gender': request.body.gender
  };
  console.log(data);
  //  response.end(JSON.stringify(data));
  response.json(data);
});

// 文件上传 pload.single(fname);    // 接收单文件 upload.array(fname[, maxCount])
// //接收多文件，maxCount表示接收最大数量
app.post('/upload', upload.single('avatar'), function (req, res, next) {
  res.send(req.file.path);
});
// 返回图片预览,配置接口路由,图片请求返回静态地址
app.get('/uploads/*', function (req, res) {
  res.sendFile(__dirname + "/" + req.url);
  console.log("Request for " + req.url + " received.");
})
// 设置express的静态文件地址
// app.use(express.static(path.join(__dirname, 'uploads')));


var ProxyOptions = {
  target: 'http://localhost:8088', // 目标主机
  router: {
    // 因为实际开发中服务可能运行在不同的服务接口，所以要将前端发过来的请求重定向到指定的后端服务
    '/rest': 'http://localhost:8088', //如果请求路径是/proxy/rest，则将url的请求路由重定向
    '127.0.0.1:3001/api/8003': 'http://localhost:8003', // 服务该url则重定向
  },
  changeOrigin: true, // 需要虚拟主机站点
};

// 加载代理配置
var exampleProxy = proxy(ProxyOptions);

// 对地址为 /proxy 的请求全部转发
app.use('/proxy', exampleProxy);

var server = app.listen(8081, function () {
  var host = server
    .address()
    .address;
  var port = server
    .address()
    .port;
  console.log("server is running in port: %d", host, port);
});