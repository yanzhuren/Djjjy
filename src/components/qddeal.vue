<template>
  <div class="qddeal-wrap">
    <el-table
      class="bshold-table"
      :data="tableData"
      height="270"
      style="width: 100%"
      :cell-class-name="cellStyle"
    >
      <el-table-column fixed width="120" prop="order" label="成交编码" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column fixed width="170" prop="time" label="成交时间"></el-table-column>
      <el-table-column prop="code" label="股票代码" width="80" class-name="gold"></el-table-column>
      <el-table-column prop="name" label="股票名称" width="90" class-name="gold"></el-table-column>
      <el-table-column prop="type" label="交易方向" width="100"></el-table-column>
      <el-table-column prop="price" label="成交价格" width="100"></el-table-column>
      <el-table-column prop="number" label="成交数量" width="100"></el-table-column>
      <el-table-column prop="total" label="成交金额" width="100"></el-table-column>
      <el-table-column prop="commission" label="佣金" width="100"></el-table-column>
      <el-table-column prop="stamp" label="印花税" width="100"></el-table-column>
      <el-table-column prop="change" label="过户费" width="100"></el-table-column>
      <el-table-column prop="combination" label="信息撮合费" min-width="110" class-name="text-left"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Qddeal",
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
      that.getList();
    }
  },
  mounted() {
    let that = this;
    that.getList();
  },
  methods: {
    // 获取当日成交
    getList() {
      let that = this;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "today_deal_log",
            token: that.$store.state.token
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
.qddeal-wrap {
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
