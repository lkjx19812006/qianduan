<style  scoped>
.white_bk {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size: 15px;
  background-color: #fff;
  margin: 0;
  color: #34495e;
  width: 100%;
  height: 100px;
  border-bottom: 1px solid #ddd;
  line-height: 100px;
}

.white_bk .logo {
  float: left;
  font-size: 18px;
  margin-left: 20px;
}

.white_bk .right {
  float: right;
  margin-right: 100px;
  position: relative;
}

.white_bk .right .btnWrap {
  width: 100px;
  padding: 5px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: absolute;
  right: -30px;
  top: 75px;
  z-index: 99999;
  line-height: 34px;
}

.white_bk .right .btnWrap button {
  margin: auto;
}
</style>
<template>
  <div class="white_bk">
    <div class="logo">
      客服电话跟进系统(上班时间  <i class="el-icon-time"></i>09:00-18:00)
    </div>
    <div class="right">
      <span style="margin-right: 10px">{{userInformation.name}}</span>
      <img @click="showUserInfoList" style="float: right; margin-top: 20px; cursor: pointer;" src="../assets/images/head.png" height="50" width="50">
      <div class="btnWrap" v-show="isShowUserInfo">
        <el-button type="text" @click="signOut">退出登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex'
import common from '../common/httpService.js'
let _self = this;
export default {
  name: 'side-nav-view',
  data() {
    return {
      isShowUserInfo: false,
    }
  },
  computed: {
    userInformation() {
      return this.$store.state.user.user
    }
  },
  methods: {
    // 切换用户列表显示状态
    showUserInfoList() {
      this.isShowUserInfo = !this.isShowUserInfo;

    },
    // 新增退出功能        
    signOut() {
      this.isShowUserInfo = false;
      let _self = this;
      this.$confirm('是否确定退出登录？', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 执行退出
        // 清除cookie
        document.cookie = name + "=" + '' + ";expires=" + '';
        window.localStorage.KEY = '';
        window.localStorage.SID = '';
        _self.$router.push('/csc/login')
      }).catch(() => {
        // 取消不管 
        this.$message({
          type: 'info',
          message: '已取消'
        });

      });
    }
  }
}
</script>
