<template>
  <div>
    <div id="mapCon" title="地图显示" style="padding: 5px">
      <div id="popup" class="ol-popup" style="z-index: 3">
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content">
          <div class="popup-content-title">1111111111111111111</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import staticMap from "@/assets/1.png";
import { Map, View } from "ol"; //必须引入 地图与视角
import ImageLayer from "ol/layer/Image"; //图片静态资源
import Static from "ol/source/ImageStatic"; //图片静态资源
import Projection from "ol/proj/Projection";
import { getCenter } from "ol/extent"; //获取中心点
import Feature from "ol/Feature"; //放置图标
import Point from "ol/geom/Point"; //找点
import { Icon, Style, Fill } from "ol/style"; //图标icon与样式设置
import VectorSource from "ol/source/Vector"; //矢量容器
import VectorLayer from "ol/layer/Vector"; //点标记
import Overlay from "ol/Overlay";
let overlay = null; //弹框初始化
let closer = null; //弹框关闭
export default {
  data() {
    return {
      imgx: 0, // 当前地图宽
      imgy: 0, // 当前地图高
      tips: false,
    };
  },
  mounted() {
    let img = new Image();
    img.src = staticMap;
    let that = this;
    img.onload = function (res) {
      that.imgx = res.target.width;
      that.imgy = res.target.height;
      // 获取弹出框id
      let container = document.getElementById("popup");
      // console.log(container);
      // 获取关闭弹出框id
      closer = document.getElementById("popup-closer");
      //初始化弹出框
      overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
      that.initMap();
    };
  },
  methods: {
    initMap() {
      let extent = [0, 0, this.imgx, this.imgy]; // 获取图片的宽高
      let projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent: extent,
      });

      // 初始化地图
      var map = new Map({
        target: "mapCon",
        overlays: [overlay], //弹出框

        // layers: [
        // // 设置背景图片
        // new ImageLayer({
        //   source: new Static({
        //     url: staticMap, //地址
        //     imageExtent: extent, //图片大小，必须要给
        //   }),
        // }),
        // ],
        view: new View({
          center: getCenter(extent), //获取中心点
          zoom: 2, //地图缩放
          projection, //必写
        }),
      });
      // 设置平面图
      let layer = new ImageLayer({
        source: new Static({
          url: staticMap, //地址
          imageExtent: extent,
        }),
      });
      map.addLayer(layer);
      //创建矢量容器，当点击时将图标feature放进去
      var iconVector = new VectorSource({
        features: [],
      });

      //在容器上创建图层
      var iconLayer = new VectorLayer({
        source: iconVector,
      });
      //将图层添加到地图上
      map.addLayer(iconLayer);
      var data = [
        { x: 1000, y: 1000, src: "chuan" },
        { x: 2000, y: 2000, src: "ase1" },
      ];
      data.map((item, index) => {
        //添加地图点击标记,创建标记feature
        let iconFeature = new Feature(new Point([item.x, item.y]));
        //标记样式
        iconFeature.setStyle(
          new Style({
            image: new Icon({
              crossOrigin: "anonymous",
              src: require(`@/assets/${item.src}.png`),
              scale: 1,
            }),
          })
        );
        // 给矢量容器添加点标记
        iconVector.addFeature(iconFeature);
      });

      // 地图点击事件
      map.on("click", (e) => {
        console.log(e, "点击地图");
        let coordinate = e.coordinate; //存当前点击位置
        //点击地图上得点标记才触发事件
        map.forEachFeatureAtPixel(e.pixel, function (f) {
          // this.tips = true;
          f.set("sbid", "测试"); //set方法---可在属性中添加额外值
          let sbid = f.get("sbid"); // get方法---也可获取某一个值
          console.log(f, "点击了点标记");
          overlay.setPosition(coordinate); //设备弹出框位置
          // f.setStyle(
          //   //点中某图标更换图片
          //   new Style({
          //     image: new Icon({
          //       crossOrigin: "anonymous",
          //       src: require(`@/assets/con1.png`),
          //       scale: 1.1,
          //     }),
          //   })
          // );
        });
      });
    },
  },
};
</script>

<style scoped>
#mapCon {
  width: 800px;
  height: 800px;
  position: absolute;
  border: 2px solid pink;
}
.ol-popup {
  position: absolute;
  background-color: rgba(30, 172, 247, 0.7);
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(30, 172, 247, 0.7);
  bottom: 12px;
  left: -50px;
  /* min-width: 280px; */
  min-width: 130px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: rgba(30, 172, 247, 0.7);
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: rgba(30, 172, 247, 0.7);
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  color: rgba(30, 172, 247, 0);
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
</style>