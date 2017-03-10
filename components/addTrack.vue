<template>
  <div>
    <el-form ref="trackParam" :model="trackParam" :rules="rules" label-width="100px" v-loading.body="loading">
      <el-form-item label="跟进记录" prop="title">
        <el-input type="textarea" v-model="trackParam.title"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('trackParam')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import common from '../common/httpService'
export default {
  data() {
      return {
        loading: false,
        rules: {
          title: [{
            required: true,
            message: '请输入联系内容',
            trigger: 'blur'
          }]
        }
      }
    },
    props: {
      trackParam: {
        default: null
      }
    },
    methods: {
      submitForm(formName) {
        let _self = this;
        this.$refs[formName].validate((valid) => {
            if (valid) {
              _self.loading = true;
              let url = common.urlCommon + common.apiUrl.most;
              let body = {
                biz_module: 'dataService',
                biz_method: 'addRecordInfo',
                biz_param: {
                  dataId: _self.trackParam.dataId,
                  remarks: _self.trackParam.title
                }
              }
              url = common.addSID(url);
              body.version = 1;
              body.time = Date.parse(new Date()) + parseInt(common.difTime);
              body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
              common.commonPost(url, body)
                .then(function(res) {
                  _self.loading = false;
                  _self.$message({
                    type: 'info',
                    message: '操作成功'
                  });
                  _self.$emit("addTrack");
                })
                .catch(function(err) {
                  _self.loading = false;
                })
          } else {
            return false;
          }
        });
    }
}
}
</script>
