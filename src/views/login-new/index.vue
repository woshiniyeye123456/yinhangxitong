<template>
  <div class="login-container" @click.stop="organize">
    <el-form class="login-form forget-form" autoComplete="off" :model="loginForm" :rules="loginRules" ref="loginForm"
             label-position="left">
      <div class="title-container">
        <div class="img-log">
          <img src="../../img/logo.png">
          <!--<img src="../../img/jiufu/login_logo.png">-->
          <!--<img src="../../img/qianhai/login_logo.png">-->
        </div>
        <h3 class="title">
          应用安全中台
        </h3>
      </div>
      <el-form-item prop="name">
        <span class="svg-container">
          <svg-icon icon-class="yonghu_login"></svg-icon>
        </span>
        <el-input
          autofocus
          name="name"
          type="text"
          v-model="loginForm.name"
          autocomplete="off"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" class="no-margin">
        <span class="svg-container">
          <svg-icon icon-class="mima_logoin"></svg-icon>
        </span>
        <el-input
          name="password"
          :type="passwordType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-button
        type="primary"
        :loading="loading"
        class="btn"
        @click.native.prevent="handleLogin"
      >{{$t('login.logIn')}}
      </el-button>
    </el-form>

  </div>
</template>

<script>
  import api from '../../apis/api';
  import {validateUserName} from '@/utils/validate'
  import LangSelect from '@/components/LangSelect'
  import SocialSign from './socialsignin'

  export default {
    components: {LangSelect, SocialSign},
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validateUserName(value)) {
          callback(new Error('请输入正确的账号,只能输入4-32位字母，数字，下划线，减号'))
        } else {
          callback()
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          callback()
        }
      };
      return {
        loginForm: {
          name: '',
          password: ''
        },
        loginRules: {
          name: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false
      }
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {

          // if (valid) {    // 全部权限
          //   this.$store.commit('SET_TOKEN', 'admin');           // 全部权限
          //   this.$store.commit('SET_MODULES', 'admin');         // 全部权限
          //   this.$store.dispatch('generateRoutes', 'admin');    // 全部权限
          //   this.$router.addRoutes(this.$store.getters.addRouters);
          //   this.$router.push({path: '/'});
          //   return false
          // }

          if (valid) {    // 正常登录
            this.loading = true;
            let params = {};
            params.name = this.loginForm.name;
            params.password = this.loginForm.password;
            api.login(params, this, data => {
              this.loading = false;
              if (data.data) {
                this.$store.commit('SET_TOKEN', data.data.token);
                this.$store.commit('SET_NAME', this.loginForm.name);
                this.$store.commit('SET_USER', data.data.extra);
                // this.$store.commit('SET_MODULES', 'admin'); // 跳过
                // this.$store.dispatch('generateRoutes', 'admin');  // 跳过
                // this.$router.addRoutes(this.$store.getters.addRouters); // 跳过
                this.$router.push({path: '/'});
              }
            }, () => {
              this.loading = false;
            });
          } else {
            this.loading = false;
            return false
          }
        })
      },

      afterQRScan() {
        const hash = window.location.hash.slice(1)
        const hashObj = getQueryObject(hash)
        const originUrl = window.location.origin
        history.replaceState({}, '', originUrl)
        const codeMap = {
          wechat: 'code',
          tencent: 'code'
        }
        const codeName = hashObj[codeMap[this.auth_type]]
        if (!codeName) {
          alert('第三方登录失败')
        } else {
          this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
            this.$router.push({path: '/'})
          })
        }
      },
      organize() {

      }
    },
    created() {
      // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 40px;
      width: calc(100% - 48px);
      input {
        margin-top: 0;
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 0 10px 0;
        box-sizing: border-box;
        color: #262626;
        height: 38px;
        font-size: 16px;
        font-family: AppleSystemUIFont;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #152944 !important;
        }
      }
    }
    .el-input.code {
      width: calc(100% - 120px);
    }
    .code-box {
      vertical-align: middle;
      display: inline-block;
      width: 90px;
      height: 32px;
      line-height: 32px;
      background-color: #0bb3e4;
      color: #fff;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      box-sizing: border-box;
      padding: 0;
      border-radius: 0;
    }
    .code-box.is-disabled {
      background-color: #0bb3e4 !important;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

  .login-container {

    .el-form-item {

      > .el-form-item__label {
        line-height: 12px;
        height: 12px;
        min-height: 12px;
        padding: 0;
        width: 100%;
      }

      > .el-form-item__content {
        height: 40px;

        > .el-input {
          line-height: 40px;
        }
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .svg-container {
      padding: 0;
      color: $dark_gray;
      vertical-align: middle;
      width: 44px;
      display: inline-block;
      text-align: right;
      &_login {
        font-size: 20px;
      }
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./index.scss";

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background: url($bg_url);
    background-position: left center;
    background-repeat: no-repeat;
    background-size: cover;
    .login-form {
      position: absolute;
      top: 50%;
      right: 11%;
      width: 440px;
      transform: translateY(-240px);
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 2px 4px 10px 0px rgba(18, 161, 221, 0.6);
      border-radius: 16px;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      color: $dark_gray;
      vertical-align: top;
      width: 44px;
      height: 100%;
      /*display: inline-block;*/
      display: inline-flex;
      align-items: center;
      justify-content: center;

      > .svg-icon {
        font-size: 18px;
      }
    }
    .svg-container_user {
      > .svg-icon {
        font-size: 22px;
        transform: translateX(4px);
      }
    }
    .title-container {
      position: relative;
      text-align: center;

      > .img-log {
        > img {
          vertical-align: top;
        }
      }

      > .title {
        font-size: 24px;
        font-family: SFNSDisplay;
        color: rgba(3, 3, 3, 1);
        line-height: 28px;
        letter-spacing: 1px;
        margin-top: 20px;
      }
    }
  }

  .forget-form {
    padding: 58px 60px;

    > .el-form-item {
      background-color: transparent;
      border-radius: 6px;
      border: 1px solid rgba(220, 223, 228, 1);
      margin-bottom: 42px;
    }

    > .forgot-pwd {
      text-align: right;
    }
  }

  .btn {
    margin-top: 28px;
    width: 100%;
    height: 40px;
    background: rgba(0, 197, 212, 1);
    box-shadow: 2px 4px 10px 0px rgba(18, 161, 221, 0.6);
    border-radius: 6px;
    border: 0 none;
    font-weight: 400;
    font-size: 16px;
    font-family: AppleSystemUIFont;
    color: rgba(255, 255, 255, 1);
  }
</style>
