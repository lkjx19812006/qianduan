import httpService from '../../common/httpService'


const state = {
    mediaList: { list: [] },
    mediaDetail: {},
    bannerList:{ list: [] }
}

// getters
const getters = {
    mediaList: state => state.mediaList,
    mediaDetail: state => state.mediaDetail,
    bannerList:state => state.bannerList
}

// actions
const actions = {
    updateMediaState({ commit, state }, param) {
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
     getMediaList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    commit('initMediaList', res);
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
    getBannerList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    commit('initBannerList', res);
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
    getVersionDetail({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            commit('initMediaDetail', param);
            resolve();
        })
    }
}

// mutations
const mutations = {
    initMediaList(state, res) {
        state.mediaList = res.biz_result;
    },
    initMediaDetail(state, res) {
        state.mediaDetail = state[res.list].list.find((item) => item.id == res.id);
    },
    initBannerList(state, res) {
       state.bannerList = res.biz_result;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
