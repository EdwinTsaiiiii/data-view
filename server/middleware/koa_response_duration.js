// 第1层中间件 计算服务器消耗时长的中间件
module.exports = async (context, next) => {
	// 记录开始时间
	const start = Date.now();
	// 执行第二层中间件
	await next();
	// 记录结束时间
	const end = Date.now();
	// 计算消耗时间
	const duration = end - start;
	// 设置响应头 
	context.set('X-Response-Time', duration + 'ms')
}