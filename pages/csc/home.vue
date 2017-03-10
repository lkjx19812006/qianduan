<style scoped>
.content {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size: 15px;
  float: left;
  width: 100%;
  height: 100%;
}

.content .right {
  float: right;
  width: 80%;
}

.content .right .home_content {
  padding: 20px;
}

.content .side_left {
  float: left;
  width: 20%;
  background: #fff;
  height: 100%;
}

a {
  color: #34495e;
  text-decoration: none;
}
</style>
<template>
  <div class="content">
    <div class="side_left">
      <side-nav :base="'/csc/home'"> </side-nav>
    </div>
    <div class="right">
      <main-header></main-header>
      <div class="home_content">
        <!--  <transition name="fade" mode="out-in"> -->
        <router-view></router-view>
        <!--  </transition> -->
      </div>
    </div>
    <div style="clear:both"></div>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex'

import MainHeader from '../../components/header.vue';
import SideNav from '../../components/side-nav.vue';
import common from '../../common/httpService.js'

export default {
  name: 'home-view',
  data() {
    return {
      httpParam: {
        employee: '',
        name: '',
        region: '',
        status: '',
        pn: 1,
        pSize: 20
      }
    }
  },
  components: {
    MainHeader,
    SideNav
  },
  methods: {
    getResource(res) {
      let _self = this;
      this.httpParam.employee=res.biz_result.id;
      let url = common.urlCommon + common.apiUrl.most;
      let body = {
        biz_module: 'dataService',
        biz_method: 'queryDrugStoreList',
        biz_param: _self.httpParam
      };
      url = common.addSID(url);
      body.version = 1;
      let localTime = new Date().getTime();
      body.time = localTime + common.difTime;
      body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
      this.$store.dispatch('getNeedList', {
        body: body,
        path: url
      }).then(() => {
       
      }, () => {
        
      });
    }
  },
  mounted() {

    let _self = this;
    common.commonPost('/crm/api/v1/employee/login', {
      no: 1123,
      password: '5580888zxc'
    }).then(function(res) {
      if (res.code !== 100090) {
        _self.$store.dispatch('getEmployee', '/crm/api/v1/employee/?&page=1&pageSize=200&org=29').then(() => {}, () => {});
      } else {
        _self.$message({
          showClose: true,
          message: '登陆ERP，请稍后重试',
          type: 'error'
        });
      }

    }).catch(function(err) {
      _self.$message({
        showClose: true,
        message: '登陆ERP，请稍后重试',
        type: 'error'
      });
    })
    if (!window.localStorage.KEY) {
      this.$router.push('/login');
    } else {
      common.KEY = window.localStorage.KEY;
      common.SID = window.localStorage.SID;
      common.getDate(
        function() {
          let url = common.urlCommon + common.apiUrl.most
          let body = {
            biz_module: 'userService',
            biz_method: 'getCmsUserInfo'
          }
          url = common.addSID(url);
          body.version = 1;
          body.time = Date.parse(new Date()) + parseInt(common.difTime);
          body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
          _self.$store.dispatch('getUserInformation', {
            body: body,
            path: url
          }).then((res) => {
            _self.getResource(res);
          }, () => {});
        }
      );

    }
  }
}
</script>
