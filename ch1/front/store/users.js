export const state = () => ({
    me: null,//로그인 상태확인
    followerList: [
        {nickname: 'follower01', id: 1},
        {nickname: 'follower02', id: 2},
        {nickname: 'follower03', id: 3},
        {nickname: 'follower04', id: 4},
        
    ],
    followingList: [
        {nickname: 'following01', id: 1},
        {nickname: 'following02', id: 2},
        {nickname: 'following03', id: 3},
        {nickname: 'following04', id: 4},
    ],
});

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
    }
};