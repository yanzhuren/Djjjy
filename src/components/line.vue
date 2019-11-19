<template>
  <div class="line-wrap" @click.right="back">
    <div class="line-left" :style="{width:leftwidth}">
      <div class="line-nav">
        <i class="iconfont icon-fanhui" title="返回" @click="back"></i>
        <ul>
          <li :class="{'li-act':type == 0}" @click="setType(0)">分时图</li>
          <li :class="{'li-act':type == 1}" @click="setType(1)">5分钟</li>
          <li :class="{'li-act':type == 2}" @click="setType(2)">30分钟</li>
          <li :class="{'li-act':type == 3}" @click="setType(3)">60分钟</li>
          <li :class="{'li-act':type == 4}" @click="setType(4)">日线</li>
          <li :class="{'li-act':type == 5}" @click="setType(5)">周线</li>
        </ul>
        <i
          class="iconfont2 iconfont"
          :class="{'icon-xiayibu':out,'icon-shangyibu':out == false}"
          @click="setOut"
        ></i>
      </div>
      <div class="line-charts">
        <div class="k-ma" v-if="type != 0">
          <span>{{info.name}}</span>
          <span>MA(5,10,20,60)</span>
          <span class="ma5vol" style="color:#779d79;">
            MA5：
            <small>--</small>
          </span>
          <span class="ma10vol" style="color:#4280d0;">
            MA10：
            <small>--</small>
          </span>
          <span class="ma20vol" style="color:#e74431;">
            MA20：
            <small>--</small>
          </span>
          <span class="ma60vol" style="color:#f2a54c;">
            MA60：
            <small>--</small>
          </span>
        </div>
        <div class="k-volum" v-if="type != 0">
          <span>VOL</span>
          <span>成交量：--</span>
        </div>
        <div id="main"></div>
      </div>
    </div>
    <div class="line-right" :style="{width:rightwidth + 'px'}">
      <div class="right-session1">
        <div>
          <span>{{info.name}}</span>
          <span>{{info.code}}</span>
          <i
            class="iconfont"
            :class="{'icon-xingxing-shi':isHave != -1,'icon-xingxing-kong':isHave == -1}"
            @click="manageSelf"
          ></i>
        </div>
        <div>
          <p :class="{'red':info.up>0,'green':info.up<0}">{{info.price}}</p>
          <p>
            <span :class="{'red':info.up>0,'green':info.up<0}">{{info.up}}</span>
            <span :class="{'red':info.up>0,'green':info.up<0}">{{info.upratio}}</span>
          </p>
        </div>
      </div>
      <ul class="right-session2">
        <li>
          <p>
            <span>最新：</span>
            <span :class="{'red':info.up>0,'green':info.up<0}">{{info.price}}</span>
          </p>
          <p>
            <span>开盘：</span>
            <span class="red">{{info.open}}</span>
          </p>
        </li>
        <li>
          <p>
            <span>涨跌：</span>
            <span :class="{'red':info.up>0,'green':info.up<0}">{{info.up}}</span>
          </p>
          <p>
            <span>最高：</span>
            <span class="red">{{info.heigh}}</span>
          </p>
        </li>
        <li>
          <p>
            <span>涨幅：</span>
            <span :class="{'red':info.up>0,'green':info.up<0}">{{info.upratio}}</span>
          </p>
          <p>
            <span>最低：</span>
            <span class="green">{{info.low}}</span>
          </p>
        </li>
        <li>
          <p>
            <span>振幅：</span>
            <span>{{info.zf}}</span>
          </p>
          <p>
            <span>市值：</span>
            <span>{{info.value}}</span>
          </p>
        </li>
        <li>
          <p>
            <span>金额：</span>
            <span class="orange">{{info.money}}</span>
          </p>
          <p>
            <span>总手：</span>
            <span class="orange">{{info.volum}}</span>
          </p>
        </li>
        <li>
          <p>
            <span>涨停：</span>
            <span>{{info.upshop}}</span>
          </p>
          <p>
            <span>跌停：</span>
            <span>{{info.downshop}}</span>
          </p>
        </li>
      </ul>
      <div class="right-session3">
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
    </div>
  </div>
