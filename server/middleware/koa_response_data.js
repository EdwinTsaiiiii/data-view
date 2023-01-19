// 第3层中间件 处理业务逻辑的中间件 读取某个json文件的数据 响应给前端浏览器
const path = require("path");
const fileUtils = require("../utils/file_utils");

module.exports = async (context, next) => {
  // 根据端口路径 得到json数据的绝对路径
  const url = context.request.url;
  let filePath = url.replace("/api", "");
  filePath = "../data" + filePath + ".json";
	filePath = path.join(__dirname, filePath);
	// 处理对应的json数据与响应内容
	try {
		const ret = await fileUtils.getFileJsonData(filePath);
		context.response.body = ret;
	} catch (error) {
		const errotMsg = {
			message:'读取内容文件失败，文件资源不存在！',
			status: 404
		}
		context.response.body = errotMsg;
	}
  await next();
};
