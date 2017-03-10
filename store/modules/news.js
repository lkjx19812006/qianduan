import httpService from '../../common/httpService'
import config from '../../common/common.config.json'

const state = {
    newsList: { list: [] }
}

// getters
const getters = {
    news: state => state.newsList
}

// actions
const actions = {
    getNews({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    console.log(res)
                    commit('initNews', res);
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    },
    pushNews({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    resolve(res);
                },
                function(err) {
                    reject(err);
                })
        })
    }
}

// mutations
const mutations = {
    initNews(state, res) {
        function getLocalTime(nS) {
            return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ');
        }
        res.biz_result.list.forEach(function(item) {
            item.type = config.pushType[item.type];
            item.createTime=getLocalTime(item.createTime);
        })

        state.newsList = res.biz_result;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
