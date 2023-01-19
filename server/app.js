// 服务器入口文件
// 导入中间件
const resDurationMiddleware = require("./middleware/koa_response_duration");
const resHeaderMiddleware = require("./middleware/koa_response_header");
const resDataMiddleware = require("./middleware/koa_response_data");

// 1.创建koa实例对象
const Koa = require("koa");
const app = new Koa();

// 2.绑定中间件
// 绑定第一层中间件
app.use(resDurationMiddleware);
// 绑定第二层中间件
app.use(resHeaderMiddleware);
// 绑定第三层中间件
app.use(resDataMiddleware);

// 3.绑定端口号
app.listen(8888);