</template>

<script>
import { setTimeLine } from "../../static/js/time.js"; // 分时图绘制方法
import { setKline } from "../../static/js/kline.js"; // K线图绘制方法
export default {
  name: "Line1",
  data() {
    return {
      leftwidth: "calc(100% - 300px)",
      rightwidth: "300",
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
      out: true, //右侧是否展开
      type: 0, //图表类型 0：分时 1：5分 2：30分 3：60分 4：日线 5：月线
      timer: "", //图表计时器
      info: {
        name: "--",
        code: "",
        price: "", //最新价
        upratio: "--", //涨跌幅
        up: "--", //涨跌额
        volum: "--", //成交量 -- 总手
        close: "--", //收盘价
        open: "--", //开盘价
        heigh: "--", //最高价
        low: "--", //最低价
        zf: "--", //振幅
        upshop: "--", //涨停
        downshop: "--", //跌停
        money: "--", //成交额
        value: "--" //市值
      },
      isHave: -1 //是否自选
    };
  },
  destroyed() {
    let that = this;
    clearInterval(that.timer);
  },
  mounted() {
    let that = this;
    that.openInterval();
    // 判断是否自选
  },
  methods: {
    setIsSelf() {
      let that = this;
      var short = that.$store.state.activestock;
      var shorts = that.$store.state.selfshorts;
      that.isHave = $.inArray(short, shorts);
    },
    //管理自选
    manageSelf() {
      let that = this;
      var short = that.$store.state.activestock;
      if (that.isHave == -1) {
        //添加自选
        that.$store.commit("addSelf", short);
        that.$message({
          message: "添加自选成功",
          type: "success",
          duration: 1000
        });
      } else {
        //删除自选
        that.$store.commit("deleteSelf", short);
        that.$message({
          message: "删除自选成功",
          type: "success",
          duration: 1000
        });
      }
      var shorts = that.$store.state.selfshorts;
      that.isHave = $.inArray(short, shorts);
    },
    setType(params) {
      let that = this;
      if (that.type != params) {
        that.type = params;
        that.openInterval();
      }
    },
    // type 图表类型 0：分时 1：5分 2：30分 3：60分 4：日线 5：月线
    openInterval(resize) {
      let that = this;
      var short = that.$store.state.activestock;
      clearInterval(that.timer);
      that.setIsSelf();
      if (that.type == 0) {
        //分时
        that.getTline(short, 0);
        that.timer = setInterval(() => {
          that.$store.commit("setIstrade");
          if (that.$store.state.isTrade == 1) {
            that.getTline(short, 1); //请求分时
          }
        }, 1000);
        if (resize == 3) {
          that.getTline(short, 3);
        }
      } else {
        //K线
        var url, lintype; //地址 ，类型
        if (that.type == 1) {
          url = "http://ifzq.gtimg.cn/appstock/app/kline/mkline";
          lintype = "m5";
        } else if (that.type == 2) {
          url = "http://ifzq.gtimg.cn/appstock/app/kline/mkline";
          lintype = "m30";
        } else if (that.type == 3) {
          url = "http://ifzq.gtimg.cn/appstock/app/kline/mkline";
          lintype = "m60";
        } else if (that.type == 4) {
          url = "http://web.ifzq.gtimg.cn/appstock/app/kline/kline";
          lintype = "day";
        } else if (that.type == 5) {
          url = "http://web.ifzq.gtimg.cn/appstock/app/kline/kline";
          lintype = "week";
        }
        that.getKline(url, short, lintype, 0);
        that.timer = setInterval(() => {
          that.$store.commit("setIstrade");
          if (that.$store.state.isTrade == 1) {
            that.getKline(url, short, lintype, 1);
          }
        }, 1000);
        if (resize == 3) {
          that.getKline(url, short, lintype, 3);
        }
      }
    },
    //获取分时数据
    getTline(short, type) {
      let that = this;
      $.get(
        "http://web.ifzq.gtimg.cn/appstock/app/minute/query",
        {
          _var: "min_data_" + short,
          code: short
        },
        function(rawData) {
          console.log(short);
          var arr = $.parseJSON(rawData.slice(18)).data[short]["data"]["data"];
          var info = $.parseJSON(rawData.slice(18)).data[short]["qt"][short];
          that.setStockInfo(info);
          setTimeLine(arr, info, type);
        }
      );
    },
    // 获取K线数据
    getKline(url, short, linetype, type) {
      let that = this;
      $.get(
        url,
        {
          _var: "kdata",
          param: short + "," + linetype + ",,,320,"
        },
        function(rawData) {
          var arr = $.parseJSON(rawData.slice(6)).data[short][linetype];
          var info = $.parseJSON(rawData.slice(6)).data[short]["qt"][short];
          var data = that.splitData(arr, linetype, info);
          if (data.times.length <= 80) {
            var startValue = 0;
            var endValue = data.times.length - 1;
          } else {
            var startValue = data.times.length - 80;
            var endValue = data.times.length - 1;
          }
          that.setStockInfo(info);
          setKline(data, startValue, endValue, type);
        }
      );
    },
    setStockInfo(elements) {
      let that = this;
      that.info = {
        name: elements[1],
        code: elements[2],
        price: elements[3], //最新价
        upratio: elements[32] + "%", //涨跌幅
        up: elements[31], //涨跌额
        volum: that.setValum(elements[6]), //成交量 -- 总手
        close: elements[4], //收盘价
        open: elements[5], //开盘价
        heigh: elements[33], //最高价
        low: elements[34], //最低价
        zf: elements[43] + "%", //振幅
        upshop: elements[47], //涨停
        downshop: elements[48], //跌停
        money: that.setValu(elements[37]), //成交额
        value: elements[45] + "亿" || "--" //市值
      };
      $.each(that.buyArr, function(index, item) {
        item.price = elements[index * 2 + 9];
        item.num = elements[index * 2 + 10];
      });
      $.each(that.sellArr, function(index, item) {
        item.price = elements[27 - index * 2];
        item.num = elements[28 - index * 2];
      });
    },
    // 修饰K线数据
    splitData(rawData, linetype, info) {
      var datas = [],
        times = [],
        vols = [],
        udc = []; //涨跌幅
      var scale = 0; //涨跌幅
      var close = Number(info[4]);
      for (var i = 0; i < rawData.length; i++) {
        var time1 = rawData[i].splice(0, 1)[0];
        if (i == 0) {
          scale =
            Math.round(((Number(rawData[i][1]) - close) / close) * 10000) / 100;
        } else {
          scale =
            Math.round(
              ((Number(rawData[i][1]) - Number(rawData[i - 1][1])) /
                Number(rawData[i - 1][1])) *
                10000
            ) / 100;
        }
        //开 收 低 高 量 涨跌幅
        var arr2 = [
          rawData[i][0],
          rawData[i][1],
          rawData[i][3],
          rawData[i][2],
          rawData[i][4],
          scale
        ];
        datas.push(arr2);
        if (linetype == "m5" || linetype == "m30" || linetype == "m60") {
          var time = time1.substring(8, 10) + ":" + time1.substring(10, 12);
          times.push(time);
        } else {
          var time = time1.substring(5, 7) + "-" + time1.substring(8, 10);
          times.push(time);
        }
        vols.push(Number(rawData[i][4]));
      }
      return {
        datas: datas,
        times: times,
        vols: vols
      };
    },
    back() {
      let that = this;
      var url2 = that.$store.state.url2;
      var url3 = that.$store.state.url3;
      that.$router.push({ path: "/stock/" + url2 + "/" + url3 });
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
        return value + "万";
      }
    },
    //设置数量单位
    setValum(value) {
      var value = Number(value);
      if (value >= 100000 && value < 100000000) {
        var num = (value / 10000).toFixed(2) + "万手";
        return num;
      } else if (value >= 100000000) {
        var num = (value / 100000000).toFixed(2) + "亿手";
        return num;
      } else {
        return value;
      }
    },
    // 右侧展开
    setOut() {
      let that = this;
      that.out = !that.out;
      if (that.out) {
        that.leftwidth = "calc(100% - 300px)";
        that.rightwidth = 300;
      } else {
        that.leftwidth = "100%";
        that.rightwidth = 0;
      }
      that.$nextTick(() => {
        that.openInterval(3);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.line-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  .line-right {
    height: 100%;
    border-left: 1px solid #434343;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: all 0.1s;
    .right-session1 {
      width: 100%;
      padding: 15px 20px;
      border-bottom: 1px solid #434343;
      > div:nth-child(1) {
        span,
        i {
          display: inline-block;
          font-size: 20px;
          line-height: 20px;
          vertical-align: middle;
          color: #bcbfc4;
        }
        span:nth-child(2) {
          padding-left: 15px;
          padding-right: 50px;
        }
      }
      > div:nth-child(2) {
        padding-top: 15px;
        p {
          display: inline-block;
          vertical-align: middle;
          font-size: 20px;
          line-height: 32px;
          color: #bcbfc4;
          padding-right: 20px;
          span {
            display: block;
            font-size: 14px;
            line-height: 16px;
          }
        }
      }
    }
    .right-session2 {
      color: #bcbfc4;
      padding: 10px 20px;
      border-bottom: 1px solid #434343;
      li {
        width: 100%;
        display: flex;
        justify-content: space-between;
        > p {
          flex: 1;
          > span {
            font-size: 14px;
            line-height: 27px;
          }
        }
      }
    }
    .right-session3 {
      width: 100%;
      height: 270px;
      display: flex;
      flex-direction: column;
      > ul:nth-child(1) {
        border-bottom: 1px solid #434343;
      }
      > ul {
        flex: 1;
        padding: 10px 20px;
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
  }
  .line-right::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 0;
    height: 0;
  }
  .line-left {
    height: 100%;
    transition: all 0.1s;
    .line-nav {
      width: 100%;
      height: 25px;
      background: #323337;
      color: #bcbfc4;
      .icon-fanhui {
        display: inline-block;
        width: 25px;
        font-size: 20px;
        line-height: 25px;
        text-align: center;
        padding-left: 10px;
        margin-right: 13px;
        vertical-align: middle;
      }
      ul {
        display: inline-block;
        vertical-align: middle;
        > li {
          display: inline-block;
          vertical-align: middle;
          font-size: 14px;
          line-height: 25px;
          transition: all 0.1s;
          margin-right: 40px;
          cursor: default;
        }
        .li-act,
        > li:hover {
          color: #d2d978;
        }
      }
      .iconfont2 {
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        line-height: 25px;
        padding-right: 16px;
        float: right;
        transition: all 0.1s;
      }
    }
    .line-charts {
      width: 100%;
      height: calc(100% - 25px);
      position: relative;
      #main {
        width: 100%;
        height: 100%;
      }
      .k-ma {
        position: absolute;
        top: 0;
        padding: 5px 0 11px 25px;
        z-index: 2;
        > span {
          display: inline-block;
          font-size: 12px;
          line-height: 12px;
          color: #cccccc;
          padding-right: 10px;
          > small {
            display: inline-block;
            font-size: 12px;
            line-height: 12px;
          }
        }
      }
      .k-volum {
        position: absolute;
        top: 62%;
        padding: 5px 0 11px 25px;
        z-index: 2;
        > span {
          display: inline-block;
          font-size: 12px;
          line-height: 12px;
          color: #cccccc;
          padding-right: 15px;
        }
      }
    }
  }
}
</style>
