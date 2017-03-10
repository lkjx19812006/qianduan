import httpService from '../../common/httpService'
import config from '../../common/common.config.json'
// initial state
const state = {
    allActivity: {list:[]}
}

// getters
const getters = {
    allActivity: state => state.allActivity
}

// actions
const actions = {
   ActivityList({ commit, state }, param) {
        return new Promise((resolve, reject) => {
            httpService.commonPost(param.path, param.body,
                function(res) {
                    resolve(res);
                    commit('initActivityList', res);
                },
                function(err) {
                    reject(err);
                })
        })
    }
}

// mutations
const mutations = {
     initActivityList(state, res) {
         for (let i = 0; i < res.biz_result.list.length; i++) {
            let item = res.biz_result.list[i];
            item.state = config.activityState[item.state]
        }
        state.allActivity = res.biz_result;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
