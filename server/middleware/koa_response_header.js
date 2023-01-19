// 第2层中间件 设置响应头的中间件
module.exports = async (context, next) => {
  // 设置响应头和响应体
  const contentType = "application/json;charset=utf-8";
  context.set("Content-type", contentType);
  // 跨域配置
  context.set("Access-Control-Allow-Origin", "*");
  context.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  // 进入第三层中间件
  await next();
};
