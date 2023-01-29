<!-- 商家销量统计——横向柱状图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      currentPage: 1, // 当前显示的页数
      totalPage: 0, // 一共有多少页数据
      timer: null, // 定时器标识
    };
  },
  computed: {
    ...mapState(["theme"]),
  },
  watch: {
    theme() {
      this.chartInstance.dispose(); // 销户当前的图表
      this.initChart();
      this.screenAdapter();
      this.updateChart();
    },
  },
  methods: {
    // 初始化echartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.seller_ref,
        this.theme
      );
      // 对图表初始化配置的控制
      const initOption = {
        title: {
          text: "▍商家销售统计",
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "5%",
          containLabel: true, // 距离是包含坐标轴上的文字
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              color: "#2D3443",
            },
          },
          itemStyle: {
            opacity: 0.5,
          },
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              // 指明颜色渐变的方向
              // 指明不同百分比之下的颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 百分之零状态下的颜色值
                {
                  offset: 0,
                  color: "#5052EE",
                },
                // 百分之百状态下的颜色值
                {
                  offset: 1,
                  color: "#AB6EF5",
                },
              ]),
              // 移入当前的柱状图时改变颜色
              emphasis: {
                opacity: 0.85,
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      // 对图表对象进行鼠标事件的监听
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    // 获取服务器的数据
    async getData(ret) {
      this.allData = ret;
      // 对数据排序
      this.allData.sort((a, b) => a.value - b.value);
      // 每5个元素显示一页
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1;
      // 更新图表
      this.updateChart();
      // 启动定时器
      this.startInterval();
    },
    // 更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);
      const sellerNames = showData.map((item) => item.name);
      const sellerValues = showData.map((item) => item.value);
      const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      };
      // option可以设置多次
      this.chartInstance.setOption(dataOption);
    },
    // 设置过页的定时器
    startInterval() {
      this.timer = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 3000);
    },
    // 当浏览器的大小发生变化的时候，会调用的方法，来完成屏幕的适配
    screenAdapter() {
      const widthSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.2;
      const heightSize = (this.$refs.seller_ref.offsetHeight / 100) * 3.8;
      const realSize =
        widthSize > heightSize * 2.4 || widthSize < heightSize
          ? heightSize
          : widthSize;
      // 分辨率相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: realSize,
          },
          left: realSize,
          top: realSize,
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: realSize,
            },
          },
        },
        series: [
          {
            barWidth: realSize,
            itemStyle: {
              barBorderRadius: [0, realSize / 2, realSize / 2, 0],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      // 手动调用图标的resize才能产生效果
      this.chartInstance.resize();
    },
  },
  created() {
    this.$socket.registerCallBack("sellerData", this.getData);
  },
  mounted() {
    this.initChart();
    this.$socket.send({
      action: "getData",
      socketType: "sellerData",
      chartName: "seller",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    // 在界面加载完成时，主动进行屏幕的适配
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timer);
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("sellerData");
  },
};
</script>
<style lang="less" scoped></style>
