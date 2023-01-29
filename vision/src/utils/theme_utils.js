const theme = {
  chalk: {
    backgroundColor: "#161522", // 背景颜色
    titleColor: "#ffffff", // 标题文字颜色
    logoSrc: "logo_dark.png", //左上角logo图表路径
    themeSrc: "qiehuan_dark.png", // 切换主题按钮的图片路径
    headerBorderSrc: "header_border_dark.png", // 页面顶部边框图片
		selectConColor:"#222733", // 下拉框颜色
		pieColor:"#333843" // 圆环底色
  },
  vintage: {
    backgroundColor: "#eeeeee",
    titleColor: "#000000",
    logoSrc: "logo_light2.png",
    themeSrc: "qiehuan_light.png",
    headerBorderSrc: "header_border_light.png",
		selectConColor:"#ffffff", // 下拉框颜色
		pieColor:"#eeeeee" // 圆环底色
  },
};
export function getThemeValue(themeName) {
  return theme[themeName];
}
