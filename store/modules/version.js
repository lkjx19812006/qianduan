import httpService from '../../common/httpService'


const state = {
    versionList: { list: [] },
    androidVersionList:{ list: [] },
    versionDetail: {},
    errorList:{ list: [] }
}

// getters
const getters = {
    versionList: state => state.versionList,
    versionDetail: state => state.versionDetail,
    errorList:state => state.errorList,
    androidVersionList:state => state.androidVersionList
}

// actions
const actions = {
    updateVersionState({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
     getErrorList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    commit('initErrorList', res);
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
    getVersionList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    commit('initVersionList', res);
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
    androidVersionList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    commit('initAndroidVersionList', res);
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
    getVersionDetail({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('initVersionDetail', param);
            resolve();
        })
    }
}

// mutations
const mutations = {
    initAndroidVersionList(state, res) {
        state.androidVersionList = res.biz_result;
    },
    initVersionList(state, res) {
        state.versionList = res.biz_result;
    },
    initVersionDetail(state, res) {
        state.versionDetail = state.versionList.list.find((item) => item.id == res);
    },
    initErrorList(state, res) {
       state.errorList = res.biz_result;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
