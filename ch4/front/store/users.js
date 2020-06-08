export const state = () => ({
    me: null,//로그인 상태확인
    followerList: [],
    followingList: [],
    hasMoreFollower: true,
    hasMoreFollowing: true,
});

const totalFollower = 8;
const totalFollowing = 7;
const limit = 3;

export const mutations = { //동기적 작업
    SETME(state, payload) {
        state.me = payload;
    },
    changeNickname(state, payload) {
        state.me.nickname = payload.nickname;
    },
    deleteFollower(state, payload) {
        const index = state.followerList.findIndex( v => v.id === payload.id);
        state.followerList.splice(index, 1);    
    },
    deleteFollowing(state, payload) {
        const index = state.followingList.findIndex( v => v.id === payload.id);
        state.followingList.splice(index, 1);    
    },
    loadFollowers(state){
        const diff = totalFollower - state.followerList.length;
        const fakeUsers = Array(diff > limit ? limit : diff).fill().map( v => ({
            id: Math.random().toString(),
            nickname: Math.floor(Math.random()*1000)
        }));
        state.followerList = state.followerList.concat(fakeUsers);
        state.hasMoreFollower = fakeUsers.length === limit;
    },
    loadFollowings(state){
        const diff = totalFollowing - state.followingList.length;
        const fakeUsers = Array(diff > limit ? limit : diff).fill().map( v => ({
            id: Math.random().toString(),
            nickname: Math.floor(Math.random()*1000)
        }));
        state.followingList = state.followingList.concat(fakeUsers);
        state.hasMoreFollowing = fakeUsers.length === limit;    }
};

export const actions = { //비동기적 작업 동기도됨
    signUp(context, payload) { //context안에는 {commit, dispatch, state, rootState ,getters, rootGetters }
        //서버에 회원가입 요청
        context.dispatch('logIn', payload);
    },

    logIn(context, payload) {
        context.commit('SETME', payload);
    },

    logOut(context, payload) {
        context.commit('SETME', null);
    },
    changeNickname({ commit }, payload){
        commit('changeNickname', payload);
    },
    deleteFollower({ commit }, payload){
        commit('deleteFollower', payload);
    },
    deleteFollowing({ commit }, payload){
        commit('deleteFollowing', payload);
    },
    loadFollowers({ commit, state }){
        if(state.hasMoreFollower){
            commit('loadFollowers');
        }
    },
    loadFollowings({ commit, state }){
        if(state.hasMoreFollower){
            commit('loadFollowings');
        }    }
};