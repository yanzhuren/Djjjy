<template>
  <div class="cancel-wrap">
    <div class="cancel-btns">
      <el-button class="buy-canbtn" @click="cancel" :loading="disabled1">撤单</el-button>
      <el-button class="buy-canbtn" @click="cancelAll" :loading="disabled2">全撤</el-button>
      <i class="iconfont icon-zuixiaohua" @click="setShow"></i>
    </div>
    <div class="cancel-cont">
      <el-table
        class="bshold-table"
        :data="tableData"
        height="270"
        style="width: 100%"
        @row-click="rowclick"
        :row-class-name="rowStyle"
        :cell-class-name="cellStyle"
      >
        <el-table-column :show-overflow-tooltip="true" fixed width="120" prop="order" label="委托编码"></el-table-column>
        <el-table-column fixed width="170" prop="time" label="委托时间"></el-table-column>
        <el-table-column prop="code" width="80" label="股票代码" class-name="gold"></el-table-column>
        <el-table-column prop="name" width="90" label="股票名称" class-name="gold"></el-table-column>
        <el-table-column prop="type" width="80" label="委托方向"></el-table-column>
        <el-table-column prop="price" width="80" label="委托价格"></el-table-column>
        <el-table-column prop="number" width="80" label="委托数量"></el-table-column>
        <el-table-column prop="finish" width="80" label="成交数量"></el-table-column>
        <el-table-column
          prop="status"
          min-width="200"
          label="委托状态"
          class-name="color0BE2F4 text-left"
          :show-overflow-tooltip="true"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      tableData: [],
      disabled1: false,
      disabled2: false
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
      that.getEnstrust();
    }
  },
  mounted() {
    let that = this;
    that.getEnstrust();
  },
  methods: {
    // 撤单
    cancel() {
      let that = this;
      if (that.$store.state.enstrustid == "") {
        that.$message({
          message: "请先选择订单",
          type: "warning",
          duration: 1000
        });
      } else {
        that.disabled1 = true;
        setTimeout(() => {
          that.disabled1 = false;
        }, 3000);
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "cancel_entrust",
              token: that.$store.state.token,
              order: that.$store.state.enstrustid
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              that.$refs.enstrust.getEnstrust();
              that.$store.state.enstrustid = "";
              that.$message({
                message: res.data.msg,
                type: "success",
                duration: 1000
              });
            }
          });
      }
    },
    // 全部撤单
    cancelAll() {
      let that = this;
      that
        .$confirm("是否确定删除所有委托单?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          that
            .$http({
              url: "/",
              method: "post",
              data: {
                nozzle: "cancel_all_entrust",
                token: that.$store.state.token
              }
            })
            .then(function(res) {
              if (res.data.code == 1) {
                that.$refs.enstrust.getEnstrust();
                that.$store.state.enstrustid = "";
                that.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 1000
                });
              }
            });
        })
        .catch(() => {});
    },
    //获取委托
    getEnstrust(short) {
      let that = this;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "cancel_entrust_log",
            token: that.$store.state.token
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            that.tableData = res.data.data;
          }
        });
    },
    rowclick(row, e, col) {
      let that = this;
      that.$store.state.enstrustid = row.id;
    },
    // 行情 横行 样式
    rowStyle({ row, rowIndex }) {
      if (this.$store.state.enstrustid == row.id) {
        return "act-style";
      } else {
        return "";
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 4) {
        if (row.type == "买入") {
          return "red";
        } else if (row.type == "卖出") {
          return "green";
        }
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
.cancel-wrap {
  .cancel-btns {
    padding-left: 30px;
    height: 30px;
    width: 100%;
    font-size: 0;
    line-height: 0;
    border-bottom: 1px solid #535353;
    background: #323337;
    .buy-canbtn {
      font-size: 14px;
      line-height: 29px;
      border: none;
      width: 90px;
      text-align: center;
      color: #f2f1f7;
      background: #515253;
      padding: 0;
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
  }
  .cancel-cont {
    width: 100%;
    height: calc(100% - 30px);
    overflow: hidden;
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
}
</style>
