<template>
  <div class="qhentrust-wrap">
    <el-table
      class="bshold-table"
      :data="tableData"
      height="270"
      style="width: 100%"
      :cell-class-name="cellStyle"
    >
      <el-table-column fixed width="120" prop="order" :show-overflow-tooltip="true" label="委托编码"></el-table-column>
      <el-table-column fixed width="170" prop="time" label="委托时间"></el-table-column>
      <el-table-column prop="code" label="股票代码" width="80" class-name="gold"></el-table-column>
      <el-table-column prop="name" label="股票名称" width="90" class-name="gold"></el-table-column>
      <el-table-column prop="type" label="委托方向" width="80"></el-table-column>
      <el-table-column prop="price" label="委托价格" width="80"></el-table-column>
      <el-table-column prop="number" label="委托数量" width="80"></el-table-column>
      <el-table-column prop="finish" label="成交数量" width="80"></el-table-column>
      <el-table-column prop="cancel" label="撤单数量" width="80"></el-table-column>
      <el-table-column prop="frozen" label="冻结总资金" width="100"></el-table-column>
      <el-table-column prop="mold" label="下单类型" width="80"></el-table-column>
      <el-table-column
        prop="status"
        label="委托状态"
        min-width="110"
        class-name="color0BE2F4 text-left"
        :show-overflow-tooltip="true"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Qhentrust",
  data() {
    return {
      tableData: []
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
      if (that.$store.state.date.length != 0) {
        var start = that.$store.state.date[0];
        var end = that.$store.state.date[1];
      } else {
        var start = "";
        var end = "";
      }
      that.getList(start, end);
    }
  },
  mounted() {
    let that = this;
    that.getList("", "");
  },
  methods: {
    // 获取历史委托
    getList(start, end) {
      let that = this;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "history_entrust_log",
            token: sessionStorage.getItem("token"),
            start: start,
            end: end
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            that.tableData = res.data.data;
          }
        });
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 4) {
        if (row.type == "买入") {
          return "red";
        } else if (row.type == "卖出") {
          return "green";
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.qhentrust-wrap {
  .bshold-table {
    /deep/.el-table__header-wrapper{
      background: #25262a;
    }
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
