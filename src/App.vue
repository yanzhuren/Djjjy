<template>
  <div id="app">
    <router-view class="app-wrap"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  watch: {
    $route(to, from) {
      let that = this;
      var path = to.path.split("/");
      that.$store.commit("setUrl", path);
    }
  },
  mounted() {
    let that = this;
    var path = that.$route.path.split("/");
    that.$store.commit("setUrl", path);
  },
  methods: {}
};
</script>
<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  .app-wrap {
    width: 100%;
    height: 100%;
  }
}
</style>
