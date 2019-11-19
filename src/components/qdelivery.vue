<template>
  <div class="qdelivery-wrap">
    <el-table
      class="bshold-table"
      :data="tableData"
      height="270"
      style="width: 100%"
      :cell-class-name="cellStyle"
    >
      <el-table-column fixed width="120" prop="order" label="成交编码" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column fixed width="170" prop="time" label="成交时间"></el-table-column>
      <el-table-column prop="code" label="股票代码" width="100" class-name="gold"></el-table-column>
      <el-table-column prop="name" label="股票名称" width="100" class-name="gold"></el-table-column>
      <el-table-column prop="type" label="操作类型" width="100"></el-table-column>
      <el-table-column prop="price" label="成交价格" width="100"></el-table-column>
      <el-table-column prop="number" label="成交数量" width="100"></el-table-column>
      <el-table-column prop="total" label="成交金额" width="100"></el-table-column>
      <el-table-column prop="number" label="股票余额" width="100"></el-table-column>
      <el-table-column prop="commission" label="佣金" width="100"></el-table-column>
      <el-table-column prop="stamp" label="印花税" width="100"></el-table-column>
      <el-table-column prop="change" label="过户费" width="100"></el-table-column>
      <el-table-column prop="combination" label="信息撮合费" min-width="110"></el-table-column>
      <el-table-column prop="money" label="发生金额" width="100"></el-table-column>
      <el-table-column prop="balance" label="剩余金额" width="100" class-name="text-left"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Qdelivery",
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
    // 获取交割单
    getList(start, end) {
      let that = this;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "fee_log",
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
.qdelivery-wrap {
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
