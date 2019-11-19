<template>
  <div class="index">
    <div class="index-nav" id="controller-nav" @dblclick.stop="setBig">
      <div class="index-navleft">
        <span class="index-logo"></span>
        <span class="index-name">交易端</span>
        <ul
          class="index-navlist"
          :style="{width:navlistWidth + 'px'}"
          v-if="$store.state.url1 == 'stock'"
        >
          <li :class="{'in-navact':type == 1}" @click.stop="setType(1)">
            <i class="in-i1"></i>
            <span>指数</span>
          </li>
          <li :class="{'in-navact':type == 2}" @click.stop="setType(2)">
            <i class="in-i2"></i>
            <span>沪深</span>
          </li>
          <li :class="{'in-navact':type == 3}" @click.stop="setType(3)">
            <i class="in-i3"></i>
            <span>中小板</span>
          </li>
          <li :class="{'in-navact':type == 4}" @click.stop="setType(4)">
            <i class="in-i4"></i>
            <span>创业板</span>
          </li>
          <li :class="{'in-navact':type == 5}" @click.stop="setType(5)">
            <i class="in-i5"></i>
            <span>自选</span>
          </li>
        </ul>
        <div
          class="nav-select"
          :style="{width:selectWidth + 'px'}"
          v-if="$store.state.url1 == 'stock'"
        >
          <el-select v-model="type">
            <el-option v-for="item in types" :key="item.type" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </div>
      </div>
      <div class="index-navright">
        <ul class="index-navzc">
          <li>
            <i class="iconfont icon-zichangaikuang"></i>
            <span>总资产：{{$store.state.zj.total}}</span>
          </li>
          <li>
            <i class="iconfont icon-tubiao-"></i>
            <span>可用资金：{{$store.state.zj.available}}</span>
          </li>
        </ul>
        <div class="index-selectnum">
          <i class="iconfont icon-touxiang"></i>
          <el-select v-model="$store.state.username">
            <el-option
              v-for="item in $store.state.users.accounts"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>
        <p class="index-addnum" @click.stop="addshow = true">增加账号</p>
        <i class="iconfont icon-APImiyue index-pass" @click.stop="changeshow = true"></i>
        <div class="index-search">
          <el-autocomplete
            v-model="searchinput"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
            suffix-icon="el-icon-search"
            :trigger-on-focus="false"
          ></el-autocomplete>
        </div>
        <div class="window-ctrol">
          <i class="iconfont icon-zuixiaohua" @click.stop="smallWindow"></i>
          <i
            class="iconfont"
            :class="{'icon-zuidahua':bigSmall == 1,'icon-zuidahua1':bigSmall == 0,}"
            @click.stop="changewWindow"
          ></i>
          <i class="iconfont icon-guanbi" @click.stop="exit"></i>
        </div>
      </div>
    </div>
    <div class="index-view1" :style="{height:$store.state.view1height}" ondragstart="return false">
      <router-view name="nav1" ref="stock" class="nav1-wrap"></router-view>
    </div>
    <div class="index-account" :style="{height:$store.state.accountheight + 'px'}">
      <span>总资产：{{$store.state.zj.total}}</span>
      <span>可用资金：{{$store.state.zj.available}}</span>
      <span>自有资金：{{$store.state.zj.have_bond}}</span>
      <span>可取资金：{{$store.state.zj.desirable}}</span>
      <i class="iconfont icon-zuidahua" @click="setShow"></i>
    </div>
    <div
      class="index-nav2box"
      :style="{height:$store.state.nav2boxheight + 'px'}"
      ondragstart="return false"
    >
      <div class="index-nav2">
        <router-link :to="{path:'/' + $store.state.url1 + '/buy'}" active-class="act-class">
          <p>
            <i class="iconfont icon-mairujilu"></i>
            <span>买入</span>
          </p>
        </router-link>
        <router-link :to="{path:'/' + $store.state.url1 + '/sell'}" active-class="act-class">
          <p>
            <i class="iconfont icon-maichujilu"></i>
            <span>卖出</span>
          </p>
        </router-link>
        <router-link :to="{path:'/' + $store.state.url1 + '/cancel'}" active-class="act-class">
          <p>
            <i class="iconfont icon-chexiao"></i>
            <span>撤单</span>
          </p>
        </router-link>
        <router-link :to="{path:'/' + $store.state.url1 + '/search'}" active-class="act-class">
          <p>
            <i class="iconfont icon-chaxun1"></i>
            <span>查询</span>
          </p>
        </router-link>
      </div>
      <div class="index-view2">
        <router-view name="nav2" class="nav2-wrap" ref="nav2"></router-view>
      </div>
    </div>
    <div class="index-btm" ondragstart="return false">
      <p>
        <i class="iconfont icon-xingxing-shi"></i>
        <span>版本：</span>
        <small>V1.0.0.0</small>
      </p>
      <p>
        <i class="iconfont icon-xingxing-shi"></i>
        <span>交易服务：</span>
        <small>已连接</small>
      </p>
      <p>
        <i class="iconfont icon-xingxing-shi"></i>
        <span>行情服务：</span>
        <small>已连接</small>
      </p>
    </div>
    <!-- 弹出层 -->
    <div class="tan-wrapper" v-if="addshow || changeshow">
      <!-- 增加账号 -->
      <div class="index-add" v-if="addshow">
        <p>
          增加账号
          <i class="iconfont icon-guanbi" @click="addshow = false"></i>
        </p>
        <div>
          <div class="index-inbox">
            <span>账号：</span>
            <input type="text" v-model="addname" />
          </div>
          <div class="index-inbox">
            <span>密码：</span>
            <input type="password" v-model="addpass" />
          </div>
          <div class="index-btns">
            <button @click="addName">确定</button>
            <button @click="addshow = false">取消</button>
          </div>
        </div>
      </div>
      <!-- 修改密码 -->
      <div class="index-add index-change" v-if="changeshow">
        <p>
          修改密码
          <i class="iconfont icon-guanbi" @click="changeshow = false"></i>
        </p>
        <div>
          <div class="index-inbox">
            <span>原密码：</span>
            <input type="password" v-model="changeold" />
          </div>
          <div class="index-inbox">
            <span>新密码：</span>
            <input type="password" v-model="changepass" />
          </div>
          <div class="index-inbox">
            <span>新密码：</span>
            <input type="password" v-model="changeconfirm" />
          </div>
          <div class="index-btns">
            <button @click="changeLoginPass">确定</button>
            <button @click="changeshow = false">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Index",
  data() {
    return {
      type: 1,
      types: [
        {
          name: "指数",
          type: 1
        },
        {
          name: "沪深",
          type: 2
        },
        {
          name: "中小板",
          type: 3
        },
        {
          name: "创业板",
          type: 4
        },
        {
          name: "自选",
          type: 5
        }
      ],
      screenWidth: document.body.clientWidth, // 屏幕宽度
      selectWidth: 0, //下拉列表宽度
      navlistWidth: 0, //选择框宽度
      addshow: false, //添加账号显示
      addname: "", //添加账号--账号
      addpass: "", //添加账号--密码
      bigSmall: 0, //默认显示最大化的按钮
      changeshow: false, //修改密码显示
      changeold: "", //修改密码--旧密码
      changepass: "", //修改密码--新密码
      changeconfirm: "", //修改密码--确认密码
      timeout: "", //搜索计时器
      searchinput: "", //搜索输入内容
      restaurants: [] //搜索到的内容
    };
  },
  //利用计算属性
  computed: {
    //监听 登录账号的变化
    watchUserName() {
      return this.$store.state.username;
    }
  },
  //监听执行
  watch: {
    // 切换账号
    watchUserName(val, oldVal) {
      let that = this;
      var users = that.$store.state.users;
      var index = $.inArray(val, users.names);
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "trade_login",
            name: val,
            password: users.accounts[index].pass,
            version: that.$store.state.version
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            sessionStorage.setItem("username", val);
            that.$store.commit("changeToken", res.data.data.token);
            that.$store.dispatch("getAccount");
          } else {
            that.$store.commit("changeName", oldVal);
            $store.commit("deleteUser", val);
          }
        });
    },
    type: function(newVal) {
      let that = this;
      var indexInfo = {
        shortIndex1: 0,
        shortIndex2: 0
      };
      that.$store.commit("setShortIndex", indexInfo);
      that.$refs.stock.setShorts(1);
    }
  },
  mounted() {
    let that = this;
    //控制拖动开始
    var $nav = document.getElementById("controller-nav"); //拖拽元素 ，需要放到对应的里面 进行转换
    var dragging = false; //拖曳
    var mouse_x, mouse_y;
    var win_x, win_y;

    //鼠标拖动
    document.getElementById("controller-nav").onmousedown = function(e) {
      e = e.originalEvent || e;
      const isbg = $(e.target).closest(".navbar-nav, #form-user").length < 1;
      if (!isbg) return;
      dragging = true;
      mouse_x = e.screenX;
      mouse_y = e.screenY;
      win_x = win.x;
      win_y = win.y;
    };
    //鼠标移动时
    window.onmousemove = function(e) {
      if (!dragging) return;
      if (that.bigSmall == 0) {
        win.x = win_x + (e.screenX - mouse_x);
        win.y = win_y + (e.screenY - mouse_y);
      }
    };
    //鼠标放开
    window.onmouseup = function() {
      dragging = false;
    };
    //控制拖动结束
    that.changeNav();
    window.addEventListener("resize", function() {
      that.changeNav();
      if (that.$store.state.url1 == "stock") {
        that.$refs.stock.setShorts(1);
      }
    });
    that.$store.dispatch("getAccount"); //获取资金信息
  },
  methods: {
    //双击方法
    setBig() {
      let that = this;
      if (that.bigSmall == 0) {
        maximize_window();
        that.bigSmall = 1;
      } else {
        restore_window();
        that.bigSmall = 0;
      }
    },
    //改变窗口大小
    changewWindow() {
      let that = this;
      if (that.bigSmall == 0) {
        maximize_window();
        that.bigSmall = 1;
      } else {
        restore_window();
        that.bigSmall = 0;
      }
    },
    exit() {
      CloseWindow();
    },
    //最小化
    smallWindow() {
      minimize_window();
    },
    //添加账号
    addName() {
      let that = this;
      if (that.addname == "") {
        layer.msg("请输入账号", {
          time: 1000
        });
      } else if (that.addpass == "") {
        layer.msg("请输入密码", {
          time: 1000
        });
      } else {
        that.addshow = false;
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "trade_login",
              name: that.addname,
              password: that.addpass,
              version: that.$store.state.version
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              var info = {
                name: that.addname,
                pass: that.addpass
              };
              that.$store.commit("addUser", info); //添加账号
              that.addname = "";
              that.addpass = "";
              that.$message({
                message: "添加成功",
                type: "success",
                duration: 1000
              });
            }
          });
      }
    },
    //添加账号
    changeLoginPass() {
      let that = this;
      if (that.changeold == "") {
        layer.msg("请输入原密码", {
          time: 1000
        });
      } else if (that.changepass == "") {
        layer.msg("请输入新密码", {
          time: 1000
        });
      } else if (that.changepass == that.changeold) {
        layer.msg("新旧密码相同", {
          time: 1000
        });
      } else if (that.changepass != that.changeconfirm) {
        layer.msg("两次新密码输入不一致", {
          time: 1000
        });
      } else {
        that.changeshow = false;
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "modify_capital",
              token: that.$store.state.token,
              old_password: that.changeold,
              password: that.changepass,
              confirm: that.changeconfirm
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              var info = {
                name: that.$store.state.username,
                pass: that.changepass
              };
              that.$store.commit("addUser", info); //添加账号
              that.changeold = "";
              that.changepass = "";
              that.changeconfirm = "";
              that.$message({
                message: "修改成功",
                type: "success",
                duration: 1000
              });
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
          that.$refs.stock.openInterval(3);
        }
      });
    },
    // 改变 顶部nav 的显示和隐藏
    changeNav() {
      let that = this;
      that.screenWidth = document.body.clientWidth;
      //1420隐藏
      if (that.screenWidth <= 1420) {
        that.selectWidth = 90;
        that.navlistWidth = 0;
      } else {
        that.selectWidth = 0;
        that.navlistWidth = 376;
      }
    },
    querySearchAsync(queryString, cb) {
      let that = this;
      clearTimeout(that.timeout);
      that.timeout = setTimeout(() => {
        $.ajax({
          url:
            "http://smartbox.gtimg.cn/s3/?v=2&q=" + queryString + "&t=gp&c=1",
          type: "GET",
          dataType: "script",
          crossDomain: true,
          async: false
        }).done(function() {
          var data = v_hint.split("^");
          var list = [];
          for (var i = 0; i < data.length; i++) {
            var arr = data[i].split("~");
            var bounce = arr[0] + arr[1];
            var name = arr[2];
            if (
              bounce != "sh000001" &&
              bounce != "sh000905" &&
              bounce != "sz399001" &&
              bounce != "sz399005" &&
              bounce != "sz399006" &&
              bounce != "sz399300" &&
              bounce != "sh000011" &&
              bounce != "sh000005"
            ) {
              var obj = {
                value: arr[1] + "--" + name,
                short: bounce
              };
              list.push(obj);
            }
          }
          that.restaurants = list;
          var restaurants = that.restaurants;
          cb(restaurants);
        });
      }, 500);
    },
    handleSelect(item) {
      let that = this;
      var short = item.short;
      that.$store.commit("setActiveShort", short);
      var url1 = that.$store.state.url1;
      var url2 = that.$store.state.url2;
      var url3 = that.$store.state.url3;
      if (url2 == "buy" || url2 == "sell") {
        that.$refs.nav2.openInterval();
      }
      if (url1 == "line") {
        that.$refs.stock.openInterval();
      } else {
        if (url3 == "") {
          that.$router.push({ path: "/line/" + url2 });
        } else {
          that.$router.push({ path: "/line/" + url2 + "/" + url3 });
        }
      }
    },
    setType(index) {
      this.type = index;
    }
  }
};
</script>
<style lang="less" scoped>
.index {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .index-nav {
    width: 100%;
    height: 35px;
    background: #323337;
    padding: 0 7px;
    color: #bcbfc4;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #434343;
    .index-navleft {
      display: inline-block;
      .index-logo {
        display: inline-block;
        vertical-align: middle;
        width: 35px;
        height: 34px;
        background: url(../../static/img/soft.png) no-repeat center center;
        background-size: 28px 28px;
      }
      .index-name {
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        line-height: 34px;
        margin-right: 10px;
      }
      .index-navlist {
        display: inline-block;
        font-size: 0;
        line-height: 0;
        vertical-align: middle;
        overflow: hidden;
        transition: all 0.1s;
        height: 34px;
        > li {
          display: inline-block;
          padding: 0 7px;
          cursor: Default;
          > span {
            display: inline-block;
            font-size: 14px;
            line-height: 34px;
            vertical-align: middle;
            transition: all 0.1s;
          }
          > i {
            display: inline-block;
            vertical-align: middle;
            height: 34px;
            margin-right: 5px;
            transition: all 0.1s;
          }
          .in-i1 {
            width: 21px;
            background: url(../../static/img/zs1.png) no-repeat center center;
            background-size: 21px 19px;
          }
          .in-i2 {
            width: 22px;
            background: url(../../static/img/hs1.png) no-repeat center center;
            background-size: 22px 18px;
          }
          .in-i3 {
            width: 20px;
            background: url(../../static/img/zxb1.png) no-repeat center center;
            background-size: 20px 19px;
          }
          .in-i4 {
            width: 25px;
            background: url(../../static/img/cyb1.png) no-repeat center center;
            background-size: 25px 22px;
          }
          .in-i5 {
            width: 25px;
            background: url(../../static/img/zx1.png) no-repeat center center;
            background-size: 25px 21px;
          }
        }
        .in-navact,
        li:hover {
          color: #f2f1f7;
          background: #515253;
          .in-i1 {
            width: 21px;
            background: url(../../static/img/zs2.png) no-repeat center center;
            background-size: 21px 19px;
          }
          .in-i2 {
            width: 22px;
            background: url(../../static/img/hs2.png) no-repeat center center;
            background-size: 22px 18px;
          }
          .in-i3 {
            width: 20px;
            background: url(../../static/img/zxb2.png) no-repeat center center;
            background-size: 20px 19px;
          }
          .in-i4 {
            width: 25px;
            background: url(../../static/img/cyb2.png) no-repeat center center;
            background-size: 25px 22px;
          }
          .in-i5 {
            width: 25px;
            background: url(../../static/img/zx2.png) no-repeat center center;
            background-size: 25px 21px;
          }
        }
      }
      .nav-select {
        display: inline-block;
        overflow: hidden;
        vertical-align: middle;
        width: 0;
        transition: all 0.1s;
        height: 34px;
        > i {
          display: inline-block;
          font-size: 18px;
          line-height: 34px;
          vertical-align: middle;
        }
        /deep/.el-input__inner {
          width: 90px;
          font-size: 14px;
          line-height: 34px;
          height: 34px;
          border: none;
          background: transparent;
          color: #bcbfc4;
          padding: 0 15px;
        }
        /deep/.el-input__icon {
          line-height: 34px;
        }
      }
    }
    .index-navright {
      display: inline-block;
      .index-navzc {
        vertical-align: middle;
        display: inline-block;
        font-size: 0;
        line-height: 0;
        height: 34px;
        > li:nth-child(1) {
          margin-right: 37px;
        }
        > li {
          display: inline-block;
          vertical-align: middle;
          color: #d2d978;
          i {
            display: inline-block;
            vertical-align: middle;
            font-size: 20px;
            line-height: 34px;
            margin-right: 5px;
          }
          span {
            display: inline-block;
            vertical-align: middle;
            font-size: 14px;
            line-height: 34px;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .index-selectnum {
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        > i {
          display: inline-block;
          font-size: 18px;
          line-height: 34px;
          vertical-align: middle;
        }
        /deep/.el-input__inner {
          width: 100px;
          font-size: 14px;
          line-height: 34px;
          height: 34px;
          border: none;
          background: transparent;
          color: #bcbfc4;
          padding: 0 15px 0 5px;
        }
        /deep/.el-input__icon {
          line-height: 34px;
        }
      }
      .index-addnum {
        display: inline-block;
        font-size: 14px;
        line-height: 34px;
        color: #f8f9fa;
        background: #515253;
        width: 80px;
        text-align: center;
        vertical-align: middle;
      }
      .index-pass {
        display: inline-block;
        font-size: 21px;
        line-height: 34px;
        color: #bcbfc4;
        margin: 0 5px;
        vertical-align: middle;
      }
      .index-search {
        display: inline-block;
        height: 34px;
        width: 150px;
        vertical-align: middle;
        /deep/.el-input__inner {
          border: none;
          background: #1c1d21;
          font-size: 14px;
          height: 34px;
          line-height: 34px;
          border-radius: 0;
          padding: 0px 10px;
        }
        /deep/.el-icon-search {
          line-height: 34px;
        }
      }
      .window-ctrol {
        display: inline-block;
        vertical-align: middle;
        > i {
          display: inline-block;
          font-size: 18px;
          line-height: 34px;
          color: #bcbfc4;
          vertical-align: middle;
          padding: 0 13px;
        }
        > i:hover {
          background: #515253;
        }
        > i:last-child:hover {
          background: red;
        }
      }
    }
  }
  .index-view1 {
    width: 100%;
    background: #1c1d21;
    .nav2-wrap {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
  .index-account {
    overflow: hidden;
    width: 100%;
    background: #323337;
    border-bottom: 1px solid #434343;
    span,
    i {
      display: inline-block;
      line-height: 30px;
      vertical-align: middle;
    }
    span:nth-child(1) {
      padding-left: 40px;
    }
    span {
      font-size: 14px;
      color: #d2d978;
      padding-right: 29px;
    }
    i {
      float: right;
      font-size: 16px;
      color: #f2f1f7;
      width: 40px;
      text-align: center;
      margin-left: 50px;
    }
    i:hover {
      background: #515253;
    }
  }
  .index-nav2box {
    width: 100%;
    background: #1c1d21;
    border-top: 1px solid #434343;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    .index-nav2 {
      width: 40px;
      height: 100%;
      background: #323337;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      a {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #bcbfc4;
        transition: all 0.1s;
        p {
          margin: 0 auto;
          i,
          span {
            display: block;
            text-align: center;
          }
          i {
            font-size: 22px;
            line-height: 22px;
          }
          span {
            font-size: 12px;
            line-height: 20px;
            padding-top: 5px;
          }
        }
      }
      .act-class,
      a:hover {
        color: #fff;
        background: #515253;
      }
    }
    .index-view2 {
      width: calc(100% - 40px);
      height: 100%;
      .nav2-wrap {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    }
  }
  .index-btm {
    width: 100%;
    height: 25px;
    background: #323337;
    text-align: right;
    p {
      display: inline-block;
      margin-right: 20px;
      span,
      small,
      i {
        display: inline-block;
        line-height: 25px;
        vertical-align: middle;
        color: #bcbfc4;
        font-size: 14px;
      }
      i {
        font-size: 16px;
      }
      small {
        color: #08da12;
        padding-right: 20px;
      }
    }
    p:last-child {
      margin: 0;
    }
  }
  .tan-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    background: rgba(44, 45, 49, 0.5);
    z-index: 99;
    transition: all 0.2s;
    .index-add {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;
      width: 360px;
      height: 245px;
      background: #1c1d21;
      > p {
        font-size: 14px;
        line-height: 30px;
        height: 30px;
        color: #bcbfc4;
        padding-left: 15px;
        background: #323337;
        i {
          display: inline-block;
          float: right;
          width: 30px;
          text-align: center;
          transition: all 0.1s;
          cursor: pointer;
        }
        i:hover {
          background: red;
        }
      }
      > div {
        padding: 30px;
        .index-inbox {
          width: 230px;
          margin: 0 auto 30px;
          display: flex;
          justify-content: space-between;
          span {
            display: inline-block;
            font-size: 14px;
            line-height: 30px;
            color: #bcbfc4;
            width: 50px;
          }
          input {
            width: calc(100% - 50px);
            padding: 0 0 0 10px;
            border: 1px solid #434343;
            font-size: 14px;
            line-height: 28px;
            height: 30px;
            background: #1c1d21;
            color: #bcbfc4;
          }
        }
        .index-btns {
          width: 230px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          > button {
            display: inline-block;
            font-size: 14px;
            line-height: 30px;
            width: 80px;
            vertical-align: middle;
            text-align: center;
            color: #bcbfc4;
            border-radius: 5px;
            cursor: pointer;
          }
          > button:nth-child(1) {
            background: #2c5582;
            margin-right: 30px;
          }
          > button:nth-child(2) {
            background: #323337;
          }
        }
      }
    }
    .index-change {
      height: 295px;
      > div {
        .index-inbox {
          width: 250px;
          span {
            width: 70px;
          }
          input {
            width: calc(100% - 70px);
          }
        }
        .index-btns {
          width: 250px;
        }
      }
    }
  }
}
</style>
