<template>
  <div class="bscapital-wrap">
    <ul>
      <li>
        <span>账户名：</span>
        <span>{{$store.state.username}}</span>
      </li>
      <li>
        <span>总资产：</span>
        <span>{{$store.state.zj.total}}</span>
      </li>
      <li>
        <span>保证金：</span>
        <span>{{$store.state.zj.bond}}</span>
      </li>
      <li>
        <span>亏损比：</span>
        <span>{{$store.state.zj.ratio}}</span>
      </li>
      <li>
        <span>预警线：</span>
        <span>{{$store.state.zj.warning}}</span>
      </li>
      <li>
        <span>强平线：</span>
        <span>{{$store.state.zj.close}}</span>
      </li>
      <li>
        <span>禁开线：</span>
        <span>{{$store.state.zj.prohibit}}</span>
      </li>
      <li>
        <span>持仓市值：</span>
        <span>{{$store.state.zj.market}}</span>
      </li>
    </ul>
    <ul>
      <li>
        <span>平仓盈亏：</span>
        <span>{{$store.state.zj.close_profit}}</span>
      </li>
      <li>
        <span>累计盈亏：</span>
        <span>{{$store.state.zj.total_profit}}</span>
      </li>
      <li>
        <span>浮动盈亏：</span>
        <span>{{$store.state.zj.profit_loss}}</span>
      </li>
      <li>
        <span>配资金额：</span>
        <span>{{$store.state.zj.number}}</span>
      </li>
      <li>
        <span>自有资金：</span>
        <span>{{$store.state.zj.have_bond}}</span>
      </li>
      <li>
        <span>冻结资金：</span>
        <span>{{$store.state.zj.freeze}}</span>
      </li>
      <li>
        <span>可用资金：</span>
        <span>{{$store.state.zj.available}}</span>
      </li>
      <li>
        <span>可取资金：</span>
        <span>{{$store.state.zj.desirable}}</span>
      </li>
    </ul>
    <ul>
      <li>
        <span>配资余额：</span>
        <span>{{$store.state.zj.capital_balance}}</span>
      </li>
      <li>
        <span>占用配资：</span>
        <span>{{$store.state.zj.number}}</span>
      </li>
      <li>
        <span>开仓成本：</span>
        <span>{{$store.state.zj.occupy}}</span>
      </li>
      <li>
        <span>冻结递延费：</span>
        <span>{{$store.state.zj.freeze}}</span>
      </li>
      <li>
        <span>出入金合计：</span>
        <span>{{$store.state.zj.out_in}}</span>
      </li>
      <li>
        <span>占用保证金：</span>
        <span>{{$store.state.zj.occupy_bond}}</span>
      </li>
      <li>
        <span>保证金余额：</span>
        <span>{{$store.state.zj.bond_balance}}</span>
      </li>
      <li>
        <span>T1占用配资：</span>
        <span>{{$store.state.zj.today_capital}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Bscapital",
  data() {
    return {};
  },
  mounted() {
    let that = this;
    that.$store.dispatch("getAccount");
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.bscapital-wrap {
  color: #fff;
  display: flex;
  justify-content: space-between;
  ul {
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 20px 10px 20px 40px;
    flex: 1;
    width: 100%;
    > li {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      > span {
        display: inline-block;
        font-size: 14px;
        line-height: 14px;
        color: #bcbfc4;
      }
    }
  }
  ul:nth-child(2) {
    border-left: 1px solid #535353;
    border-right: 1px solid #535353;
  }
}
</style>
