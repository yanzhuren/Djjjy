<template>
  <div class="stock-wrap" ref="allheight" @mousewheel="scroll">
    <el-table
      class="stock-table"
      :data="tableData"
      style="width: 100%"
      height="100%"
      @row-dblclick="dbclick"
      @row-click="rowClick"
      @row-contextmenu="rightClick"
      :row-class-name="rowStyle"
      :cell-class-name="cellStyle"
      ref="dragTable"
      row-key="index"
    >
      <el-table-column fixed prop="index" label="序号" width="80"></el-table-column>
      <el-table-column fixed prop="code" label="代码" width="80" class-name="gold"></el-table-column>
      <el-table-column fixed prop="name" label="名称" width="90" class-name="gold"></el-table-column>
      <el-table-column fixed prop="upratio" label="涨幅%" width="80"></el-table-column>
      <el-table-column prop="price" label="最新价" width="80"></el-table-column>
      <el-table-column prop="up" label="涨跌" width="80"></el-table-column>
      <el-table-column prop="buyprice" label="买价" width="80"></el-table-column>
      <el-table-column prop="sellprice" label="卖价" width="80"></el-table-column>
      <el-table-column prop="buyvolum" label="买量" width="80" class-name="red"></el-table-column>
      <el-table-column prop="sellvolum" label="卖量" width="80" class-name="green"></el-table-column>
      <el-table-column prop="volum" label="总手" width="100" class-name="color0BE2F4"></el-table-column>
      <el-table-column prop="close" label="昨收" width="80"></el-table-column>
      <el-table-column prop="open" label="开盘" width="80"></el-table-column>
      <el-table-column prop="heigh" label="最高" width="80" class-name="red"></el-table-column>
      <el-table-column prop="low" label="最低" width="80" class-name="green"></el-table-column>
      <el-table-column prop="zf" label="振幅%" width="80"></el-table-column>
      <el-table-column prop="money" label="成交额" width="100" class-name="color0BE2F4"></el-table-column>
      <el-table-column prop="value" label="总市值" min-width="100" class-name="gold text-left"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Stock",
  data() {
    return {
      allshorts: [],
      tableData: [],
      shorts: [],
      timeout: "",
      timer: ""
    };
  },
  //利用计算属性
  computed: {
    //监听 交易模块显示隐藏
    watchShow() {
      return this.$store.state.showbottom;
    }
  },
  //监听执行
  watch: {
    watchShow(val, oldVal) {
      let that = this;
      that.setShorts(1);
    },
    shorts: function(newVal) {
      let that = this;
      clearInterval(that.timer);
      if (that.shorts.length != 0) {
        that.openInterval();
      } else {
        that.tableData = [];
      }
    },
    immediate: true,
    deep: true
  },
  destroyed() {
    let that = this;
    clearInterval(that.timer);
  },
  mounted() {
    let that = this;
    that.setShorts(1);
  },
  methods: {
    openInterval() {
      let that = this;
      clearInterval(that.timer);
      that.hqHttp(that.shorts);
      that.timer = setInterval(() => {
        that.$store.commit("setIstrade");
        if (that.$store.state.isTrade == 1) {
          that.hqHttp(that.shorts);
        }
      }, 1000);
    },
    rightClick(row, column, e) {
      e.returnValue = false;
      let that = this;
      if (that.$parent.type == 5) {
        var allIndex = row.index - 1;
        var shortIndex1 = Number(that.$store.state.shortIndex1);
        if (allIndex != shortIndex1) {
          // 修改总数组
          var clickShort = that.$store.state.selfshorts.splice(allIndex, 1)[0];
          that.$store.state.selfshorts.splice(shortIndex1, 0, clickShort);
          var selfshorts = that.$store.state.selfshorts;
          window.localStorage.setItem("zsshorts", JSON.stringify(selfshorts));
          //修改当前页数组
          var itemIndex = row.item;
          that.shorts.splice(itemIndex, 1);
          that.shorts.splice(0, 0, clickShort);
        }
      }
    },
    //单击事件
    rowClick(row, e, col) {
      let that = this;
      console.log(row.short);
      that.$store.commit("setActiveShort", row.short);
      var url2 = that.$store.state.url2;
      if (url2 == "buy" || url2 == "sell") {
        that.$parent.$refs.nav2.openInterval();
      }
    },
    //双击事件
    dbclick(row, column, event) {
      let that = this;
      var url2 = that.$store.state.url2;
      var url3 = that.$store.state.url3;
      if (url3 == "") {
        that.$router.push({ path: "/line/" + url2 });
      } else {
        that.$router.push({ path: "/line/" + url2 + "/" + url3 });
      }
    },
    // 滚轮事件
    scroll() {
      let that = this;
      var value = event.wheelDelta; // >0 上一页 < 0下一页
      var type = value > 0 ? 3 : 2;
      that.setShorts(type);
    },
    //type 1:显示 不改变startIndex 2：下一页 改变startIndex 3：上一页
    setShorts(type) {
      let that = this;
      var allshorts;
      if (that.$parent.type == 1) {
        allshorts = that.$store.state.zsshorts;
      } else if (that.$parent.type == 2) {
        allshorts = that.$store.state.hsshorts;
      } else if (that.$parent.type == 3) {
        allshorts = that.$store.state.zxbshorts;
      } else if (that.$parent.type == 4) {
        allshorts = that.$store.state.cybshorts;
      } else if (that.$parent.type == 5) {
        allshorts = that.$store.state.selfshorts;
      }
      var allheight = that.$refs.allheight.offsetHeight - 38; //内容高度
      var cellheight = 30; //表格高度
      var nums = Math.floor(allheight / cellheight);
      if (allshorts.length == 0) {
        var startIndex = 0;
        var endIndex = 0;
      } else {
        if (type == 1) {
          var startIndex = that.$store.state.shortIndex1;
          var endIndex = startIndex + nums;
        } else if (type == 2) {
          //判断是否到达下标最大值
          if (that.$store.state.shortIndex2 >= allshorts.length) {
            var startIndex = that.$store.state.shortIndex1;
            var endIndex = startIndex + nums;
          } else {
            var startIndex = that.$store.state.shortIndex2;
            var endIndex = startIndex + nums;
          }
        } else if (type == 3) {
          // 判断是否到达0下标
          if (that.$store.state.shortIndex1 - nums < 0) {
            var startIndex = 0;
            var endIndex = startIndex + nums;
          } else {
            var startIndex = that.$store.state.shortIndex1 - nums;
            var endIndex = that.$store.state.shortIndex1;
          }
        }
      }
      var indexInfo = {
        shortIndex1: startIndex,
        shortIndex2: endIndex
      };
      that.$store.commit("setShortIndex", indexInfo);
      clearTimeout(that.timeout);
      clearInterval(that.timer);
      that.timeout = setTimeout(() => {
        that.shorts = allshorts.slice(startIndex, endIndex);
      }, 100);
    },
    //行情数据 请求
    hqHttp(shorts) {
      let that = this;
      $.ajax({
        cache: true,
        url: "http://qt.gtimg.cn/q=" + shorts.toString(),
        type: "GET",
        dataType: "script",
        success: function() {
          var arr = [];
          var shortIndex1 = that.$store.state.shortIndex1;
          $.each(shorts, function(index, item) {
            var index1 = index + 1 + shortIndex1;
            var elements = eval("v_" + item).split("~");
            var obj = {
              index: index1,
              item: index,
              short: item,
              code: elements[2],
              name: elements[1],
              upratio: elements[32],
              price: elements[3],
              up: elements[31],
              buyprice: elements[9],
              sellprice: elements[19],
              buyvolum: elements[10],
              sellvolum: elements[20],
              volum: that.setValum(elements[6]),
              close: elements[4],
              open: elements[5],
              heigh: elements[33],
              low: elements[34],
              zf: elements[43],
              money: that.setValu(elements[37]),
              value: elements[45] || "--"
            };
            arr.push(obj);
          });
          that.tableData = arr;
        }
      });
    },
    //设置j价值人民币单位
    setValu(value) {
      var value = Number(value);
      if (value >= 100000 && value < 100000000) {
        var num = (value / 10000).toFixed(2) + "亿";
        return num;
      } else if (value >= 100000000) {
        var num = (value / 100000000).toFixed(2) + "万亿";
        return num;
      } else {
        return value;
      }
    },
    //设置数量单位
    setValum(value) {
      var value = Number(value);
      if (value >= 100000 && value < 100000000) {
        var num = (value / 10000).toFixed(2) + "万";
        return num;
      } else if (value >= 100000000) {
        var num = (value / 100000000).toFixed(2) + "亿";
        return num;
      } else {
        return value;
      }
    },
    // 行情 横行 样式
    rowStyle({ row, rowIndex }) {
      if (this.$store.state.activestock == row.short) {
        return "act-style";
      } else {
        return "";
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex == 3 ||
        columnIndex == 4 ||
        columnIndex == 5 ||
        columnIndex == 6 ||
        columnIndex == 7
      ) {
        if (row.up > 0) {
          return "red";
        } else if (row.up < 0) {
          return "green";
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.stock-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .stock-table {
    /deep/.cell {
      line-height: 29px;
    }
    /deep/th,
    /deep/td {
      padding: 0;
      text-align: center;
      color: #bcbfc4;
    }
    /deep/th {
      background: #25262a;
      font-weight: 100;
    }
    /deep/td {
      background: #1c1d21;
      border-color: #434343;
    }
    /deep/thead tr th {
      color: #bcbfc4 !important;
    }
    /deep/th {
      border-color: #25262a;
    }
    /deep/tr {
      border-color: #434343;
    }
    /deep/.el-table__body-wrapper {
      background: #1c1d21;
    }
  }
}
</style>
