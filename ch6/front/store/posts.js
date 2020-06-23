import Vue from 'vue';
import throttle from 'lodash.throttle';
export const state = () => ({
    mainPosts: [],
    hasMorePost: true,
    imagePaths: [],
    modifyImagePaths: [],
});

const limit = 10;

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload);//새글이 앞에오도록
        state.imagePaths = [];
    },
    modifyMainPost(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.postId);
        state.mainPosts[index] = payload.data;//새글이 앞에오도록
        state.mainPosts = state.mainPosts.concat();
        state.modifyImagePaths = [];
    },
    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.postId);
        state.mainPosts.splice(index, 1);
    },
    addComment(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.PostId);
        state.mainPosts[index].Comments.push(payload);
    },
    loadPost(state, payload) {
        state.mainPosts = [payload];
    },
    loadPosts(state, payload) {
        if(payload.refresh) {
            state.mainPosts = payload.data;
            state.hasMorePost = payload.data.length === limit; //10개씩 불러올때는 뒤에 더있을수있으니 true 10개 이하면 끝난거니 false
        }else {
            state.mainPosts = state.mainPosts.concat(payload.data);
            state.hasMorePost = payload.data.length === limit; //10개씩 불러올때는 뒤에 더있을수있으니 true 10개 이하면 끝난거니 false
        }
    },
    loadComments(state, payload) {
        const index = state.mainPosts.findIndex( v => v.id === payload.PostId);
        state.mainPosts[index].Comments = payload;

    },
    concatImagePaths(state, payload){
        state.imagePaths = state.imagePaths.concat(payload);
    },
    concatModifyImagePaths(state, payload){
        state.modifyImagePaths = state.modifyImagePaths.concat(payload);
    },
    removeImagePath(state, payload){
        state.imagePaths.splice(payload, 1);
    },
    removeModifyImagePath(state, payload){
        state.modifyImagePaths.splice(payload, 1);
    },
    deleteModifyImagePaths(state, payload){
        state.modifyImagePaths = [];
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
    add: throttle(async function({ commit, state }, payload){
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
            alert(err.response.data);
        }
        
    }, 4000),
    update: throttle(async function({ commit, state}, payload){
        //서버에 게시글 등록
        try {
            console.log(payload.content);
            const res = await this.$axios.patch('/post', {
                postId: payload.postId,
                content: payload.content,
                image: state.modifyImagePaths
            }, {
                withCredentials: true
            });
            commit('modifyMainPost', {
                data: res.data,
                postId: payload.postId,
            });
        } catch (err) {
            console.error(err);
            alert(err.response.data);
        }
        
    }, 4000),
    async edit({ commit }, payload){
        try {
            await this.$axios.patch(`/post/${payload.postId}`, {
                content: payload.content,
                image: state.imagePaths
            }, {
                withCredentials: true,
            });
            commit('editMainPost', payload);

        } catch (err) {
            console.error(err);
            alert(err.response.data);
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
            alert(err.response.data);
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
            alert(err.response.data);
        }
    },
    async loadPost({ commit, state }, payload){
        try {
            const res = await this.$axios.get(`/post/${payload.postId}`);
            commit('loadPost', res.data);
        } catch (err) {
            console.error(err);
            // alert(err.response.data);
        }
    },
    loadPosts: throttle(async function({ commit, state }, payload){
        if(state.hasMorePost || (payload && payload.refresh)) {
            try {
                let lastPost;
                let res;
                if(payload && payload.refresh){
                    lastPost = undefined;
                }else{
                    lastPost = state.mainPosts[state.mainPosts.length - 1];
                }
                res = await this.$axios.get(`/posts?lastId=${lastPost && lastPost.id}&limit=10`)
                commit('loadPosts', {
                    data: res.data,
                    refresh: payload && payload.refresh
                });
            } catch (err) {
                console.error(err);
               // alert(err.response.data);
            }
        }
    }, 1000),
    loadUserPosts: throttle(async function({ commit, state }, payload){
        if(state.hasMorePost || (payload && payload.refresh)) {
            try {
                let lastPost;
                let res;
                if(payload && payload.refresh){
                    lastPost = undefined;
                }else{
                    lastPost = state.mainPosts[state.mainPosts.length - 1];
                }
                res = await this.$axios.get(`/user/${payload.userId}/posts?lastId=${lastPost && lastPost.id}&limit=10`)
                commit('loadPosts', {
                    data: res.data,
                    refresh: payload && payload.refresh
                });
            } catch (err) {
                console.error(err);
               // alert(err.response.data);
            }
        }
    }, 1000),
    loadHashtagPosts: throttle(async function({ commit, state }, payload){
        if(state.hasMorePost || (payload && payload.refresh)) {
            try {
                let lastPost;
                let res;
                if(payload && payload.refresh){
                    lastPost = undefined;
                }else{
                    lastPost = state.mainPosts[state.mainPosts.length - 1];
                }
                res = await this.$axios.get(`/hashtag/${payload.hashtag}?lastId=${lastPost && lastPost.id}&limit=10`)
                commit('loadPosts', {
                    data: res.data,
                    refresh: payload && payload.refresh
                });
            } catch (err) {
                console.error(err);
               // alert(err.response.data);
            }
        }
    }, 1000),
    async loadComments({ commit }, payload){
        try {
            const res = await this.$axios.get(`/post/${payload.postId}/comments`);
            res.data.PostId = payload.postId;
            commit('loadComments', res.data);
        } catch (err) {
            console.error(err);
            alert(err.response.data);
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
            alert(err.response.data);
        }
    },
    async modifyUploadImages({ commit }, payload){
        try{
            const res = await this.$axios.post('/post/images', payload, {
            withCredentials: true,
            });
            console.log(res.data);
            commit('concatModifyImagePaths', res.data);
        }catch(err){
            console.error(err);
            alert(err.response.data);
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
            alert(err.response.data);
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
            alert(err.response.data);
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
            alert(err.response.data);
        }
    }
}