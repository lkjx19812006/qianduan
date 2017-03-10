import httpService from '../../common/httpService'
// initial state
// shape: [{ id, quantity }]
const state = {
  needList: { list: [] },
  resourceList: { list: [] }
}

// getters
const getters = {
  needList: state => state.needList,
  resourceList: state => state.resourceList
}

// actions
const actions = {
  getResourceList({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      httpService.commonPost(param.path, param.body)
        .then(function (res) {
          commit('getResourceList', res);
          resolve(res);
        })
        .catch(function (err) {
          reject(err);
        })
    })
  },
  getNeedList({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      httpService.commonPost(param.path, param.body)
        .then(function (res) {
          commit('getNeedList', res);
          resolve(res);
        })
        .catch(function (err) {
          reject(err);
        })
    })
  },
  allot({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      httpService.commonPost(param.path, param.body)
        .then(function (res) {
          resolve(res);
        })
        .catch(function (err) {
          reject(err);
        })
    })
  }

}

// mutations
const mutations = {

  getNeedList(state, res) {
    state.needList = res.biz_result;
  },
  getResourceList(state, res) {
    state.resourceList = res.biz_result;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
