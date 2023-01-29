// webSocket
const webSocket = require("ws");
const path = require("path");
const fileUtils = require("../utils/file_utils");
// 创建服务对象，绑定端口号
const wss = new webSocket.Server({
  port: 8890,
});
// 服务端开启监听
module.exports.listen = () => {
  // 对客户端的连接事件进行监听
  // client：代表的是可会端的连接socket对象
  wss.on("connection", (client) => {
    console.log("客户端连接成功了...");
    // msg:由客户端发送给服务端的数据
    client.on("message", async (msg) => {
      console.log("客户端发送信息给服务端了:" + msg);
      let payload = JSON.parse(msg);
      const action = payload.action;
      if (action === "getData") {
        let filePath = "../data/" + payload.chartName + ".json";
        filePath = path.join(__dirname, filePath);
        const ret = await fileUtils.getFileJsonData(filePath);
        // 服务端获取数据的基础之上，增加一个data字段
        // data对应的值就是json文件的内容
        payload.data = ret;
        client.send(JSON.stringify(payload));
      } else {
        // 原封不动地将所接收到的数据转发给每一个处于连接状态的客户端
        wss.clients.forEach((client) => {
					// 由服务端往客户端发送数据
          client.send(msg);
        });
      }
    });
  });
};
