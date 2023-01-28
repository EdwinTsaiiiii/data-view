<!-- 热销商品占比模块——饼图 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0, // 当前所展示的一级分类数据
      titleFontSize: 0,
    };
  },
  computed: {
    catName() {
      if (!this.allData) return "";
      else return this.allData[this.currentIndex].name;
    },
		comStyle(){
			return{
				fontSize:this.titleFontSize + 'px'
			}
		}
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, "chalk");
      const initOption = {
        title: {
          text: "▍热销商品的占比",
          left: 20,
          top: 20,
        },
        legend: {
          top: "15%",
          icon: "circle",
        },
        tooltip: {
          show: true,
          // arg拿到的是seriesData的数据
          formatter: (arg) => {
            const thirdCategory = arg.data.children;
            let total = 0;
            thirdCategory.forEach((item) => {
              total += item.value;
            });
            let retStr = "";
            thirdCategory.forEach((item) => {
              retStr += `
								${item.name}: ${((item.value / total) * 100).toFixed(2) + "%"}
								<br/>
							`;
            });
            return retStr;
          },
        },
        series: [
          {
            type: "pie",
            label: { show: false },
            emphasis: { label: { show: true }, labelLine: { show: false } },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const ret = await this.$http.get("hotproduct");
      if (ret.status === 200) {
        this.allData = ret.data;
      } else {
        alert("获取热销数据失败！");
        return;
      }
      this.updateChart();
    },
    updateChart() {
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
          };
        }
      );
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
          };
        }
      );
      const dataOption = {
        legend: {
          data: legendData,
        },
        series: [
          {
            data: seriesData,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const widthSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.2;
      const heightSize = (this.$refs.hot_ref.offsetHeight / 100) * 3.8;
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
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ["50%", "60%"],
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) this.currentIndex = this.allData.length - 1;
      this.updateChart();
    },
    toRight() {
      this.currentIndex++;
      if (this.currentIndex >= this.allData.length) this.currentIndex = 0;
      this.updateChart();
    },
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
};
</script>
<style lang="less" scoped>
.arr-left,
.arr-right {
  position: absolute;
  top: 60%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 50px;
  color: #ffffff;
}
.arr-left {
  left: 10%;
}
.arr-right {
  right: 10%;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: #ffffff;
}
</style>
