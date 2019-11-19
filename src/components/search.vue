<template>
  <div class="search-wrap">
    <div class="search-nav">
      <router-link
        :to="{path:'/' + $store.state.url1 + '/search/qdentrust'}"
        active-class="act-class"
      >当日委托</router-link>
      <router-link
        :to="{path:'/' + $store.state.url1 + '/search/qddeal'}"
        active-class="act-class"
      >当日成交</router-link>
      <router-link
        :to="{path:'/' + $store.state.url1 + '/search/qhentrust'}"
        active-class="act-class"
      >历史委托</router-link>
      <router-link
        :to="{path:'/' + $store.state.url1 + '/search/qhdeal'}"
        active-class="act-class"
      >历史成交</router-link>
      <!-- <router-link
        :to="{path:'/' + $store.state.url1 + '/search/qassets'}"
        active-class="act-class"
      >资产</router-link>-->
      <router-link
        :to="{path:'/' + $store.state.url1 + '/search/qflowing'}"
        active-class="act-class"
      >资金流水</router-link>
      <router-link
        :to="{path:'/' + $store.state.url1 + '/search/qdelivery'}"
        active-class="act-class"
      >交割单</router-link>
      <i class="iconfont icon-zuixiaohua" @click="setShow"></i>
      <div
        class="search-date"
        v-if="$store.state.url3 == 'qhentrust' || $store.state.url3 == 'qhdeal' || $store.state.url3 == 'qflowing' || $store.state.url3 == 'qdelivery'"
      >
        <el-date-picker
          v-model="$store.state.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          ormat="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="selectDate"
        ></el-date-picker>
      </div>
      <div class="seach-flow" v-if="$store.state.url3 == 'qflowing'">
        <el-select
          v-model="$store.state.value"
          @change="changeFolwtype"
          multiple
          collapse-tags
          placeholder="请选择流水类型"
        >
          <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
    </div>
    <div class="search-cont">
      <router-view name="searchView" class="search-view" ref="search"></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      types: [],
      timeout: ""
    };
  },
  mounted() {
    let that = this;
    that.getTypes();
  },
  methods: {
    // 获取流水类型
    getTypes() {
      let that = this;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "record_type"
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            that.types = res.data.data;
          }
        });
    },
    // 选择流水类型
    changeFolwtype() {
      let that = this;
      var types = that.$store.state.value;
      if (that.$store.state.date.length != 0) {
        var start = that.$store.state.date[0];
        var end = that.$store.state.date[1];
      } else {
        var start = "";
        var end = "";
      }
      clearTimeout(that.timeout);
      that.timeout = setTimeout(() => {
        that.$refs.search.getFlows(start, end, types);
      }, 500);
    },
    // 选择时间
    selectDate() {
      let that = this;
      var start = that.$store.state.date[0];
      var end = that.$store.state.date[1];
      if (
        that.$store.state.url3 == "qhentrust" ||
        that.$store.state.url3 == "qhdeal" ||
        that.$store.state.url3 == "qdelivery"
      ) {
        //历史委托 历史成交
        that.$refs.search.getList(start, end);
      } else if (that.$store.state.url3 == "qflowing") {
        //资金流水
        var types = that.$store.state.value;
        that.$refs.search.getFlows(start, end, types);
      }
    },
    //交易模块展示隐藏
    setShow() {
      let that = this;
      that.$store.commit("setShow");
      that.$nextTick(() => {
        var url1 = that.$store.state.url1;
        if (url1 == "line") {
          that.$parent.$refs.stock.openInterval(3);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.search-wrap {
  color: #fff;
  .search-nav {
    width: 100%;
    height: 30px;
    font-size: 0;
    line-height: 0;
    background: #323337;
    a {
      display: inline-block;
      color: #bcbfc4;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      transition: all 0.1s;
      padding: 0 10px;
      vertical-align: middle;
    }
    .act-class,
    a:hover {
      background: #515253;
      color: #fff;
    }
    .iconfont {
      display: inline-block;
      vertical-align: middle;
      float: right;
      font-size: 20px;
      line-height: 29px;
      color: #f2f1f7;
      width: 30px;
      text-align: center;
      margin-left: 50px;
    }
    .iconfont:hover {
      background: #515253;
    }
    .search-date {
      display: inline-block;
      vertical-align: middle;
      height: 30px;
      /deep/.el-range-editor.el-input__inner {
        padding: 0 5px 0 10px;
        width: 240px;
        height: 29px;
        line-height: 29px;
        background-color: #323337;
        border-color: #535353;
        border-radius: 0;
        border-top: none;
        border-bottom: none;
      }
      /deep/.el-date-editor .el-range-input {
        color: #f2f1f7;
        background-color: #323337;
      }
      /deep/.el-date-editor .el-range__icon {
        line-height: 29px;
      }
      /deep/.el-date-editor .el-range-separator {
        width: 20%;
        color: #f2f1f7;
        line-height: 29px;
      }
      /deep/.el-date-editor .el-range__close-icon {
        line-height: 29px;
        color: #f2f1f7;
      }
    }
    .seach-flow {
      display: inline-block;
      vertical-align: middle;
      height: 29px;
      width: 220px;
      /deep/.el-input__inner {
        height: 29px;
        line-height: 29px;
        background-color: #323337;
        border-color: #535353;
        border-radius: 0;
        border-top: none;
        border-bottom: none;
        border-left: none;
      }
      /deep/.el-input__icon {
        line-height: 29px;
      }
      /deep/.el-tag.el-tag--info {
        background-color: #323337;
        border-color: transparent;
        color: #f2f1f7;
      }
    }
  }
  .search-cont {
    .search-view {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
