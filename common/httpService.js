import axios from '../plugins/axios'
import Vue from 'vue'
import CryptoJS from "crypto-js"

let httpService = new Vue({
  data: {
    customerId: '',
    urlCommon: '/front',
    KEY: '',
    SID: '',
    difTime: 0,
    apiUrl: {
      login: '/account/cmsLogin.do',
      code_login: '/account/verifiLogin.do',
      getDate: '/system/date.do',
      most: '/handle/control.do'
    }
  },
  methods: {
    addSID(url) {
      if (this.SID && this.SID != undefined) {
        return url + ';jsessionid=' + this.SID;
      } else {
        this.KEY = window.localStorage.KEY;
        this.SID = window.localStorage.SID;
        return url + ';jsessionid=' + this.SID;
      }
    },
    getSID(req) {
      var cookiesObj = {};
      var cookie = req.headers.cookie;
      this.difTime = req.session.difTime;
      cookie && cookie.split(';').forEach(function (Cookie) {
        function Trim(str) {
          return str.replace(/(^\s*)|(\s*$)/g, "");
        }
        Cookie = Trim(Cookie);
        var parts = [];
        parts[0] = Cookie.substr(0, 3);
        parts[1] = Cookie.substr(4, Cookie.length);
        if (parts[1]) cookiesObj[parts[0].trim()] = (parts[1] || '').trim();
      });
      this.SID = cookiesObj.SID;
      this.KEY = cookiesObj.KEY;
    },
    getDate(cb) {
      let _self = this;
      this.commonGet(this.urlCommon + this.apiUrl.getDate).then((response) => {
        if (response.code == '1c01') {
          var timestamp = Date.parse(new Date());
          window.localStorage.difTime = response.biz_result.time - timestamp;
          _self.difTime = window.localStorage.difTime;
          if (cb) cb();
        } else {
          _self.$message({
            showClose: true,
            message: response.msg,
            type: 'error'
          });
        }
      }, (err) => {
        _self.$message({
          showClose: true,
          message: '网络错误，请稍后重试',
          type: 'error'
        });
      });
    },
    getSign(str) {
      let _self = this;
      if (!_self.KEY) {
        _self.KEY = 'test';
      }
      if (!str) {
        str = 'test';
      }
      let signStr = CryptoJS.HmacSHA1(str, _self.KEY).toString(CryptoJS.enc.Base64);
      return signStr;
    },
    commonPost(url, data) {
      let _self = this;
      return new Promise((resolve, reject) => {
        axios.post(url, data)
          .then(function (response) {
            console.log(response.data)
            if (response.data.code === '1c01' || response.data.code === 200) {
              resolve(response.data);
            } else {
              _self.$message({
                showClose: true,
                message: response.data.msg,
                type: 'error'
              });
              reject(response.data);
            }

          })
          .catch(function (error) {
            console.log(error)
            reject(error);
            _self.$message({
              type: 'info',
              message: '操作失败'
            });
          });
      })
    },
    commonGet(url) {
      return new Promise((resolve, reject) => {
        axios.get(url)
          .then(function (response) {
            resolve(response.data);
          })
          .catch(function (error) {
            console.log(error)
            reject(error);
          });
      })
    }

  }
})




module.exports = httpService;
