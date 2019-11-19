<template>
  <div class="bshold-wrap">
    <el-table
      class="bshold-table"
      :data="tableData"
      height="270"
      style="width: 100%"
      :cell-class-name="cellStyle"
      @row-click="rowClick"
      @row-dblclick="dbclick"
    >
      <el-table-column fixed width="80" prop="code" label="股票代码" class-name="gold"></el-table-column>
      <el-table-column fixed width="100" prop="name" label="股票名称" class-name="gold"></el-table-column>
      <el-table-column prop="number" label="总持仓数"></el-table-column>
      <el-table-column prop="surplus" label="可卖数量"></el-table-column>
      <el-table-column prop="frozen" label="冻结数量"></el-table-column>
      <el-table-column prop="price" label="成本价"></el-table-column>
      <el-table-column prop="average" label="成交均价" class-name="color0BE2F4"></el-table-column>
      <el-table-column prop="nowprice" label="当前价" class-name="color0BE2F4"></el-table-column>
      <el-table-column prop="profit" label="浮动盈亏"></el-table-column>
      <el-table-column prop="value" label="持仓市值" class-name="color0BE2F4"></el-table-column>
      <el-table-column prop="radio" label="盈亏比率"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "Bshold",
  data() {
    return {
      tableData: [],
      shorts: [],
      holdData: [],
      timer1: "",
      timer2: ""
    };
  },
  //利用计算属性
  computed: {
    //监听 token变化
    watchToken() {
      return this.$store.state.token;
    }
  },
  //监听执行
  watch: {
    //监听 token变化
    watchToken(val, oldVal) {
      let that = this;
      that.openInterval();
    }
  },
  destroyed() {
    let that = this;
    clearInterval(that.timer1);
    clearInterval(that.timer2);
  },
  mounted() {
    let that = this;
    that.openInterval();
  },
  methods: {
    //双击事件
    dbclick(row, column, event) {
      let that = this;
      var url1 = that.$store.state.url1;
      var url2 = that.$store.state.url2;
      var url3 = that.$store.state.url3;
      if (url1 != "line") {
        if (url3 == "") {
          that.$router.push({ path: "/line/" + url2 });
        } else {
          that.$router.push({ path: "/line/" + url2 + "/" + url3 });
        }
      }
    },
    //单击事件
    rowClick(row, e, col) {
      let that = this;
      that.$store.commit("setActiveShort", row.short);
      that.$parent.openInterval();
      var url1 = that.$store.state.url1;
      if (url1 == "line") {
        that.$parent.$parent.$refs.stock.openInterval();
      }
    },
    openInterval() {
      let that = this;
      clearInterval(that.timer1);
      that.getHold();
      that.timer1 = setInterval(() => {
        that.$store.commit("setIstrade"); //判断是否在交易时间段
        if (that.$store.state.isTrade == 1) {
          that.getHold();
        }
      }, 10000);
    },
    getHold() {
      let that = this;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "depot_stock",
            token: that.$store.state.token
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            if (res.data.data.length != 0) {
              var shorts = [];
              $.each(res.data.data, function(index, item) {
                shorts.push(item.short);
              });
              that.shorts = shorts;
              that.holdData = res.data.data;
              that.getStockInfo(that.shorts, that.holdData);
              clearInterval(that.timer2);
              that.timer2 = setInterval(() => {
                that.$store.commit("setIstrade"); //判断是否在交易时间段
                if (that.$store.state.isTrade == 1) {
                  that.getStockInfo(that.shorts, that.holdData);
                }
              }, 1000);
            } else {
              clearInterval(that.timer2);
              that.tableData = [];
              that.shorts = [];
              that.holdData = [];
            }
          }
        });
    },
    getStockInfo(shorts, data) {
      let that = this;
      var list = [];
      $.ajax({
        cache: true,
        url: "http://qt.gtimg.cn/q=" + shorts.toString(),
        type: "GET",
        dataType: "script",
        success: function() {
          $.each(data, function(index, item) {
            var elements = eval("v_" + item.short).split("~");
            var profit =
              (Number(elements[3]) - Number(item.price)) * item.surplus;
            var value =
              Math.round(Number(item.average) * item.surplus * 100) / 100; //持仓市值

            var radio =
              Math.round(
                ((Number(elements[3]) - Number(item.price)) /
                  Number(item.price)) *
                  10000
              ) / 100; //盈亏比率
            item["nowprice"] = elements[3]; //最新价
            item["profit"] = Math.round(Number(profit) * 100) / 100; //浮动盈亏
            item["value"] = value; //持仓市值
            item["radio"] = radio + "%"; //盈亏比例
            list.push(item);
          });
          that.tableData = list;
        }
      });
    },
    // 行情列表的颜色
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 8 || columnIndex == 10) {
        if (row.profit > 0) {
          return "red";
        } else if (row.profit < 0) {
          return "green";
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.bshold-wrap {
  .bshold-table {
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
