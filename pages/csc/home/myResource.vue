<style scoped>
.table {
  padding-top: 20px;
  background-color: #fff;
}

.sort {
  width: 100%;
  padding: 20px 0;
  text-align: center;
}

.pagination {
  text-align: center;
  background-color: white;
  padding: 20px;
}
</style>
<template>
  <div class="content" v-loading.body="showLoading">
    <div class="sort">
      <el-input style="width:200px;margin-right:20px" v-model="httpParam.name" placeholder="请输入药店名称"></el-input>
      <el-input style="width:200px;margin-right:20px" v-model="httpParam.region" placeholder="请输入地区"></el-input>
      <el-select style="width:150px;margin-right:20px" v-model="httpParam.status" placeholder="请选择跟进状态">
        <el-option v-for="item in statusArr" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getHttp()" icon="search">搜索</el-button>
    </div>
    <el-row>
      <el-col :span="15">
        <div class="table">
          <el-table v-bind:data="resourceList" border style="width:100%;max-width:874px" max-height="550" highlight-current-row @current-change="handleChange" v-loading.body="loading">
            <el-table-column prop="name" label="名称" width="150">
            </el-table-column>
            <el-table-column prop="contactPhone" label="电话" width="150">
            </el-table-column>
            <el-table-column prop="region" label="地区" width="200">
            </el-table-column>
            <el-table-column prop="introduction" label="介绍" width="300">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template scope="scope">
                <el-button @click.native.prevent="edit(scope.$index)" type="text" size="small">
                  添加记录
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="table">
          <el-table v-bind:data="trackArr" border style="width:100%;max-width: 700px" max-height="550" v-loading.body="statusShow">
            <el-table-column prop="employeeName" label="客服名称" width="100">
            </el-table-column>
            <el-table-column prop="remarks" label="联系内容" width="300">
            </el-table-column>
            <el-table-column label="创建时间" width="200">
              <template scope="scope">
                <span>{{trackArr[scope.$index].createTime|formatTime}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="httpParam.pn" layout="total,sizes, prev, pager, next, jumper" :page-size="httpParam.pSize" :page-sizes="[20, 30, 50, 100]" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="输入跟进内容" v-model="dialogShow">
      <addTrack v-on:addTrack="recieveTrack" :trackParam="trackParam">
      </addTrack>
    </el-dialog>
  </div>
</template>
<script>
import common from '../../../common/httpService.js'
import addTrack from '../../../components/addTrack.vue'
export default {
  name: 'myresource-view',
  data() {
    let _self = this;
    return {
      loading: false,
      trackParam: '',
      httpParam: {
        employee: '',
        name: '',
        region: '',
        status: '',
        pn: 1,
        pSize: 20
      },
      dialogShow: false,
      showLoading: false,
      statusShow: false,
      trackArr: [],
      statusArr: [{
        id: '',
        name: '全部'
      }, {
        id: 0,
        name: '未跟进'
      }, {
        id: 1,
        name: '跟进中'
      }]
    }
  },
  components: {
    addTrack
  },
  computed: {
    resourceList() {
      return this.$store.state.resource.needList.list
    },
    total() {
      return this.$store.state.resource.needList.total
    },
    userInformation() {
      return this.$store.state.user.user
    }
  },
  methods: {
    recieveTrack() {
      this.dialogShow = false;
      this.handleChange(this.trackParam);
    },
    edit(index) {
      this.trackParam = this.resourceList[index];
      this.dialogShow = true;
    },
    handleChange(val) {
      this.statusShow = true;
      let _self = this;
      let url = common.urlCommon + common.apiUrl.most;
      let body = {
        biz_module: 'dataService',
        biz_method: 'queryRecordInfo',
        biz_param: {
          dataId: val.id,
          pSize: 100
        }
      };
      url = common.addSID(url);
      body.version = 1;
      let localTime = new Date().getTime();
      body.time = localTime + common.difTime;
      body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
      common.commonPost(url, body)
        .then(function(res) {
          console.log(res);
          _self.trackArr = res.biz_result.list;
          _self.statusShow = false;
        })
        .catch(function(err) {
          console.log(err)
          _self.statusShow = false;
        })

    },
    handleSizeChange(val) {
      this.httpParam.pSize = val;
      this.httpParam.pn = 1;
      this.getHttp();
    },
    handleCurrentChange(val) {
      this.httpParam.pn = val;
      this.getHttp();
    },
    getHttp() {
      console.log(this.userInformation.id)
      let _self = this;
      this.loading = true;
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
        _self.loading = false
      }, () => {
        _self.loading = false
      });
    }
  }
}
</script>
