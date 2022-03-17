<template>
  <div id="app">
    <div id="mapContainer"></div>
    <!-- 输入框 -->
    <div id="tip">
      <input
        v-model="inputVal"
        type="text"
        id="keyword"
        name="keyword"
        value="请输入关键字：(选定后搜索)"
        onfocus='this.value=""'
        @change="changeSearch"
      />
      <ul v-if="this.searchResult.length > 0">
        <li
          v-for="(item, index) in searchResult"
          :key="index"
          @click="toCity(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <!-- 更改已绘制好的 -->
    <div class="input-card" style="width: 120px;">
      <button class="btn" @click="open()" style="margin-bottom: 5px">
        开始编辑
      </button>
      <button class="btn" @click="close()">结束编辑</button>
    </div>
  </div>
</template>

<script>
var polyEditor; //修改画好的地块
var map; //地图
export default {
  data() {
    return {
      inputVal: "",
      searchResult: [],
      center: [116.397428, 39.90923],
      center1: []
      // polyEditor:''
    };
  },
  methods: {
    init() {
      // var windowsArr = [];
      map = new AMap.Map("mapContainer", {
        resizeEnable: true,
        center: this.center, //地图中心点
        zoom: 17, //地图显示的缩放级别
        // layers: [new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()],
        layers: [new AMap.TileLayer.Satellite()], //卫星地图
        keyboardEnable: false
      });
      // 画默认地块(可替换每个城市下的对应地块path)
      var path = [
        [116.394837, 39.91081],
        [116.396157, 39.910802],
        [116.395813, 39.91039]
      ];
      var polygon = new AMap.Polygon({
        path: path,
        strokeColor: "#FF33FF",
        strokeWeight: 6, //线宽
        strokeOpacity: 0.2, // 线条透明度
        fillOpacity: 0.4, //背景色透明度
        fillColor: "#1791fc", // 背景色
        zIndex: 50
      });
      map.add(polygon);

      //修改已画好的地块
      polyEditor = new AMap.PolyEditor(map, polygon);
      // console.log(this.polyEditor.open);
      polyEditor.on("addnode", function(event) {
        log.info("移动线点");
      });

      polyEditor.on("adjust", function(event) {
        log.info("移动顶点");
      });

      polyEditor.on("removenode", function(event) {
        log.info("触发事件：removenode");
      });

      polyEditor.on("end", function(event) {
        log.info("结束编辑");
        console.log(event.target, "结束编辑的坐标");
        // event.target 即为编辑后的多边形对象
      });

      // 缩放地图到合适的视野级别
      // map.setFitView([polygon]);

      // map.panTo(this.center1);
    },
    // 点击开始编辑
    open() {
      polyEditor.open();
    },
    // 点击结束编辑
    close() {
      polyEditor.close();
    },
    // 输入框搜索
    changeSearch(e) {
      // console.log(this.inputVal);
      this.$axios({
        method: "get",
        url: "https://restapi.amap.com/v3/assistant/inputtips?",
        params: {
          key: "52ea6dc67932551ab0d35cb597b56365",
          keywords: this.inputVal
        }
      }).then(res => {
        console.log(res, "结果");
        if (res.data.info == "OK") {
          this.searchResult = res.data.tips;
          // console.log( this.searchResult);
        }
      });
    },
    // 点击搜索结果的城市跳转地点
    toCity(item) {
      if (!item.location.length > 0) {
        this.inputVal = "暂无该城市位置信息";
        // this.searchResult = []
      } else {
        console.log(item, "点击城市的经纬度");
        this.inputVal = item.name;
        let arr = item.location.split(",");
        // console.log(arr);
        let arr1 = [];
        arr.map(item => {
          arr1.push(Number(item));
        });
        // console.log(arr1);
        this.center = arr1;
        this.init();
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
.amap-wrapper {
  width: 500px;
  height: 500px;
}
#container {
  margin: 0;
  padding: 0;
  width: 800px;
  height: 800px;
}
#tip {
  background-color: #ddf;
  color: #333;
  border: 1px solid silver;
  box-shadow: 3px 4px 3px 0px silver;
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 5px;
  overflow: hidden;
  line-height: 20px;
}
#tip input[type="text"] {
  height: 25px;
  border: 0;
  padding-left: 5px;
  width: 280px;
  border-radius: 3px;
  outline: none;
}
.amap-marker:first-child .amap-icon img {
  width: 28px;
  height: 40px;
}
</style>
