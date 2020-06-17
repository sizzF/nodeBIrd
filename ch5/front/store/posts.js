export const state = () => ({
    mainPosts: [],
    hasMorePost: true,
    imagePaths: [],
});

const limit = 10;

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload);//새글이 앞에오도록
        state.imagePaths = [];
    },
    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.postId);
        state.mainPosts.splice(index, 1);
    },
    addComment(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.postId);
        state.mainPosts[index].Comments.unshift(payload);
    },
    loadPosts(state, payload) {
        
        state.mainPosts = state.mainPosts.concat(payload);
        state.hasMorePost = payload.length === limit; //10개씩 불러올때는 뒤에 더있을수있으니 true 10개 이하면 끝난거니 false
    },
    loadComments(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.postId);
        state.mainPosts[index].Comments = payload;

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
    async add({ commit, state}, payload){
        //서버에 게시글 등록
        try {
            const res = await this.$axios.post('http://localhost:3085/post', {
                content: payload.content,
                image: state.imagePaths
            }, {
                withCredentials: true
            });
            commit('addMainPost', res.data);
        } catch (err) {
            
        }
        
    },
    async remove({ commit }, payload){
        try {
            await this.$axios.delete(`http://localhost:3085/post/${payload.postId}`, {
                withCredentials: true,
            });
            commit('removeMainPost', payload);

        } catch (err) {
            console.log(err);
        }
    },
    async addComment({ commit }, payload){
        try {
            const res = await this.$axios.post(`http://localhost:3085/post/${payload.postId}/comment`, {
                content: payload.content,

            },{
                withCredentials: true,
            });
            commit('addComment', res.data);


        } catch (err) {
            console.log(err);
        }
    },
    async loadPosts({ commit, state }, payload){
        if(state.hasMorePost) {
            try {
                console.log(state.mainPosts.length);
                const res = await this.$axios.get(`http://localhost:3085/posts?offset=${state.mainPosts.length}&limit=10`)
                commit('loadPosts', res.data);
            } catch (err) {
                console.log(err);
            }
        }
    },
    async loadComments({ commit, router }, payload){
        if(state.hasMorePost) {
            try {
                const res = await this.$axios.get(`http://localhost:3085/post/${payload.postId}/comments`);
                commit('loadComments', res.data);
            } catch (err) {
                console.log(err);
            }
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