// 读取文件工具方法
const fs = require("fs");
module.exports.getFileJsonData = (filePath) => {
  // 根据文件路口读取文件内容 需采用异步任务
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (error, data) => {
      if (error) {
        // 读取文件失败
        reject(error);
      } else {
        // 读取文件成功
        resolve(data);
      }
    });
  });
};
