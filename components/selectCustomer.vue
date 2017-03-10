<style scoped>
.bottom_button {
  margin: 20px 0;
  float: left;
  width: 100%;
}
</style>
<template>
  <div>
    <el-table v-bind:data="customerList" border style="width:612px;margin:auto" max-height="550" highlight-current-row @current-change="handleChange">
      <el-table-column prop="name" label="姓名" width="150">
      </el-table-column>
      <el-table-column prop="no" label="工号" width="120">
      </el-table-column>
      <el-table-column prop="mobile" label="电话" width="140">
      </el-table-column>
      <el-table-column prop="ctime" label="创建时间" width="200">
      </el-table-column>
    </el-table>
    <div class="bottom_button">
      <el-button type="primary" @click="confirm()" style="float:right">确定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        multipleSelection: ''
      }
    },
    computed: {
      customerList() {
        return this.$store.state.user.employeeList
      }
    },
    methods: {
      confirm() {
        if (!this.multipleSelection) {
          return this.$message({
            showClose: true,
            message: '请选择客服',
            type: 'error'
          });
        }
        this.$emit('message', this.multipleSelection);
      },
      handleChange(val) {
        this.multipleSelection = val;
      }
    }
}
</script>
