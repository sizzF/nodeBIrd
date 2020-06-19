import Vue from 'vue';

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
        const index = state.mainPosts.findIndex( v => v.id === payload.PostId);
        state.mainPosts.splice(index, 1);
    },
    addComment(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.PostId);
        state.mainPosts[index].Comments.push(payload);
        //Vue.set(state.mainPosts[index].Comments, state.mainPosts[index].Comments.length, payload);

    },
    loadPosts(state, payload) {
        
        state.mainPosts = state.mainPosts.concat(payload);
        state.hasMorePost = payload.length === limit; //10개씩 불러올때는 뒤에 더있을수있으니 true 10개 이하면 끝난거니 false
    },
    loadComments(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.PostId);
        state.mainPosts[index].Comments = payload;

    },
    concatImagePaths(state, payload){
        state.imagePaths = state.imagePaths.concat(payload);
    },
    removeImagePath(state, payload){
        state.imagePaths.splice(payload, 1);
    },
    likePost(state, payload){
        const index = state.mainPosts.findIndex( v => v.id === payload.postId);
        state.mainPosts[index].Likers.push({
            id: payload.userId,
        });
    },
    unLikePost(state, payload){
        const index = state.mainPosts.findIndex( v => v.id === payload.postId);
        const userIndex = state.mainPosts[index].Likers.findIndex( v => v.id === payload.userId);
        state.mainPosts[index].Likers.splice(userIndex, 1);
    },
};

export const actions = {
    async add({ commit, state}, payload){
        //서버에 게시글 등록
        try {
            const res = await this.$axios.post('/post', {
                content: payload.content,
                image: state.imagePaths
            }, {
                withCredentials: true
            });
            commit('addMainPost', res.data);
        } catch (err) {
            console.error(err);
        }
        
    },
    async remove({ commit }, payload){
        try {
            await this.$axios.delete(`/post/${payload.postId}`, {
                withCredentials: true,
            });
            commit('removeMainPost', payload);

        } catch (err) {
            console.error(err);
        }
    },
    async addComment({ commit }, payload){
        try {
            const res = await this.$axios.post(`/post/${payload.postId}/comment`, {
                content: payload.content,

            },{
                withCredentials: true,
            });
            commit('addComment', res.data);


        } catch (err) {
            console.error(err);
        }
    },
    async loadPosts({ commit, state }, payload){
        if(state.hasMorePost) {
            try {
                const res = await this.$axios.get(`/posts?offset=${state.mainPosts.length}&limit=10`)
                commit('loadPosts', res.data);
            } catch (err) {
                console.error(err);
            }
        }
    },
    async loadComments({ commit, router }, payload){
        try {
            const res = await this.$axios.get(`/post/${payload.postId}/comments`);
            res.data.PostId = payload.postId;
            commit('loadComments', res.data);
        } catch (err) {
            console.error(err);
        }
    },
    async uploadImages({ commit }, payload){
        try{
            const res = await this.$axios.post('/post/images', payload, {
            withCredentials: true,
            });
            console.log(res.data);
            commit('concatImagePaths', res.data);
        }catch(err){
            console.error(err);

        }
    },

    async onRetweet({ commit }, payload){
        try {
            const res = await this.$axios.post(`/post/${payload.postId}/retweet`,{},{
                withCredentials: true,
            });
            commit('addMainPost', res.data);
        } catch (err) {
            console.error(err);
        }
    },

    async unlikePost({ commit }, payload){
        try {
            const res = await this.$axios.delete(`/post/${payload.postId}/like`, {
                withCredentials: true,
            });
            commit('unLikePost', {
                userId: res.data.userId,
                postId: payload.postId,
            });
        } catch (err) {
            console.error(err);
        }
    },
    
    async likePost({ commit }, payload){
        try {
            const res = await this.$axios.post(`/post/${payload.postId}/like`, {}, {
                withCredentials: true,
            });
            commit('likePost', {
                userId: res.data.userId,
                postId: payload.postId,
            });
        } catch (err) {
            console.error(err);
        }
    }
}