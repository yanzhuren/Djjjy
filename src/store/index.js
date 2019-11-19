import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
  state: { //$store.state.a调用
    version: '1.0.0', //版本号
    token: sessionStorage.getItem("token") || "",
    username: sessionStorage.getItem("username") || "", //当前账号
    users: JSON.parse(localStorage.getItem("users")) || {
      names: [],
      accounts: []
    },
    url1: sessionStorage.getItem("url1") || "",
    url2: sessionStorage.getItem("url2") || "",
    url3: sessionStorage.getItem("url3") || "",
    date: "", //记录   日期
    zsshorts: JSON.parse(sessionStorage.getItem("zsshorts")) || [], //指数数组
    hsshorts: JSON.parse(sessionStorage.getItem("hsshorts")) || [], //沪深数组
    zxbshorts: JSON.parse(sessionStorage.getItem("zxbshorts")) || [], //中小板数组
    cybshorts: JSON.parse(sessionStorage.getItem("cybshorts")) || [], //创业板数组
    selfshorts: JSON.parse(localStorage.getItem("zsshorts")) || [], //自选数组
    shortIndex1: Number(sessionStorage.getItem("shortIndex1")) || 0, //开始位置
    shortIndex2: Number(sessionStorage.getItem("shortIndex2")) || 0, //结束位置
    nav2boxheight: 301, //交易模块高度
    view1height: "calc(100% - 361px)", //股票模块高度
    accountheight: 0, //交易模块高度
    showbottom: true, //展示交易模块
    isTrade: 0, //是否在交易时间段
    zj: {
      available: "--", //可用资金
      bond: "--", //保证金
      bond_balance: "--", //保证金余额
      capital_balance: "--", //配资余额
      cid: "--", //
      close: "--", //平仓线
      close_profit: "--", //平仓盈亏
      desirable: "--", //可取资金
      freeze: "--", //冻结资金
      have_bond: "--", //自有资金
      market: "--", //持仓市值
      name: "--", //配资类型
      number: "--", //配资金额
      occupy: "--", //开仓成本
      order: "--", //单号
      out_in: "--", //出入金合计
      profit_loss: "--", //浮动盈亏
      ratio: "--", //亏损比
      time: "--", //配资时间
      today_capital: "--", //T1占用配资
      total: "--", //总资产
      total_profit: "--", //累计盈亏
      warning: "--", //警戒线
      prohibit: "--", //禁开线
      occupy_bond: "--", //占用保证金
    }, //资金
    value: [], //流水类型
    activestock: "", //活跃代码
    enstrustid: "", //委托 撤单 id
  },
  mutations: {
    // 修改token $store.commit('changeToken',token)调用
    changeToken(state, token) {
      state.token = token;
      sessionStorage.setItem("token", token);
    },
    // 修改账号 $store.commit('changeName',name)调用
    changeName(state, name) {
      state.username = name;
      sessionStorage.setItem("username", name);
    },
    //删除账号 $store.commit('deleteUser',info)调用
    deleteUser(state, name) {
      var names = state.users.names;
      var index = $.inArray(name, names);
      if (index != -1) {
        state.users.names.splice(index, 1);
        state.users.accounts.splice(index, 1);
        window.localStorage.setItem("users", JSON.stringify(state.users));
      }
    },
    //添加账号 $store.commit('addUser',info)调用
    addUser(state, info) {
      var names = state.users.names;
      var index = $.inArray(info.name, names);
      if (index == -1) {
        state.users.names.push(info.name);
        state.users.accounts.push(info);
      } else {
        state.users.accounts[index] = info;
      }
      window.localStorage.setItem("users", JSON.stringify(state.users));
    },
    //删除自选 $store.commit('deleteSelf',short)调用
    deleteSelf(state, short) {
      var selfshorts = state.selfshorts;
      var index = $.inArray(short, selfshorts);
      selfshorts.splice(index, 1);
      state.selfshorts = selfshorts;
      window.localStorage.setItem("zsshorts", JSON.stringify(selfshorts));
    },
    //添加自选 $store.commit('addSelf',short)调用
    addSelf(state, short) {
      state.selfshorts.push(short);
      window.localStorage.setItem("zsshorts", JSON.stringify(state.selfshorts));
    },
    //$store.commit('setActiveShort',short)调用
    setActiveShort(state, short) {
      state.activestock = short
    },
    setUrl(state, path) {
      state.date = "";
      state.value = [];
      if (path.length >= 3) {
        state.url1 = path[1];
        state.url2 = path[2];
        if (path.length == 4) {
          state.url3 = path[3];
        } else {
          state.url3 = "";
        }
      }
    },
    //设置 股票 开始下标 结束下标
    //$store.commit('setShortIndex',indexInfo)调用
    setShortIndex(state, indexInfo) {
      sessionStorage.setItem("shortIndex1", indexInfo.shortIndex1);
      state.shortIndex1 = indexInfo.shortIndex1;
      sessionStorage.setItem("shortIndex2", indexInfo.shortIndex2);
      state.shortIndex2 = indexInfo.shortIndex2;
    },
    //设置交易模块的展示与隐藏
    //$store.commit('setShow')
    setShow(state) {
      state.showbottom = !state.showbottom;
      if (state.showbottom) {
        state.nav2boxheight = 301;
        state.view1height = "calc(100% - 361px)";
        state.accountheight = 0;
      } else {
        state.nav2boxheight = 0;
        state.view1height = "calc(100% - 91px)";
        state.accountheight = 31;
      }
    },
    //判断是否在交易时间段
    //$store.commit('setIstrade')
    setIstrade(state) {
      var today = new Date(new Date().setHours(0, 0, 0, 0)) / 1000; //把当前日期变成时间戳
      var time = Math.round(new Date().getTime() / 1000);
      var am_start = today + 9.5 * 3600,
        am_end = today + 11.5 * 3600;
      var pm_start = today + 13 * 3600,
        pm_end = today + 15 * 3600;
      var date = new Date().getUTCDay();
      var isTrade = 0;
      if (date != 6 && date != 0) {
        if (am_start <= time && am_end >= time) {
          isTrade = 1;
        }
        if (pm_start <= time && pm_end >= time) {
          isTrade = 1;
        }
      }
      state.isTrade = isTrade;
    },
    //资金 赋值
    setZj(state, info) {
      state.zj = info;
    }
  },
  actions: { //获取资金信息 $store.dispatch('getAccount')调用
    getAccount(context) {
      Vue.prototype
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "capital_account",
            token: context.state.token,
          }
        })
        .then(function (res) {
          if (res.data.code == 1) {
            context.commit('setZj', res.data.data);
          }
        });
    },
  },
  getters: { //计算属性
  },
})
