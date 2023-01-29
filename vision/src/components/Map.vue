<!-- 商家分布模块——地图+散点图 -->
<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>
<script>
import * as md from "@/main.js";
import { getProvinceMapInfo } from "@/utils/map_utils";
import axios from "axios";
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      titleFontSize: 0,
      isClick: false, // 判断是否点击地图
      mapData: {}, // 所获取的省份的地图矢量数据
      locationList: [], //用户地址列表
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
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme);
      // 获取中国地图的矢量数据
      // 注意获取的地图矢量数据不是在koa2后台，而是在前端项目里面
      const ret = await axios.get(md.mapURL + "/static/map/china.json");
      this.$echarts.registerMap("china", ret.data);
      const initOption = {
        title: {
          text: "▍商家分布",
          left: 20,
          top: 20,
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: "#2E72BF",
            border: "#333",
          },
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "verical",
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("click", async (arg) => {
        if (
          this.isClick ||
          arg.name === "南海诸岛" ||
          this.locationList.includes(arg.name)
        ) {
          alert("暂无详细数据！");
          return;
        }
        this.isClick = true;
        const proviceInfo = getProvinceMapInfo(arg.name);
        // 判断当前所点击的这个省份是否有缓存，没有再进行请求
        if (!this.mapData[proviceInfo.key]) {
          // 需要获取这个省份的地图矢量数据
          const ret = await axios.get(md.mapURL + proviceInfo.path);
          this.mapData[proviceInfo.key] = ret.data;
          this.$echarts.registerMap(proviceInfo.key, ret.data);
        }
        const changeOption = {
          geo: {
            map: proviceInfo.key,
          },
        };
        this.chartInstance.setOption(changeOption);
      });
    },
    async getData(ret) {
      this.allData = ret;
      // 获取会员列表
      this.allData.forEach((item) => {
        item.children.forEach((subitem) => {
          this.locationList.push(subitem.name);
        });
      });
      this.updateChart();
    },
    updateChart() {
      // 图例的数据
      const legendArr = this.allData.map((item) => item.name);
      // return的对象代表一个类别下的所有散点数据
      const seriesArr = this.allData.map((item) => {
        return {
          type: "effectScatter",
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
        };
      });
      const dataOption = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const widthSize = (this.$refs.map_ref.offsetWidth / 100) * 3.2;
      const heightSize = (this.$refs.map_ref.offsetHeight / 100) * 3.8;
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
          itemWidth: this.titleFontSize * 0.6,
          itemHeight: this.titleFontSize * 0.6,
          itemGap: this.titleFontSize * 0.6,
          textStyle: {
            fontSize: this.titleFontSize * 0.5,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    // 回到中国地图
    revertMap() {
      this.isClick = false;
      const revertOption = {
        geo: {
          map: "china",
        },
      };
      this.chartInstance.setOption(revertOption);
    },
  },
  created() {
    this.$socket.registerCallBack("mapData", this.getData);
  },
  mounted() {
    this.initChart();
    this.$socket.send({
      action: "getData",
      socketType: "mapData",
      chartName: "map",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("mapData");
  },
};
</script>
<style lang="less" scoped></style>
