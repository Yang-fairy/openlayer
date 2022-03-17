<template>
  <div>
    <router-link to="/exit">地图修改</router-link>
    <router-link to="/map">画地图</router-link>
    <router-link to="/seemap">地图展示</router-link>
    <router-link to="/fuMap">天气</router-link>
    <router-link to="/openlayer">openleayers</router-link>
    <router-link to="/circle">圆环图11</router-link>
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style>
a{
  font-size: 30px;
  margin-right: 30px;
}
</style>
