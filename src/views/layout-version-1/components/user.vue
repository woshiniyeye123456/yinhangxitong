<template>
  <div class="v1-user">
    <span class="v1-user-title">应用安全中台</span>
    <div class="v1-serach-box-p">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!--<img class="v1-serach-img" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png">-->
          <span class="v1-serach-name">欢迎 {{ user ? user.real_name : '' }} 登录</span>
          <svg-icon icon-class="gerenjiantou_home"></svg-icon>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="dropdown-wrap">
            <span @click="gohome">首页</span>
          </el-dropdown-item>
          <el-dropdown-item divided class="dropdown-wrap">
            <span @click="showDialog">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided class="dropdown-wrap">
            <span @click="logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- reset-pwd -->
    <reset-popup
      title="重置密码"
      :params="resetParams"
      :visible.sync="resetVisible"
      @on-submit="resetUpdate"
    ></reset-popup>
  </div>
</template>

<script>
  import resetPopup from './reset-popup'

  export default {
    name: "user",
    inject: {
      user: {
        from: 'user',
        default: () => {
          return {}
        }
      }
    },
    components: {
      resetPopup
    },
    data() {
      return {
        resetParams: {},
        resetVisible: false,
      }
    },
    methods: {

      gohome() {
        this.$router.replace({
          path: '/'
        })
      },

      showDialog() {
        this.resetParams = {
          name: this.user.name,
          real_name: this.user.real_name,
          password: '',
        };
        this.resetVisible = true;
      },

      resetUpdate(params) {
        let loading = this.$loading({background: 'rgba(0, 0, 0, 0.5)'});
        this.$api.updateUser(params, this, () => {
          loading.close();
          this.$message({
            type: 'success',
            message: '重置成功'
          });
        }, () => {
          loading.close();
        });
      },

      logout() {
        this.$confirm('确认登出吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$store.dispatch('FedLogOut').then(() => {
            location.reload()// In order to re-instantiate the vue-router object to avoid bugs
          })
        }).catch(() => {

        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .v1-user {
    height: 100%;
    background: rgba(255, 255, 255, 1);
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .v1-serach-box-p {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 30px;
  }

  .v1-user-title {
    margin-left: 40px;
    font-size: 18px;
    font-family: AppleSystemUIFont;
    color: rgba(38, 38, 38, 1);
    letter-spacing: 1px;
    font-weight: 600;
  }

  .v1-serach-box {
    position: relative;
    margin-right: 40px;
  }

  .v1-serach-box input {
    width: 21vw;
    height: 32px;
    background: rgba(245, 245, 245, 1);
    border-radius: 16px;
    border: none;
    padding: 8px 27px;
    outline: none;
    line-height: 32px;
  }

  .v1-serach-box input::-webkit-input-placeholder { /* WebKit browsers */
    font-size: 14px;
    font-weight: 400;
    color: rgba(204, 204, 204, 1);
  }

  .v1-serach-box input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    font-size: 14px;
    font-weight: 400;
    color: rgba(204, 204, 204, 1);
  }

  .v1-serach-box input::-moz-placeholder { /* Mozilla Firefox 19+ */
    font-size: 14px;
    font-weight: 400;
    color: rgba(204, 204, 204, 1);
  }

  .v1-serach-box input:-ms-input-placeholder { /* Internet Explorer 10+ */
    font-size: 14px;
    font-weight: 400;
    color: rgba(204, 204, 204, 1);
  }

  .v1-serach-icon {
    position: absolute;
    left: calc(100% - 29px);
    top: 50%;
    z-index: 2;
    transform: translateY(-50%);
  }

  .v1-serach-name {
    font-size: 16px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-right: 14px;
  }

  .v1-serach-img {
    width: 38px;
    height: 40px;
    border-radius: 20px;
    margin-right: 10px;
  }

  .avatar-container {
    cursor: pointer;
  }

  .avatar-wrapper {
    display: inline-flex;
    align-items: center;
  }

  .dropdown-wrap {
    padding: 0;

    > span {
      display: inline-block;
      text-align: center;
      width: 90px;
    }
  }

  .dropdown-wrap:before {
    margin: 0 !important;
  }

</style>
