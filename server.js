var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var _console = require("console-color-mr");
var app = express();
var multer = require("multer");
var exampleProxy = require("./server/proxy");
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});


// bodyParser.json() 使用json解析传来的参数

app.use(urlencodedParser);
// Multer在解析完请求体后，会向Request对象中添加一个body对象和一个file或files对象（上传多个文件时使用files对象 ）。
// 其中，body对象中包含所提交表单中的文本字段（如果有），而file(或files)对象中包含通过表单上传的文件。 diskStorage方法
// 相当于创建一个磁盘存储引擎，配置文件上传路径，文件名等，可控性更高。
var storage = multer.diskStorage({
  // destination # 设置文件上传路径,本地必须存在的物理路径
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  // filename # 重命名文件
  filename: function(req, file, cb) {
    // 重命名为现在的时间，加上自己的名字
    cb(null, Date.now() + file.originalname);
  }
});

var upload = multer({
  storage: storage
});

// 配置跨域 拦截所有接口
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-type;X-Requested-With,Authorization");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  /**
   * 过滤掉预请求
   * 过滤掉 /auth && POST
   * 过滤掉没有 token
   */
  if (req.method === "OPTIONS") {
    next();
  } else {
    if (
      (req.url === "/auth" && req.method === "POST") ||
      req.url.indexOf("/proxy") > -1
    ) {
      next();
    } else {
      const authorization = req.headers.authorization;
      if (authorization) {
        next();
      } else {
        res.status(500).send({ error: "没有权限访问该接口" });
      }
    }
  }
});

app.post("/auth", async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  new Promise((resolve, reject) => {
    if (username === "one") {
      // 查询到用户
      resolve(true);
    } else {
      reject(false);
    }
  })
    .then(result => {
      if (result) {
        // 单独判断密码
        if (password === "111") {
          let token = Math.random() * 1000000;
          res.send({
            status: 200,
            token
          });
        } else {
          res.send({ status: 400, msg: "账号密码错误" });
        }
      }
    })
    .catch(_ => {
      res.send({ status: 400, msg: "账号密码错误" });
    });
});

app.get("/api", function(request, response) {
  var data = {
    first_name: "roby",
    last_name: "zhou"
  };
  // 输出 JSON 格式
  response.json(data);
});

app.get("/api/user", function(request, response) {
  // 用户请求接收用户参数
  response.json({
    status: 200,
    data: { ...request.query }
  });
});

app.get("/api/roby", function(request, response) {
  var hostName = request.hostname;
  console.log("hostName: %s", hostName);
  response.send("I got you!");
});

app.post("/api/post", function(request, response) {
  // 输出 JSON 格式
  var data = {
    name: request.body.name,
    gender: request.body.gender
  };
  console.log(data);
  //  response.end(JSON.stringify(data));
  response.json(data);
});

// 文件上传 pload.single(fname);
// 接收单文件 upload.array(fname[, maxCount])
// 接收多文件，maxCount表示接收最大数量
app.post("/upload", upload.single("avatar"), function(req, res, next) {
  res.send(req.file.path);
});

// 返回图片预览,配置接口路由,图片请求返回静态地址
app.get("/uploads/*", function(req, res) {
  res.sendFile(__dirname + "/" + req.url);
  console.log("Request for " + req.url + " received.");
});

// 设置express的静态文件地址
// app.use(express.static(path.join(__dirname, 'uploads')));

// 对地址为 /proxy 的请求全部转发
app.use("/proxy", exampleProxy);

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.info("server is running in port->", host, port);
});
