<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="" />
      </div>
      <span class="logo">
        <img :src="logoSrc" alt="" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme" />
        <span class="datetime">{{ this.time }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div
          id="left-top"
          :class="[fullScreenStatus.trend ? 'fullscreen' : '']"
        >
          <!-- 销量趋势图表 -->
          <span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <Trend ref="trend"></Trend>
          <div class="resize">
            <div
              :class="[
                'iconfont',
                fullScreenStatus.trend
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
              @click="handleChangeSize('trend')"
            ></div>
          </div>
        </div>
        <div
          id="left-bottom"
          :class="[fullScreenStatus.seller ? 'fullscreen' : '']"
        >
          <!-- 商家销售金额图表 -->
					<span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <Seller ref="seller"></Seller>
          <div class="resize">
            <div
              :class="[
                'iconfont',
                fullScreenStatus.seller
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
              @click="handleChangeSize('seller')"
            ></div>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div
          id="middle-top"
          :class="[fullScreenStatus.map ? 'fullscreen' : '']"
        >
          <!-- 商家分布图表 -->
					<span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <Map ref="map"></Map>
          <div class="resize">
            <div
              :class="[
                'iconfont',
                fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
              @click="handleChangeSize('map')"
            ></div>
          </div>
        </div>
        <div
          id="middle-bottom"
          :class="[fullScreenStatus.rank ? 'fullscreen' : '']"
        >
          <!-- 地区销量排行图表 -->
					<span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <Rank ref="rank"></Rank>
          <div class="resize">
            <div
              :class="[
                'iconfont',
                fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
              @click="handleChangeSize('rank')"
            ></div>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
					<span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <Hot ref="hot"></Hot>
          <div class="resize">
            <div
              :class="[
                'iconfont',
                fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
              @click="handleChangeSize('hot')"
            ></div>
          </div>
        </div>
        <div
          id="right-bottom"
          :class="[fullScreenStatus.stock ? 'fullscreen' : '']"
        >
          <!-- 库存销量分析图表 -->
					<span class="angle1"></span>
          <span class="angle2"></span>
          <span class="angle3"></span>
          <span class="angle4"></span>
          <Stock ref="stock"></Stock>
          <div class="resize">
            <div
              :class="[
                'iconfont',
                fullScreenStatus.stock
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
              @click="handleChangeSize('stock')"
            ></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import Hot from "@/components/Hot.vue";
import Map from "@/components/Map.vue";
import Rank from "@/components/Rank.vue";
import Seller from "@/components/Seller.vue";
import Stock from "@/components/Stock.vue";
import Trend from "@/components/Trend.vue";
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
export default {
  components: {
    Seller,
    Stock,
    Trend,
    Map,
    Hot,
    Rank,
  },
  data() {
    return {
      // 定义每个图表的全屏状态
      fullScreenStatus: {
        seller: false,
        stock: false,
        trend: false,
        map: false,
        hot: false,
        rank: false,
      },
      time: null,
      timer: null,
    };
  },
  computed: {
    logoSrc() {
      return "/static/img/" + getThemeValue(this.theme).logoSrc;
    },
    headerSrc() {
      return "/static/img/" + getThemeValue(this.theme).headerBorderSrc;
    },
    themeSrc() {
      return "/static/img/" + getThemeValue(this.theme).themeSrc;
    },
    containerStyle() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor,
      };
    },
    ...mapState(["theme"]),
  },
  methods: {
    handleChangeSize(chartName) {
      // // 改变fullScreenStatus的数据
      // this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName];
      // // 调用图表组件对象的screenAdapter方法
      // this.$nextTick(() => {
      //   this.$refs[chartName].screenAdapter();
      // });
      const targetValue = !this.fullScreenStatus[chartName];
      // 多屏联动效果
      // 将数据发送给服务端
      this.$socket.send({
        action: "fullScreen",
        socketType: "fullScreen",
        chartName: chartName,
        value: targetValue,
      });
    },
    // 接收到全屏数据的处理
    recvData(data) {
      // 取出是哪一个图表需要进行切换
      // 需要切换成什么状态
      const chartName = data.chartName;
      const targetValue = data.value;
      this.fullScreenStatus[chartName] = targetValue;
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter();
      });
    },
    handleChangeTheme() {
      // 修改vuex里面的数据
      // this.$store.commit("changeTheme");
      this.$socket.send({
        action: "themeChange",
        socketType: "themeChange",
        chartName: "",
        value: "",
      });
    },
    // 接收到主题的处理
    recvThemeChange() {
      this.$store.commit("changeTheme");
    },
    // 获取当今时间
    getTime() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      this.time =
        year +
        "-" +
        this.addZero(month) +
        "-" +
        this.addZero(day) +
        " " +
        this.addZero(hour) +
        ":" +
        this.addZero(minute) +
        ":" +
        this.addZero(second);
    },
    addZero(s) {
      return s < 10 ? "0" + s : s;
    },
    startInterval() {
      if (this.timer) clearInterval(this.timer);
      let _this = this;
      this.timer = setInterval(() => {
        _this.getTime();
      }, 1000);
    },
  },
  created() {
    this.$socket.registerCallBack("fullScreen", this.recvData);
    this.$socket.registerCallBack("themeChange", this.recvThemeChange);
  },
  mounted() {
    this.getTime();
    this.startInterval();
  },
  destroyed() {
    this.$socket.unRegisterCallBack("fullScreen");
    this.$socket.unRegisterCallBack("themeChange");
    clearInterval(this.timer);
  },
};
</script>
<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 30px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
