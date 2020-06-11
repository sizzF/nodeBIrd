export const state = () => ({
    mainPosts: [],
    hasMorePost: true,
    imagePaths: [],
});


const totalPosts = 51;
const limit = 10;

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload);//새글이 앞에오도록
        state.imagePaths = [];
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
    concatImagePaths(state, payload){
        console.log(payload);
        state.imagePaths = state.imagePaths.concat(payload);
    },
    removeImagePath(state, payload){
        state.imagePaths.splice(payload, 1);
    }
};

export const actions = {
    async add({ commit }, payload){
        //서버에 게시글 등록
        try {
            const res = await this.$axios.post('http://localhost:3085/post', {
                content: payload.content,
                imagePaths: state.imagePaths
            }, {
                withCredentials: true
            });
            commit('addMainPost', res.data);
        } catch (err) {
            
        }
        
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
    },
    async uploadImages({ commit }, payload){
        try{
            const res = await this.$axios.post('http://localhost:3085/post/images', payload, {
            withCredentials: true,
            });
            console.log(res.data);
            commit('concatImagePaths', res.data);
        }catch{
            
        }
    }
}