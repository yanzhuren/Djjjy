<template>
  <div class="login" ondragstart="return false">
    <div class="login-wrap">
      <img src="../../static/img/1.png" alt />
      <i class="exit iconfont icon-guanbi" @click.stop="exitDjj"></i>
      <div class="login-form">
        <div class="login-ip">
          <span>站点</span>
          <el-select class="login-select" v-model="xlId">
            <el-option v-for="item in xl" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="login-ip">
          <span>账号</span>
          <input type="text" class="login-input" v-model="name" />
        </div>
        <div class="login-ip">
          <span>密码</span>
          <input type="password" class="login-input" v-model="pass" />
        </div>
        <div class="login-ip">
          <span class="login-letter">验证码</span>
          <input type="text" class="login-input login-code" v-model="code" />
          <s-identify
            class="picCode"
            :identifyCode="identifyCode"
            :contentWidth="85"
            :contentHeight="30"
            @refreshcode="getRePicCode"
          ></s-identify>
        </div>
        <div class="login-ip login-checkbox">
          <span></span>
          <el-checkbox class="login-cjeck" v-model="checked">记住用户名</el-checkbox>
        </div>
        <el-button
          class="login-btn"
          type="primary"
          @click="login"
          :disabled="disabled"
          :loading="disabled"
        >{{loginText}}</el-button>
        <p>版本：V1.0.0.1</p>
      </div>
    </div>
  </div>
</template>

<script>
import SIdentify from "../components/icode";
export default {
  name: "Login",
  components: {
    SIdentify
  },
  data() {
    return {
      xlId: 1,
      xl: [
        {
          name: "线路一",
          id: 1
        },
        {
          name: "线路二",
          id: 2
        },
        {
          name: "线路三",
          id: 3
        }
      ],
      identifyCode: "", //注册_图形验证码图片
      identifyCodes: "0123456789",
      name: "",
      pass: "",
      code: "", //验证码
      checked: false,
      disabled: false,
      loginText: "登录"
    };
  },
  mounted() {
    let that = this;
    if (localStorage.getItem("remembername")) {
      that.checked = true;
      that.name = localStorage.getItem("remembername");
    }
    that.getRePicCode();
    that.getShorts(1); //获取指数代码
    that.getShorts(2); //获取沪深代码
    that.getShorts(3); //获取中小板代码
    that.getShorts(4); //获取创业板代码
  },
  methods: {
    re() {
      return false;
    },
    //不登录 退出
    exitDjj() {
      CloseWindow();
    },
    login() {
      let that = this;
      if (that.name == "") {
        layer.msg("请输入账号", {
          time: 1000
        });
      } else if (that.pass == "") {
        layer.msg("请输入密码", {
          time: 1000
        });
      } else if (that.code != that.identifyCode) {
        layer.msg("图片验证码输入不正确", {
          time: 1000
        });
      } else {
        that
          .$http({
            url: "/",
            method: "post",
            data: {
              nozzle: "trade_login",
              name: that.name,
              password: that.pass,
              version: that.$store.state.version
            }
          })
          .then(function(res) {
            if (res.data.code == 1) {
              // 记住用户名
              if (that.checked) {
                window.localStorage.setItem("remembername", that.name);
              } else {
                window.localStorage.removeItem("remembername");
              }
              var info = {
                name: that.name,
                pass: that.pass
              };
              that.$store.commit("addUser", info); //添加账号
              that.$store.state.token = res.data.data.token;
              that.$store.state.username = that.name;
              window.sessionStorage.setItem("token", res.data.data.token);
              window.sessionStorage.setItem("username", that.name);
              that.$router.push({ path: "/index" });
              login_home();
            }
          });
      }
    },
    //   验证码 start
    //获取注册 图片验证码
    getRePicCode() {
      this.loginCode = "";
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    // 生成一个随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    //更新验证码
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    //创建图形验证码
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    },
    //   验证码 end
    //获取所有股票代码
    getShorts(type) {
      let that = this;
      that
        .$http({
          url: "/",
          method: "post",
          data: {
            nozzle: "stock_list",
            type: type
          }
        })
        .then(function(res) {
          if (res.data.code == 1) {
            if (type == 1) {
              that.$store.state.zsshorts = res.data.data;
              window.sessionStorage.setItem(
                "zsshorts",
                JSON.stringify(res.data.data)
              );
            } else if (type == 2) {
              that.$store.state.hsshorts = res.data.data;
              window.sessionStorage.setItem(
                "hsshorts",
                JSON.stringify(res.data.data)
              );
            } else if (type == 3) {
              that.$store.state.zxbshorts = res.data.data;
              window.sessionStorage.setItem(
                "zxbshorts",
                JSON.stringify(res.data.data)
              );
            } else if (type == 4) {
              that.$store.state.cybshorts = res.data.data;
              window.sessionStorage.setItem(
                "cybshorts",
                JSON.stringify(res.data.data)
              );
            }
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;
  .login-wrap {
    width: 100%;
    height: 100%;
    max-width: 700px;
    max-height: 470px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    background: rgb(227, 227, 228);
    .exit {
      position: absolute;
      top: 0;
      right: 6px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      background: #2c5582;
      width: 34px;
      height: 24px;
      color: #fff;
      line-height: 24px;
      text-align: center;
      z-index: 9999;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.1s;
    }
    .exit:hover {
      background: #f67302;
    }
    > img {
      display: block;
      width: 100%;
      height: 126px;
    }
    .login-form {
      width: 100%;
      padding: 13px 48px 14px;
      .login-ip {
        width: 440px;
        display: flex;
        justify-content: space-between;
        height: 30px;
        margin-bottom: 15px;
        > span {
          display: inline-block;
          width: 70px;
          font-size: 16px;
          line-height: 30px;
          color: #000;
          letter-spacing: 16px;
        }
        .login-letter {
          letter-spacing: 0;
        }
        .login-select {
          width: calc(100% - 70px);
          height: 30px;
          /deep/.el-input__inner {
            height: 30px;
            line-height: 30px;
            background-color: transparent;
            border: 1px solid #b5b5b5;
            border-radius: 0;
          }
          /deep/.el-input__icon {
            line-height: 30px;
          }
        }
        .login-input {
          width: calc(100% - 70px);
          font-size: inherit;
          height: 30px;
          line-height: 30px;
          background-color: transparent;
          border: 1px solid #b5b5b5;
          border-radius: 0;
          padding: 0 15px;
        }
        .login-code {
          width: calc(100% - 165px);
          margin-right: 10px;
        }
        .login-cjeck {
          width: calc(100% - 70px);
          /deep/.el-checkbox__label {
            color: #000 !important;
          }
          /deep/.el-checkbox__inner {
            border: 1px solid #060102;
          }
        }
      }
      .login-checkbox {
        height: auto;
        margin-bottom: 20px;
      }
      .login-btn {
        width: 280px;
        margin: 0 auto;
        display: block;
        border-radius: 15px;
        background-color: #2c5582;
        /deep/.el-button--primary {
          color: #f2f1f7;
        }
      }
      > p {
        font-size: 14px;
        color: #999999;
        text-align: right;
        padding-top: 22px;
      }
    }
  }
}
</style>
