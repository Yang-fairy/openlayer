<template>
  <div class="h-3" style="position: relative">
    <video src="../static/2.mp4" class="video" autoplay loop muted ></video>
    <!--弹窗-->
    <div class="layer" ref="layer" :style="styles">
      <div class="content">
        <p style="color: #fff">LPL夏季赛({{ name }})</p>
      </div>
    </div>
    <div
      ref="myEchart"
      style="width: 800px; height: 800px; margin: 0 auto"
    ></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts"; //echarts
import "../node_modules/echarts/map/js/hubei.js"; //对应的省份
import "echarts-gl"; //3D地图插件
export default {
  data() {
    return {
      layerList: [],
      styles: {
        left: null,
        top: null,
      },
      name: "11111111111",
      options: {
        series: [
          {
            type: "map3D",
            name: "湖北",
            selectedMode: "single", //地图高亮单选
            boxDepth: 80, //地图倾斜度
            regionHeight: 8, //地图高度
            map: "湖北",
            viewControl: {
              distance: 150, //地图视角 控制初始大小
              rotateSensitivity: 0, //禁止旋转
              zoomSensitivity: 0, //禁止缩放
            },
            label: {
              show: true, //是否显示市
              textStyle: {
                color: "#55E2FE", //文字颜色
                // color: "#55E2FE", //文字颜色
                fontSize: 12, //文字大小
                backgroundColor: "rgba(0,0,0,0)", //透明度0清空文字背景
              },
            },
            itemStyle: {
              color: "#213965", //地图颜色
              borderWidth: 3, //分界线wdith
              borderColor: "#5CCBEA", //分界线颜色
              opacity: 0.4,
            },
            emphasis: {
              label: {
                show: true, //是否显示高亮
                textStyle: {
                  color: "#fff", //高亮文字颜色
                },
              },
              itemStyle: {
                color: "#4CDBFC", //地图高亮颜色
                opacity: 1,
              },
            },
            //高亮市区  echarts  bug 不生效
            data: [
              {
                name: "宜昌市",
                itemStyle: {
                  // 单个区域的样式设置
                  color: "#4CDBFC",  //单个区域高亮颜色
                  opacity: 1,
                  borderWidth: 0.4,
                  borderColor: "#0489d6",
                },
                label: {
                  show: true, //是否显示高亮
                  textStyle: {
                    color: "#fff", //高亮文字颜色
                  },
                },
              },
            ],
          },
        ],
      },
    };
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.myEchart);
    this.myChart.setOption(this.options);
    //echarts自适应
    window.onresize = this.myChart.resize;
    let than = this;
    //绑定市区点击事件
    this.myChart.on("click", function (e) {
      //防止重复点击
      if (than.name == e.name) {
        return false;
      }
      than.options.series[0].data[0].name = e.name;
      than.myChart.setOption(than.options);
      than.styles.left = e.event.event.offsetX - 40 + "px"; //-132 根据布局计算偏移量
      than.styles.top = e.event.event.offsetY + 80 + "px"; //80根据布局计算偏移量
      console.log(than.styles, "styles");
      than.name = e.name;
      //请求后台接口获取对应数据 ---此处模拟
      //   than.tabsChange(than.btn[0]);
    });
  },
};
</script>

<style>
.h-3 {
  background-color: #000;
}
.video{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
/*懒加载图标动画*/
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
/*弹窗样式*/
.layer {
  position: absolute;
  left: 400px;
  top: 300px;
  z-index: 100;
  width: 360px;
  height: 280px;
  background: rgba(10, 22, 64, 0.9);
  border-radius: 5px;
  border: 1px solid #122253;
  transform: translate(-100%, -100%);
}
.content {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
}
.conten p {
  font-size: 20px;
  color: #fff;
  line-height: 50px;
}
.col-item {
  height: 41px;
  margin-top: 20px;
  border-right: 1px solid #172353;
}
.col-item.num {
  color: #ebf8ff;
  font-size: 18px;
}
.col-item.text {
  color: #507ebc;
  font-size: 12px;
}
.content::after {
  content: "";
  width: 120px;
  height: 2px;
  background: #ffccff;
  position: absolute;
  right: -120px;
  top: 50%;
  transform: translateY(-50%);
}
.content::before {
  content: "";
  width: 2px;
  height: 80px;
  background: #ffb800;
  position: absolute;
  right: -134px;
  top: 136px;
  transform: rotateZ(-20deg);
}
</style>