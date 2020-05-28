export const state = () => ({
    me: null,//로그인 상태확인



});

export const mutations = { //동기적 작업
    SETME(state, payload) {
        state.me = payload;
    }
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
};