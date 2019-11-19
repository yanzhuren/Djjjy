<template>
  <div class="buy-wrap">
    <div class="buy-session1">
      <p class="buy-name">买入股票：{{name}}</p>
      <div class="buy-inbox">
        <span>股票代码：</span>
        <input type="tel" v-model="code" maxlength="6" @input="inputCode" />
      </div>
      <div class="buy-inbox">
        <span>委托价格：</span>
        <input
          class="buy-price"
          type="number"
          v-model="price"
          :readonly="checked"
          @input="priceInput"
        />
        <div class="buy-check">
          <el-checkbox v-model="checked" @change="checkedChange">市价</el-checkbox>
        </div>
      </div>
      <div class="buy-inbox">
        <span>可用资金：</span>
        <input type="text" readonly v-model="$store.state.zj.available" />
      </div>
      <div class="buy-inbox">
        <span>可买数量：</span>
        <input type="text" readonly v-model="allnum" />
      </div>
      <div class="buy-ratio">
        <el-radio v-model="radio" label="1" @change="changeratio">全部</el-radio>
        <el-radio v-model="radio" label="2" @change="changeratio">1/2</el-radio>
        <el-radio v-model="radio" label="3" @change="changeratio">1/3</el-radio>
        <el-radio v-model="radio" label="4" @change="changeratio">1/4</el-radio>
      </div>
      <div class="buy-inbox">
        <span>买入数量：</span>
        <input type="number" v-model="buynum" @input="buynumInput" />
      </div>
      <div class="buy-btns">
        <el-button type="primary" class="buy-btn1" @click="fuwei">复位</el-button>
        <el-button
          type="primary"
          class="buy-btn2"
          @click="buyIn"
          :disabled="disabled"
          :loading="disabled"
        >买入</el-button>
      </div>
    </div>
    <div class="buy-session2">
      <ul>
        <li v-for="(item,index) in sellArr" :key="index">
          <span>{{item.name}}</span>
          <span class="red">{{item.price}}</span>
          <span class="green">{{item.num}}</span>
        </li>
      </ul>
      <ul>
        <li v-for="(item,index) in buyArr" :key="index">
          <span>{{item.name}}</span>
          <span class="red">{{item.price}}</span>
          <span class="green">{{item.num}}</span>
        </li>
      </ul>
    </div>
    <div class="buy-session3">
      <div class="buy-nav">
        <router-link
          :to="{path:'/' + $store.state.url1 + '/buy/bshold'}"
          active-class="act-class"
        >持仓</router-link>
        <router-link
          :to="{path:'/' + $store.state.url1 + '/buy/bsentrust'}"
          active-class="act-class"
        >委托</router-link>
        <router-link
          :to="{path:'/' + $store.state.url1 + '/buy/bsdeal'}"
          active-class="act-class"
        >成交</router-link>
        <router-link
          :to="{path:'/' + $store.state.url1 + '/buy/bscapital'}"
          active-class="act-class"
        >资金</router-link>
        <i class="iconfont icon-zuixiaohua" @click="setShow"></i>
        <div class="buy-canbtns" v-if="$store.state.url3 == 'bsentrust'">
          <el-button class="buy-canbtn" @click="cancel" :loading="disabled1">撤单</el-button>
          <el-button class="buy-canbtn" @click="cancelAll" :loading="disabled2">全撤</el-button>
        </div>
      </div>
      <div class="buy-view">
        <router-view name="buyView" class="buy-views" ref="enstrust"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Buy",
  data() {
    return {
      checked: false,
      radio: 0,
      sellArr: [
        {
          name: "卖五",
          price: "--",
          num: "--"
        },
        {
          name: "卖四",
          price: "--",
          num: "--"
        },
        {
          name: "卖三",
          price: "--",
          num: "--"
        },
        {
          name: "卖二",
          price: "--",
          num: "--"
        },
        {
          name: "卖一",
          price: "--",
          num: "--"
        }
      ],
      buyArr: [
        {
          name: "买一",
          price: "--",
          num: "--"
        },
        {
          name: "买二",
          price: "--",
          num: "--"
        },
        {
          name: "买三",
          price: "--",
          num: "--"
        },
        {
          name: "买四",
          price: "--",
          num: "--"
        },
        {
          name: "买五",
          price: "--",
          num: "--"
        }
      ],
      name: "--",
      code: "",
      price: "",
      allnum: "", //可买数量
      buynum: "", //买入数量
      timer: "", //计时器
      disabled: false,
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
      setTimeout(() => {
        that.openInterval();
      }, 500);
    }
  },
  destroyed() {
    let that = this;
    clearInterval(that.timer);
  },
  mounted() {
    let that = this;
    that.openInterval();
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
    // 买入
    buyIn() {
      let that = this;
      if (that.price == "") {
        that.$message({
          message: "请输入委托价格",
          type: "warning",
          duration: 1000
        });
      } else {
        that.disabled = true;
        setTimeout(() => {
          that.disabled = false;
        }, 3000);
        var mold = that.checked ? 2 : 1;
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "trade_buy",
              token: that.$store.state.token,
              code: that.code,
              price: that.price,
              number: that.buynum,
              mold: mold
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              that.$store.dispatch("getAccount");
              that.openInterval();
              if (that.$store.state.url3 == "bshold") {
                //持仓
                that.$refs.enstrust.openInterval();
              } else if (that.$store.state.url3 == "bsentrust") {
                //委托
                that.$refs.enstrust.getEnstrust();
              } else if (that.$store.state.url3 == "bsdeal") {
                //成交
                that.$refs.enstrust.getList();
              }
              that.$message({
                message: res.data.msg,
                type: "success",
                duration: 1000
              });
            }
          });
      }
    },
    // 复位
    fuwei() {
      let that = this;
      that.checked = false;
      that.radio = 0;
      that.openInterval();
    },
    // 市价限价切换
    checkedChange() {
      let that = this;
      that.openInterval();
    },
    // 调用计时器
    openInterval() {
      let that = this;
      clearInterval(that.timer);
      that.getStockInfo(that.$store.state.activestock, 1);
      that.timer = setInterval(() => {
        that.$store.commit("setIstrade"); //判断是否在交易时间段
        if (that.$store.state.isTrade == 1) {
          that.getStockInfo(that.$store.state.activestock, 2);
        }
      }, 1000);
    },
    //输入代码短语
    inputCode() {
      let that = this;
      if (that.code.length == 6) {
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "query_stock",
              code: that.code
            }
          })
          .then(function(res) {
            if (res.data.code == 1 && res.data.data != 0) {
              that.$store.commit("setActiveShort", res.data.data);
              that.openInterval();
              var url1 = that.$store.state.url1;
              if (url1 == "line") {
                that.$parent.$refs.stock.openInterval();
              }
            } else {
              that.$message("股票代码不存在！");
              that.openInterval();
            }
          });
      }
    },
    //输入价格
    priceInput() {
      let that = this;
      if (that.price == "" || Number(that.price) == 0) {
        that.allnum = "";
      } else {
        var available = that.$store.state.zj.available;
        that.allnum =
          parseInt(Number(available) / Number(that.price) / 100) * 100;
      }
    },
    //输入购买数量
    buynumInput() {
      this.radio = 0;
    },
    //改变购买比例
    changeratio() {
      let that = this;
      that.buynum =
        Math.round(Number(that.allnum) / Number(that.radio) / 100) * 100;
    },
    // type 1:第一次调用 2：轮询调用
    getStockInfo(short, type) {
      let that = this;
      if (short != "") {
        $.ajax({
          cache: true,
          url: "http://qt.gtimg.cn/q=" + short,
          type: "GET",
          dataType: "script",
          success: function() {
            var elements = eval("v_" + short).split("~");
            $.each(that.buyArr, function(index, item) {
              item.price = elements[index * 2 + 9];
              item.num = elements[index * 2 + 10];
            });
            $.each(that.sellArr, function(index, item) {
              item.price = elements[27 - index * 2];
              item.num = elements[28 - index * 2];
            });
            if (that.checked == true) {
              that.price = elements[3];
            } else if (that.checked == false && type == 1) {
              that.price = elements[19];
            }

            if (type == 1) {
              that.code = elements[2];
              that.buynum = 100;
              that.name = elements[1];
              that.radio = 0;
            }
            var available = that.$store.state.zj.available;
            if (
              available == "--" ||
              Number(available) <= 0 ||
              that.price == "" ||
              that.price == 0
            ) {
              that.allnum = "";
            } else {
              that.allnum =
                parseInt(Number(available) / Number(that.price) / 100) * 100;
            }
          }
        });
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
.buy-wrap {
  display: flex;
  justify-content: space-between;
  .buy-session1 {
    width: 235px;
    height: 100%;
    overflow: hidden;
    padding: 0 10px;
    .buy-name {
      text-align: center;
      font-size: 16px;
      line-height: 17px;
      color: #ce2c30;
      padding: 15px 0;
    }
    .buy-inbox {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      > span {
        display: inline-block;
        font-size: 14px;
        line-height: 25px;
        width: 70px;
        color: #bcbfc4;
      }
      > input {
        width: calc(100% - 70px);
        height: 25px;
        border: 1px solid #434343;
        font-size: 14px;
        line-height: 25px;
        color: #bcbfc4;
        padding-left: 10px;
        background: #1c1d21;
      }
      .buy-check {
        width: 60px;
        text-align: right;
        /deep/.el-checkbox__label {
          line-height: 25px;
          color: #bcbfc4 !important;
          padding-left: 5px;
        }
      }
      .buy-price {
        width: calc(100% - 130px);
      }
    }
    .buy-ratio {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      /deep/.el-radio {
        margin-right: 0;
      }
      /deep/.el-radio__label {
        padding-left: 5px;
      }
    }
    .buy-btns {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .buy-btn1 {
        padding: 0;
        text-align: center;
        width: 80px;
        color: #ffffff;
        height: 30px;
        border: none;
        background: #515253;
        font-size: 14px;
        line-height: 30px;
        border-radius: 15px;
      }
      .buy-btn2 {
        padding: 0;
        text-align: center;
        width: 115px;
        color: #ffffff;
        height: 30px;
        border: none;
        background: #ce2c30;
        font-size: 14px;
        line-height: 30px;
        border-radius: 15px;
      }
    }
  }
  .buy-session2 {
    width: 210px;
    height: 100%;
    border-left: 1px solid #535353;
    border-right: 1px solid #535353;
    display: flex;
    flex-direction: column;
    > ul:nth-child(1) {
      border-bottom: 1px solid #434343;
    }
    > ul {
      flex: 1;
      padding: 15px 15px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      > li {
        width: 100%;
        display: flex;
        justify-content: space-between;
        > span {
          flex: 1;
          display: inline-block;
          font-size: 14px;
          line-height: 15px;
          color: #bcbfc4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > span:nth-child(2) {
          text-align: center;
        }
        > span:nth-child(3) {
          text-align: right;
        }
      }
    }
  }
  .buy-session3 {
    width: calc(100% - 445px);
    height: 100%;
    .buy-nav {
      height: 30px;
      width: 100%;
      font-size: 0;
      line-height: 0;
      border-bottom: 1px solid #535353;
      background: #323337;
      a {
        display: inline-block;
        color: #bcbfc4;
        width: 100px;
        line-height: 29px;
        text-align: center;
        font-size: 14px;
        transition: all 0.1s;
        vertical-align: middle;
      }
      .act-class,
      a:hover {
        background: #515253;
        color: #fff;
      }
      .buy-canbtns {
        display: inline-block;
        vertical-align: middle;
        height: 29px;
        font-size: 0;
        line-height: 0;
        float: right;
        .buy-canbtn {
          font-size: 14px;
          line-height: 29px;
          border: none;
          width: 65px;
          text-align: center;
          color: #f2f1f7;
          background: #515253;
          padding: 0;
          border-radius: 0;
        }
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
    .buy-view {
      height: calc(100% - 30px);
      width: 100%;
      .buy-views {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>
