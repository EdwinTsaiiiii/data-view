<!-- 销量排行模块——柱状图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0, // 区域缩放的起点值
      endValue: 9, // 区域缩放的终点值
      timer: null, // 定时器
      titleFontSize: 0,
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
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme);
      const initOption = {
        title: {
          text: "▍地区销售排行",
          top: 20,
          left: 20,
        },
        grid: {
          top: "40%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [{ type: "bar" }],
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    async getData(ret) {
      this.allData = ret;
      this.allData.sort((a, b) => b.value - a.value);
      this.updateChart();
    },
    updateChart() {
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];
      // 处理图表的数据
      const provinceArr = this.allData.map((item) => item.name);
      // 所有省份对应的销售金额
      const valueArr = this.allData.map((item) => item.value);
      const dataOption = {
        // 区域缩放
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        xAxis: {
          data: provinceArr,
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null;
                if (arg.value > 300) {
                  targetColorArr = colorArr[0];
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1];
                } else {
                  targetColorArr = colorArr[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: targetColorArr[0] },
                  { offset: 1, color: targetColorArr[1] },
                ]);
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const widthSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.2;
      const heightSize = (this.$refs.rank_ref.offsetHeight / 100) * 3.8;
      this.titleFontSize =
        widthSize > heightSize * 2.4 || widthSize < heightSize
          ? heightSize
          : widthSize;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        series: [
          {
            barWidth: this.titleFontSize,
            itemStyle: {
              barBorderRadius: [
                this.titleFontSize / 2,
                this.titleFontSize / 2,
                0,
                0,
              ],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.startValue++;
        this.endValue++;
        this.updateChart();
      }, 2000);
    },
  },
  created() {
    this.$socket.registerCallBack("rankData", this.getData);
  },
  mounted() {
    this.initChart();
    this.$socket.send({
      action: "getData",
      socketType: "rankData",
      chartName: "rank",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
    this.startInterval();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timer);
    this.$socket.unRegisterCallBack("rankData");
  },
};
</script>
<style lang="less" scoped></style>
