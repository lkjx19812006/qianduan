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
      <el-select style="width:150px;margin-right:20px" v-model="httpParam.employee" placeholder="请选择">
        <el-option v-for="item in employeeList" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-select style="width:150px;margin-right:20px" v-model="httpParam.status" placeholder="请选择跟进状态">
        <el-option v-for="item in statusArr" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getHttp()" icon="search">搜索</el-button>
      <el-button type="primary" @click="allot()">分配</el-button>
    </div>
    <el-row>
      <el-col :span="18">
        <div class="table">
          <el-table v-bind:data="resourceList" border style="width:100%;max-width:994px" max-height="550" @selection-change="handleSelectionChange" highlight-current-row @current-change="handleChange" v-loading.body="loading">
            <el-table-column type="selection" fixed="left" width="55">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="150">
            </el-table-column>
            <el-table-column prop="contactPhone" label="电话" width="150">
            </el-table-column>
            <el-table-column prop="region" label="地区" width="200">
            </el-table-column>
            <el-table-column prop="introduction" label="介绍" width="300">
            </el-table-column>
            <el-table-column prop="employeeName" label="分配人" width="120">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="table">
          <el-table v-bind:data="trackArr" border style="width:100%;" max-height="550" v-loading.body="statusShow">
            <el-table-column prop="employeeName" label="客服名称" width="100">
            </el-table-column>
            <el-table-column prop="remarks" label="联系内容" width="200">
            </el-table-column>
            <el-table-column label="创建时间" width="120">
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
    <el-dialog title="选择客服人员" v-model="dialogShow">
      <selectCustomer v-on:message="recieveCustomer">
      </selectCustomer>
    </el-dialog>
  </div>
</template>
<script>
import common from '../../../common/httpService.js'
import selectCustomer from '../../../components/selectCustomer.vue'
let param = {
  employee: '',
  name: '',
  region: '',
  status: '',
  pn: 1,
  pSize: 20
};

function fetchItem(store, req) {
  let url = common.urlCommon + common.apiUrl.most;
  let body = {
    biz_module: 'dataService',
    biz_method: 'queryDrugStoreList',
    biz_param: param
  };
  if (!common.SID) {
    common.getSID(req);
  }
  url = common.addSID(url);
  body.version = 1;
  let localTime = new Date().getTime();
  body.time = localTime + common.difTime;
  body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
  return store.dispatch('getResourceList', {
    body: body,
    path: url
  });
}
export default {
  name: 'resource-view',
  async data({store,req}) {
    await fetchItem(store, req)
    return {
      loading: false,
      httpParam: param,
      dialogShow: false,
      showLoading: false,
      statusShow: false,
      multipleSelection: [],
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
    selectCustomer
  },
  computed: {
    resourceList() {
      return this.$store.state.resource.resourceList.list
    },
    total() {
      return this.$store.state.resource.resourceList.total
    },
    employeeList() {
      let arr = [];
      for (let i = 0; i < this.$store.state.user.employeeList.length; i++) {
        arr.push(this.$store.state.user.employeeList[i]);
      }
      arr.unshift({
        id: -1,
        name: '未分配'
      });
      arr.unshift({
        id: '',
        name: '全部'
      });
      return arr
    }
  },
  mounted() {
    if (this.$store.state.resource.resourceList.list.length == 0) {
      this.getHttp();
    }
  },
  methods: {
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
    allot() {
      if (this.multipleSelection.length === 0) {
        return this.$message({
          showClose: true,
          message: '请选择药店',
          type: 'error'
        });
      }
      this.dialogShow = true;
    },
    handleSizeChange(val) {
      this.httpParam.pSize = val;
      this.httpParam.pn = 1;
      this.getHttp();
    },
    recieveCustomer(val) {
      this.dialogShow = false;
      let _self = this;
      let arr = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        arr.push(this.multipleSelection[i].id);
      }
      this.showLoading = true;
      let url = common.urlCommon + common.apiUrl.most;
      let body = {
        biz_module: 'dataService',
        biz_method: 'addDataEmployee',
        biz_param: {
          list: arr,
          result: {
            employee: val.id,
            employeeName: val.name
          }
        }
      };
      url = common.addSID(url);
      body.version = 1;
      let localTime = new Date().getTime();
      body.time = localTime + common.difTime;
      body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
      this.$store.dispatch('allot', {
        body: body,
        path: url
      }).then(() => {
        _self.showLoading = false
        _self.$message({
          showClose: true,
          message: '分配成功',
          type: 'info'
        });
        _self.getHttp();
      }, () => {
        _self.showLoading = false
      });
    },
    handleCurrentChange(val) {
      this.httpParam.pn = val;
      this.getHttp();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    getHttp() {
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
      this.$store.dispatch('getResourceList', {
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
