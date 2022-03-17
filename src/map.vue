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
      <ul v-if="this.searchResult.length > 0" class="show">
        <li
          v-for="(item, index) in searchResult"
          :key="index"
          @click="toCity(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <!-- 自己绘制图形 -->
    <div class="input-card" style="width: 200px">
      <h4 style="margin-bottom: 10px; font-weight: 600">绘制地块</h4>
      <button class="btn" @click="drawPolygon()" style="margin-bottom: 5px">
        开始绘制
      </button>
      <button class="btn" @click="removePolygon()" style="margin-bottom: 5px">
        清除
      </button>
    </div>
  </div>
</template>

<script>
var mouseTool; // 绘制矢量图插件
var map; //地图
var coordinate = []; // 多边形绘制完成得到的坐标点
var overlays = []; //mouseTool覆盖物对象
import {
  gcjToWgs,
  getPolygon,
  geometriesCollection
} from "@/utils/coordinate.js";
export default {
  data() {
    return {
      inputVal: "",
      searchResult: [],
      center: [116.397428, 39.90923],
      center1: []
    };
  },
  methods: {
    init() {
      let that = this;
      // var windowsArr = [];
      var marker = [];
      map = new AMap.Map("mapContainer", {
        resizeEnable: true,
        center: this.center, //地图中心点
        zoom: 17, //地图显示的缩放级别
        // layers: [new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()],
        layers: [new AMap.TileLayer.Satellite()], //卫星地图
        keyboardEnable: false
      });

      //实例化绘制矢量图 + 监听自定义矢量图是否绘制完毕
      mouseTool = new AMap.MouseTool(map);
      mouseTool.on("draw", function(event) {
        // console.log(event);
        overlays.push(event.obj);
        // event.obj 为绘制出来的覆盖物对象
        log.info("覆盖物对象绘制完成");
        map.Ce.dragEnable = true; // 拖拽开启
        // console.log(map.Ce.dragEnable, "绘制完成时拖拽值");
        coordinate = Array.from(new Set(coordinate));
        mouseTool.close(); //关闭，并清除覆盖物
        console.log(coordinate, "多边形绘制坐标");
        let gaodePaths = [];
        let routePath = [];
        let paths = coordinate;
        if (paths.length > 0) {
          // let op = paths[i].getOptions();
          paths.forEach(item => {
            console.log("ssss", item);
            let gaodePath = [item.lng, item.lat];
            gaodePaths.push(gaodePath);
            gcjToWgs(item.lng, item.lat).then(data => {
              routePath.push(data);
            });
          });
        }
        let pathList = [];
        pathList.push(routePath);
        console.log("pathList", pathList);
        let boundaryCoordinates = [];
        boundaryCoordinates.push(routePath);
        let area = Math.round(AMap.GeometryUtil.ringArea(gaodePaths));
        console.log("面积", area);
        // that.drawArea += area;
        let polygonJson = getPolygon(pathList);
        console.log("polygonJson", polygonJson);
        let jsonObject = geometriesCollection(polygonJson);
        console.log("jsonObject", jsonObject);
        let geojsonString = JSON.stringify(jsonObject); //geojson文件的数据
        let boundaryCString = JSON.stringify(boundaryCoordinates); //整个坐标点
        console.log("geojson文件的数据", geojsonString);
        console.log("整个坐标点", boundaryCString);
        // that.form.id = that.id;
        // that.form.geojsonText = geojsonString;
        // that.form.area = that.plotArea;
        // that.form.coordinate = boundaryCString;
        // that.drawPaths.push(polygonJson);
      });
      // 缩放地图到合适的视野级别
      // map.setFitView();
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
      this.searchResult.length = 0;
    },
    //绘制多边形
    drawPolygon() {
      map.Ce.dragEnable = false; //禁止拖拽地图
      console.log(map.Ce.dragEnable, "开始绘制时的值");
      // let coordinate = [];
      // 监听点击地图每个地方获得经纬度
      if (coordinate.length > 0) {
        coordinate = [];
        // console.log(coordinate, "2222222222222");
        this.removePolygon();
      }
      map.on("click", function(e) {
        // console.log(e,"eeee");
        coordinate.push(e.lnglat);
      });
      mouseTool.polygon({
        strokeColor: "#FF33FF",
        strokeOpacity: 1,
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillColor: "#1791fc",
        fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        strokeStyle: "solid"
        // strokeStyle是dashed时有效
        // strokeDasharray: [30,10],
      });
    },
    //删除多边形
    removePolygon() {
      map.remove(overlays);
      overlays = [];
      // console.log(mouseTool.polygon);
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
/* 搜索框样式 */
.show {
  background-color: #fff;
}
.show li {
  list-style: none;
  padding: 5px 2px;
  font-size: 13px;
}
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
  /* background-color: #ccc; */
  color: #333;
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 5px;
  overflow: hidden;
  line-height: 20px;
  padding: 0;
}
#tip input[type="text"] {
  height: 100%;
  border: 0;
  width: 280px;
  border-radius: 3px;
  outline: none;
  border: 1px solid silver;
  padding: 8px 0;
  padding-left: 10px;
  font-size: 14px;
  box-shadow: 0 2px 2px rgb (0 0 0 / 15%);
  font-weight: bold;
}
.amap-marker:first-child .amap-icon img {
  width: 28px;
  height: 40px;
}
</style>
