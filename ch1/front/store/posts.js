export const state = () => ({
    mainPosts: [],
});

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload);//새글이 앞에오도록
    },
    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.id);
        state.mainPosts.splice(index, 1);
    },
    addComment(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.postId);
        state.mainPosts[index].comments.unshift(payload);
    }
};

export const actions = {
    add({ commit }, payload){
        //서버에 게시글 등록
        commit('addMainPost', payload);
    },
    remove({ commit }, payload){
        commit('removeMainPost', payload);
    },
    addComment({ commit }, payload){
        commit('addComment', payload);
    }
}