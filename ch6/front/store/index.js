export const state = () => ({});

export const mutations = {};

export const actions = {
    async nuxtServerInit({ commit, dispatch, state }, { req }){ //페이지 로딩되기전 실행 모든페이지에서 각페이지별은 fetch안에 (return은 꼭해줘)
        try {
            await dispatch('users/loadUser');
        } catch (err) {
            console.error(err);
        }
    },
};