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
  </div>
</template>

<script>
// import a from '../src/assets/chuan.png'
let map; //地图
export default {
  data() {
    return {
      inputVal: "",
      searchResult: [],
      center: [116.397428, 39.90923],
      center1: [],
      // polyEditor:''
      arr: [
        {
          path: [
            [116.394837, 39.91081],
            [116.396157, 39.910802],
            [116.395813, 39.91039],
          ],
          content: {
            areaname: "16号温室",

            areatype: "温室",

            adress: "北京市昌平区",

            long: "38m",

            width: "7.5m",

            area: "285m2",
          },
        },
        {
          path: [
            [116.391237, 39.910563],
            [116.394853, 39.910481],
            [116.391978, 39.909518],
          ],
          content: {
            areaname: "15号温室",
            areatype: "温室5",
            adress: "北京市昌平区5",
            long: "38m",
            width: "7.5m",
            area: "285m2",
          },
        },
      ],
    };
  },
  methods: {
    init() {
      let arr = this.arr;
      // var windowsArr = [];
      map = new AMap.Map("mapContainer", {
        resizeEnable: true,
        center: this.center, //地图中心点
        zoom: 17, //地图显示的缩放级别
        // layers: [new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()],
        layers: [new AMap.TileLayer.Satellite()], //卫星地图
        keyboardEnable: false,
      });
      // 默认点标记
      var marker = new AMap.Marker({
        icon: new AMap.Icon({
          image: require("../src/assets/chuan.png"),
          // size: new AMap.Size(52, 52), //图标大小
          // imageSize: new AMap.Size(26, 26),
        }),
        position: [116.4, 39.908775],
        offset: new AMap.Pixel(-13, -30),
      });
      marker.setMap(map);
      // 画默认地块(可替换每个城市下的对应地块path)
      arr.map((item, index) => {
        var name = "polygon" + index;
        name = new AMap.Polygon({
          path: item.path,
          strokeColor: "#FF33FF",
          strokeWeight: 6, //线宽
          strokeOpacity: 0.2, // 线条透明度
          fillOpacity: 0.4, //背景色透明度
          fillColor: "#1791fc", // 背景色
          zIndex: 50,
        });
        map.add(name);
        //实例化信息窗体
        var title = item.content.areaname,
          content = [];
        content.push(`类型：${item.content.areatype}`);
        //   使用窗口
        var winname = "infoWindow" + index;
        winname = new AMap.InfoWindow({
          isCustom: true, //使用自定义窗体
          content: this.createInfoWindow(title, content.join("<br/>")),
          offset: new AMap.Pixel(0, -20),
        });
        //鼠标点击marker弹出自定义的信息窗体
        AMap.event.addListener(name, "click", function () {
          winname.open(map, item.path[0]);
          // infoWindow.open(map, polygon.getPosition());
        });

        // 缩放地图到合适的视野级别
        // map.setFitView([polygon]);

        // map.panTo(this.center1);
      });
    },
    //构建自定义信息窗体
    createInfoWindow(title, content) {
      var info = document.createElement("div");
      info.className = "custom-info input-card content-window-card";

      //可以通过下面的方式修改自定义窗体的宽高
      //info.style.width = "400px";
      // 定义顶部标题
      var top = document.createElement("div");
      var titleD = document.createElement("div");
      var closeX = document.createElement("img");
      top.className = "info-top";
      titleD.innerHTML = title;
      closeX.src = "https://webapi.amap.com/images/close2.gif";
      closeX.onclick = this.closeInfoWindow;

      top.appendChild(titleD);
      top.appendChild(closeX);
      info.appendChild(top);

      // 定义中部内容
      var middle = document.createElement("div");
      middle.className = "info-middle";
      middle.style.backgroundColor = "white";
      middle.innerHTML = content;
      info.appendChild(middle);

      // 定义底部内容
      var bottom = document.createElement("div");
      bottom.className = "info-bottom";
      bottom.style.position = "relative";
      bottom.style.top = "0px";
      bottom.style.margin = "0 auto";
      var sharp = document.createElement("img");
      sharp.src = "https://webapi.amap.com/images/sharp.png";
      bottom.appendChild(sharp);
      info.appendChild(bottom);
      return info;
    },
    //关闭信息窗体
    closeInfoWindow() {
      map.clearInfoWindow();
    },
    // 输入框搜索
    changeSearch(e) {
      // console.log(this.inputVal);
      this.$axios({
        method: "get",
        url: "https://restapi.amap.com/v3/assistant/inputtips?",
        params: {
          key: "52ea6dc67932551ab0d35cb597b56365",
          keywords: this.inputVal,
        },
      }).then((res) => {
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
        arr.map((item) => {
          arr1.push(Number(item));
        });
        // console.log(arr1);
        this.center = arr1;
        this.init();
      }
    },
  },
  mounted() {
    this.init();
  },
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

.content-window-card {
  position: relative;
  box-shadow: none;
  bottom: 0;
  left: 0;
  width: auto;
  padding: 0px;
}

.content-window-card p {
  height: 2rem;
}

.custom-info {
  border: solid 1px silver;
}

div.info-top {
  position: relative;
  background: none repeat scroll 0 0 #f9f9f9;
  border-bottom: 1px solid #ccc;
  border-radius: 5px 5px 0 0;
  padding: 0 30px 0 0;
}
div.info-top div {
  display: inline-block;
  color: #333333;
  font-size: 20px;
  font-weight: bold;
  line-height: 31px;
  padding: 0 10px;
}

div.info-top img {
  position: absolute;
  top: 10px;
  right: 10px;
  transition-duration: 0.25s;
}

div.info-top img:hover {
  box-shadow: 0px 0px 5px #000;
}

div.info-middle {
  font-size: 16px;
  padding: 10px 6px;
  line-height: 20px;
}

div.info-bottom {
  height: 0px;
  width: 100%;
  clear: both;
  text-align: center;
}

div.info-bottom img {
  position: relative;
  z-index: 104;
}

span {
  margin-left: 5px;
  font-size: 11px;
}

.info-middle img {
  float: left;
  margin-right: 6px;
}
</style>
