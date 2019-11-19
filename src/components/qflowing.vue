<template>
  <div class="qflowing-wrap">
    <el-table
      class="bshold-table"
      :cell-class-name="cellStyle"
      :data="tableData"
      height="270"
      style="width: 100%"
      id="download"
    >
      <el-table-column width="100" prop="account" label="用户名"></el-table-column>
      <el-table-column width="100" prop="number" label="资金变动"></el-table-column>
      <el-table-column prop="bond" label="保证金余额（前）" width="140" class-name="gold"></el-table-column>
      <el-table-column prop="balance_bond" label="保证金余额（后）" width="140"></el-table-column>
      <el-table-column prop="capital_number" label="配资余额（前）" width="140"></el-table-column>
      <el-table-column prop="capital_balance" label="配资余额（后）" width="140"></el-table-column>
      <el-table-column prop="time" label="变动时间" width="170"></el-table-column>
      <el-table-column
        prop="name"
        label="变动类型"
        width="150"
        class-name="gold text-left"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="remake"
        label="变动原因"
        class-name="text-left"
        min-width="300"
        :show-overflow-tooltip="true"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  name: "Qflowing",
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
      var types = that.$store.state.value;
      that.getFlows(start, end, types);
    }
  },
  mounted() {
    let that = this;
    that.getFlows("", "", []);
  },
  methods: {
    //获取资金流水
    getFlows(start, end, types) {
      let that = this;
      if (types.length == 0) {
        var typeStr = "";
      } else {
        var typeStr = types.toString();
      }
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "capital_record",
            token: sessionStorage.getItem("token"),
            start: start,
            end: end,
            type: typeStr
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            if (res.data.data.length == 0) {
              that.tableData = res.data.data;
            } else {
              var tableData = [];
              $.each(res.data.data, function(index, item) {
                item["account"] = that.$store.state.username;
                tableData.push(item);
              });
              that.tableData = tableData;
            }
          }
        });
    },
    // 导出
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#download")); // id
      console.log(wb);
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "sheetjs.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    // 行情列表的颜色
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 1) {
        if (row.number > 0) {
          return "red";
        } else if (row.number < 0) {
          return "green";
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.qflowing-wrap {
  .bshold-table {
    /deep/.cell {
      line-height: 29px;
    }
    /deep/.el-table__header-wrapper {
      background: #25262a;
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
      background: #1c1d21 !important;
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
