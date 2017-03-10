<style scoped>
.img_upload {
  position: relative;
}

.img_upload .input_image {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
}

.img_upload .image_show {
  width: 100%;
  height: 100%;
}

.img_upload .close_image {
  position: absolute;
  top: -5px;
  right: -5px;
  max-width: 10px;
}
</style>
<template>
  <div class="img_upload">
    <form>
      <input type="file" @change="previewImg" class="input_image" name="photo" accept=".apk">
      <span style="margin-right:10px">{{fileName}}</span>
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    </form>
  </div>
</template>
<script>
import common from '../common/httpService.js'
export default {
  data() {
      return {
        loading: false,
        fileList: [],
        fileName: '',
        size: ''
      }
    },
    props: {
      param: {
        default: null
      }
    },
    methods: {
      previewImg(e) {
        let _self = this;
        if (!this.param.version) {
          return _self.$message({
            type: 'info',
            message: '请先填写版本号'
          });
        }
        let input = e.target;
        if (input.files && input.files[0]) {
          let reader = new FileReader();
          _self.size = input.files[0].size;
          // input.files[0].name='ycmm.'+_self.param.version.apk;
          // _self.fileName = input.files[0].name;
          _self.fileName = input.files[0].name;
          _self.upload(input.files[0]);
        }
      },
      upload: function(file) {
        this.loading = true;
        let _self = this;
        let url = common.addSID(common.urlCommon + common.apiUrl.most);
        let body = {
          biz_module: 'filesService',
          biz_method: 'getQiNiuToken',
          version: 1,
          time: 0,
          sign: '',
          biz_param: {
            bucketName: 'android'
          }
        };
        body.time = Date.parse(new Date()) + parseInt(common.difTime);
        body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
        common.commonPost(url, body)
          .then(function(res) {
            if (res.code == '1c01') {
              var timestamp = new Date().getTime();
              var pic = file;
              var url = 'http://upload.qiniu.com';
              var xhr = new XMLHttpRequest();
              var formData = new FormData();
              formData.append('token', res.biz_result.token);
              formData.append('file', file);
              formData.append('key', 'ycmm.' + _self.param.version + '.apk');
              xhr.onreadystatechange = function() {
                _self.loading = false;
                if (xhr.readyState == 4) {
                  let response = JSON.parse(xhr.response);
                  if (response.key) {
                    _self.key = response.key;
                    _self.$emit("postUrl", {
                      url: res.biz_result.url + '/' + _self.key
                    });
                  } else {
                    _self.loading = false;

                  }
                }
              }
              xhr.open("POST", url, true);
              xhr.send(formData);
            } else {
              _self.loading = false;
              _self.$message({
                type: 'info',
                message: '获取token失败'
              });

            }
          })
          .catch(function(err) {
            _self.loading = false;
          });
      }
    }
}
</script>
<style scoped>
.img_upload {
  position: relative;
}

.img_upload .input_image {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
}

.img_upload .image_show {
  width: 100%;
  height: 100%;
}

.img_upload .close_image {
  position: absolute;
  top: -5px;
  right: -5px;
  max-width: 10px;
}
</style>
