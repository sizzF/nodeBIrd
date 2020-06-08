export const state = () => ({
    mainPosts: [],
    hasMorePost: true,
});


const totalPosts = 51;
const limit = 10;

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
        console.log(index);
        state.mainPosts[index].Comments.unshift(payload);
    },
    loadPosts(state, payload) {
        const diff = totalPosts - state.mainPosts.length;
        const fakePosts = Array(diff > limit ? limit : diff).fill().map(v => ({
            id: Math.floor(Math.random() * 1000),
            User: {
                id: 1,
                nickname: '승민'
            },
            content: `hello infinity scrolling~ ${Math.floor(Math.random()*1000)}`,
            Comments: [],
            Images: []
        }));
        state.mainPosts = state.mainPosts.concat(fakePosts);
        state.hasMorePost = fakePosts.length === limit; //10개씩 불러올때는 뒤에 더있을수있으니 true 10개 이하면 끝난거니 false
    },
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
    },
    loadPosts({ commit, state }, payload){
        if(state.hasMorePost) {
            commit('loadPosts');
        }
    }
}