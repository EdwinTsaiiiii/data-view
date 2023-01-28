<!-- 库存与销量模块——圆环饼图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0, // 当前显示数据的页数
      timer: null,
      titleFontSize: 0,
    };
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, "chalk");
      const initOption = {
        title: {
          text: "▍库存和销量分析",
          left: 20,
          top: 20,
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    async getData() {
      const ret = await this.$http.get("stock");
      if (ret.status === 200) {
        this.allData = ret.data;
      } else {
        alert("获取库存数据失败！");
        return;
      }
      this.updateChart();
    },
    updateChart() {
      const centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      const colorArr = [
        ["#4FF778", "#0BA82C"],
        ["#E5DD45", "#E8B11C"],
        ["#E8821C", "#E55445"],
        ["#5052EE", "#AB6EE5"],
        ["#23E5E5", "#2E72BF"],
      ];
      const start = this.currentIndex * 5;
      const end = (this.currentIndex + 1) * 5;
      const showData = this.allData.slice(start, end);
      const seriesArr = showData.map((item, index) => {
        return {
          type: "pie",
          data: [
            {
              name: item.name + "\n" + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0],
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1],
                  },
                ]),
              },
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#333843",
              },
            },
          ],
          center: centerArr[index],
          hoverAnimation: false, // 关闭鼠标移入的动画效果
          labelLine: {
            show: false, // 隐藏指示线
          },
          label: {
            position: "center",
            color: colorArr[index][0],
          },
        };
      });
      const dataOption = {
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const widthSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6;
      const heightSize = (this.$refs.stock_ref.offsetHeight / 100) * 3.8;
      this.titleFontSize =
        widthSize > heightSize * 2.4 || widthSize < heightSize
          ? heightSize
          : widthSize;
      const innerRadius = this.titleFontSize * 2;
      const outerRadius = innerRadius * 1.125;
      const seriesArr = [];
      for (let i = 0; i < 5; i++) {
        const item = {
          type: "pie",
          radius: [outerRadius, innerRadius],
          label: {
            fontSize: this.titleFontSize / 2,
          },
        };
        seriesArr.push(item);
      }
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    startInterval() {
      this.timer = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex > 1) this.currentIndex = 0;
        this.updateChart();
      }, 5000);
    },
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
    this.startInterval();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timer);
  },
};
</script>
<style lang="less" scoped></style>
