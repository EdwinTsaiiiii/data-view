export default class SocketService {
  // 单例模式
  static instance = null;
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }
  // 和服务器连接的socket对象
  ws = null;
  // 连接状态
  connected = false;
  // 重试次数
  sendRetryCount = 0;
  // 重新连接尝试的次数
  connectRetryCount = 0;
  // 定义连接服务器的方法
  connect() {
    // 连接服务器
    if (!window.WebSocket) {
      console.log("您的浏览器不支持WebSocket!");
    }
    this.ws = new WebSocket("ws://localhost:8890");
    // 监听连接成功
    this.ws.onopen = () => {
      console.log("连接服务端成功！");
      this.connected = true;
      this.connectRetryCount = 0;
    };
    // 1.服务器连接不成功 2.服务器关闭了连接
    this.ws.onclose = () => {
      console.log("连接服务端失败！");
      this.connected = false;
      this.connectRetryCount++;
      setTimeout(() => {
        this.connect();
      }, this.connectRetryCount * 500);
    };
    // 监听接收消息
    this.ws.onmessage = (msg) => {
      console.log("从服务端获取到了数据");
      // 取出服务端传递的数据
			console.log(JSON.parse(msg.data))
      const recvData = JSON.parse(msg.data);
      // 取出业务类型,要根据业务类型,得到回调函数
      const socketType = recvData.socketType;
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action;
        if (action === "getData") {
          // 得到该图表的数据
          const realData = JSON.parse(recvData.data);
          this.callBackMapping[socketType].call(this, realData);
        } else if (action === "fullScreen") {
          this.callBackMapping[socketType].call(this, recvData);
        } else if (action === "themeChange") {
					this.callBackMapping[socketType].call(this, recvData);
        }
      }
    };
  }
  // 业务类型和回调函数的对应关系
  callBackMapping = {};
  // 回调函数的注册
  registerCallBack(socketType, callBack) {
    this.callBackMapping[socketType] = callBack;
  }
  // 取消一个回调函数
  unRegisterCallBack(socketType) {
    this.callBackMapping[socketType] = null;
  }
  // 发送数据的方法
  send(data) {
    // 判断此时此刻有没有连接成功
    if (this.connected) {
      this.sendRetryCount = 0;
      this.ws.send(JSON.stringify(data));
    } else {
      // 没有的话进行延时重试操作
      this.sendRetryCount++;
      setTimeout(() => {
        this.send(data);
      }, this.sendRetryCount * 500);
    }
  }
}
