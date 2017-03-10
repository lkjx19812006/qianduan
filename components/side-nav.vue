<style scoped>
.nav_side {
  background-color: #eef1f6;
  color: #fff;
  height: 100%;
}

.nav_side .logo {
  background-color: #fff;
  height: 100px;
  border-right: 1px solid #eee;
  background: #fff url('../assets/images/logo.png') no-repeat center;
  background-size: 50% 50%;
}

a {
  text-decoration: none;
}
</style>
<template>
  <div class="nav_side">
    <div class="logo">
    </div>
    <el-menu v-bind:default-active="getDefaultIndex" class="el-menu-vertical-demo">
      <template v-for="(item,index) in urlArr">
        <el-submenu v-bind:index="menuIndex(index)" v-if="item.children">
          <template slot="title">
            <i class="el-icon-message"></i>{{item.name}}
          </template>
          <router-link :to="base + subItem.path" v-for="(subItem,subIndex) in item.children">
            <el-menu-item v-bind:index="subMenuIndex(index,subIndex)">{{subItem.title}}</el-menu-item>
          </router-link>
        </el-submenu>
        <router-link v-else :to="base + item.path">
          <el-menu-item v-bind:index="menuIndex(index)"><i class="el-icon-menu"></i>{{item.name}}</el-menu-item>
        </router-link>
      </template>
    </el-menu>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex'

let _self = this;
export default {
  name: 'side-nav-view',
  props: {
    base: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      wrapperHeight: '',
      deIndex: '0',
      urlArr: [{
        "name": "主页",
        "path": "/",
        "index": "0"
      }, {
        "name": "资源列表",
        "index": "1",
        "children": [{
          "path": "/allResource",
          "title": "全部资源",
          "index": "1-0"
        }, {
          "path": "/myResource",
          "title": "我的资源",
          "index": "1-1"
        }]
      }]
    }
  },
  computed: {
    getDefaultIndex() {
      let _self = this;
      function getIndex(arr) {
        for (var j in arr) {
          if (_self.$route.path.indexOf(arr[j].path) > 0) {
            _self.deIndex = arr[j].index;
            break;
          } else if (arr[j].children && arr[j].children.length > 0) {
            getIndex(arr[j].children);
          }
        }
      }
      getIndex(_self.urlArr);
      return _self.deIndex;
    }

  },
  methods: {
    menuIndex: function(index) {
      return index.toString();
    },
    subMenuIndex: function(index, subIndex) {
      return index + '-' + subIndex;
    },
    go(path) {
      console.log(path);
      this.$router.push(this.base + path);
    }

  }
}
</script>
