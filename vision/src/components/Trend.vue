<!-- 销量趋势图表——折线图 -->
<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span
        class="iconfont title-icon"
        @click="showChoice = !showChoice"
        :style="comStyle"
        >▍{{ showTitle }}&nbsp;&#xe6eb;</span
      >
      <div class="select-con" v-show="showChoice">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
					:style="marginStyle"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      showChoice: false,
      choiceType: "map", // 显示的数据类型
      titleFontSize: 0, // 指明标题的字体大小
    };
  },
  computed: {
    selectTypes() {
      return !this.allData
        ? []
        : this.allData.type.filter((item) => item.key !== this.choiceType);
    },
    showTitle() {
      return !this.allData ? "" : this.allData[this.choiceType].title;
    },
    // 设置给标题的样式
    comStyle: {
      get() {
        return { fontSize: this.titleFontSize * 0.8 + "px" };
      },
      set(val) {
        this.titleFontSize = val;
      },
    },
		marginStyle:{
			get() {
        return { marginLeft: this.titleFontSize * 0.6 + "px" };
      },
      set(val) {
        this.titleFontSize = val;
      },
		}
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, "chalk");
      const initOption = {
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "12%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          bottom: "5%",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const ret = await this.$http.get("trend");
      if (ret.status === 200) {
        this.allData = ret.data;
      } else {
        alert("获取销量数据失败！");
				return;
      }
      this.updateChart();
    },
    updateChart() {
      // 半透明颜色值
      const colorArr1 = [
        "rgba(11,168,44,0.5)",
        "rgba(44,110,255,0.5)",
        "rgba(22,242,217,0.5)",
        "rgba(254,33,30,0.5)",
        "rgba(250,105,0,0.5)",
      ];
      // 全透明颜色值
      const colorArr2 = [
        "rgba(11,168,44,0)",
        "rgba(44,110,255,0)",
        "rgba(22,242,217,0)",
        "rgba(254,33,30,0)",
        "rgba(250, 105,8,0)",
      ];
      const timeArr = this.allData.common.month; // 类目轴的数据
      const valueArr = this.allData[this.choiceType].data; // series下的数据
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });
      // 图例的数据
      const legendArr = valueArr.map((item) => {
        return item.name;
      });
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const widthSize = (this.$refs.trend_ref.offsetWidth / 100) * 2;
      const heightSize = (this.$refs.trend_ref.offsetHeight / 100) * 2.5;
      this.titleFontSize =
        widthSize > heightSize * 2.4 || widthSize < heightSize
          ? heightSize
          : widthSize;
      // 分辨率相关的配置项
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize * 0.8,
          itemHeight: this.titleFontSize * 0.8,
          itemGap: this.titleFontSize * 2,
          textStyle: {
            fontSize: this.titleFontSize * 0.8,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    handleSelect(currentType) {
      this.choiceType = currentType;
      this.updateChart();
      this.showChoice = false;
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
.title {
  position: absolute;
  left: 25px;
  top: 25px;
  z-index: 1;
  color: #ffffff;
  cursor: pointer;
  .title-icon {
    margin-left: 5px;
  }
	.select-con{
		background-color: #222733;
	}
}
</style>
