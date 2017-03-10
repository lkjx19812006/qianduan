<style scoped>
.content {
  background: url('../../assets/images/bg.png') no-repeat center !important;
  background-size: 100% 100%;
  height: 100%;
}

.content .center {
  width: 80%;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -150px 0 0 -40%
}

.content .center .left_image {
  width: 40%;
  padding-left: 10%;
  float: left;
}

.content .center .left_image img {
  max-width: 90%;
  margin-right: 10%;
}

.content .center .right_form {
  width: 40%;
  padding-right: 10%;
  float: right;
  height: 100%;
  position: relative;
}

.content .center .right_form img {
  margin: -100px 0 0 10%;
  width: 450px;
}

.content .center .right_form .form {
  position: absolute;
  top: 0;
  left: 10%;
}

.content .center .right_form .title {
  text-align: center;
  padding: 10px 0px 10px 50px;
  font-size: 18px;
  position: absolute;
  margin-top: -50px;
  width: 100%;
  color: #48576a;
}
</style>
<template>
  <div ref="content" class="content" v-on:keydown="sendSubmit()">
    <div class="center">
      <div class="left_image">
        <img src="../../assets/images/logo-font.png">
      </div>
      <div class="right_form">
        <img src="../../assets/images/frame.png">
        <div class="form">
          <div class="title">客服电话跟进系统</div>
          <el-form :model="userInformation" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userInformation.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input @keyup="sendSubmit" v-model="userInformation.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :autofocus="true" type="primary" @click="submitForm('ruleForm')" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import httpService from '../../common/httpService.js'
export default {
  name: 'login_view',
  data() {
    return {
      userInformation: {
        username: '',
        password: ''
      },
      fullscreenLoading: false,
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]

      }
    }
  },
  methods: {
    sendSubmit() {
      if (window.event.keyCode === 13) {
        //提交表单 直接传表单对象
        this.submitForm('ruleForm');
      }
    },
    submitForm(formName) {
      let _self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _self.fullscreenLoading = true;
          _self.$store.dispatch('login', {
            body: {
              biz_param: {
                no: _self.userInformation.username,
                password: _self.userInformation.password
              }
            },
            path: httpService.urlCommon + httpService.apiUrl.login
          }).then((response) => {
            window.localStorage.KEY = response.biz_result.KEY;
            window.localStorage.SID = response.biz_result.SID;
            httpService.KEY = window.localStorage.KEY;
            httpService.SID = window.localStorage.SID;
            _self.setCookie('KEY', httpService.KEY);
            _self.setCookie('SID', httpService.SID);
            console.log();
            httpService.getDate(
              function() {
                let url = httpService.urlCommon + httpService.apiUrl.most
                let body = {
                  biz_module: 'userService',
                  biz_method: 'getCmsUserInfo'
                }
                url = httpService.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(httpService.difTime);
                body.sign = httpService.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                _self.$store.dispatch('getUserInformation', {
                  body: body,
                  path: url
                }).then(() => {}, () => {});
              }
            );
            _self.$router.push('/csc/home');

          }, (err) => {
            console.log(err);
            _self.fullscreenLoading = false;
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    setCookie(name, value) {
      var Days = 1;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }
  }
}
</script>
