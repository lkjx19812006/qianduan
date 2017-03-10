import 'babel-polyfill'
import Vue from 'vue'
import * as filters from '../filters'
Vue.use(require('element-ui'))

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})