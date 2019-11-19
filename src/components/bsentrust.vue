<template>
  <div class="bsentrust-wrap">
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
</template>

<script>
export default {
  name: "Bsentrust",
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
      that.getEnstrust();
    }
  },
  mounted() {
    let that = this;
    that.getEnstrust();
  },
  methods: {
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
    }
  }
};
</script>
<style lang="less" scoped>
.bsentrust-wrap {
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
