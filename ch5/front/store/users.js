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
    loadFollowers(state, payload){
        if(payload.offset === 0) {
            state.followerList = payload.data;
        } else {
            state.followerList = state.followerList.concat(payload.data);
            state.hasMoreFollower = payload.data.length === limit;
        }
    },
    loadFollowings(state, payload){
        if(payload.offset === 0) {
            state.followingList = payload.data;
        } else {
            state.followingList = state.followingList.concat(payload.data);
            state.hasMoreFollowing = payload.data.length === limit;    
        }
    },
    following(state, payload){
        state.me.Followings.push({ id: payload.userId });
    },
    removeFollower(state, payload) {
        const index = state.followerList.findIndex( v => v.id === payload.userId);
        state.me.Followers.splice(index, 1);    
    },
    removeFollowing(state, payload) {
        const index = state.me.Followings.findIndex( v => v.id === payload.userId);
        state.me.Followings.splice(index, 1);    
    },

};

export const actions = { //비동기적 작업 동기도됨
    async loadUser({ commit }) {
        try {
            const res = await this.$axios.get('/user',{
                withCredentials: true,
            });
            commit('SETME', res.data);
        } catch (err) {
            console.error(err);
            // alert(err.response.data);
        }
      
    },

    async signUp(context, payload) { //context안에는 {commit, dispatch, state, rootState ,getters, rootGetters }
        //서버에 회원가입 요청
        try{
            const res = await this.$axios.post('/user',{
                email: payload.email,
                password: payload.password,
                nickname: payload.nickname
            },{
                withCredentials: true,
            });//user사용자를 post생성하다
            //context.dispatch('logIn', res.data);
        }catch(err){
            console.error(err);
            // alert(err.response.data);
        }
        
       
    },

    async logIn(context, payload) {
        try{
            const res = await this.$axios.post('/user/login',{
                email: payload.email,
                password: payload.password
            }, {
                withCredentials: true,
            });
            context.commit('SETME', res.data);
        }catch(err){
            console.error(err);
            // alert(err.response.data);
            
        }
       
    },

    async logOut(context, payload) {
        try{
            const data = await this.$axios.post('/user/logout',{},{
                withCredentials: true,
            });
            context.commit('SETME', null);
        }catch(err){
            console.error(err);
            // alert(err.response.data);
        }
    },
    async changeNickname({ commit }, payload){
        try {
            const res = await this.$axios.patch('/user/nickname', { nickname: payload.nickname }, {
                withCredentials: true,
            });
            commit('changeNickname', payload);
        } catch (err) {
            console.error(err);
        }
    },
    deleteFollower({ commit }, payload){
        commit('deleteFollower', payload);
    },
    deleteFollowing({ commit }, payload){
        commit('deleteFollowing', payload);
    },
    async loadFollowers({ commit, state }, payload){
        try {
                if (!(payload && payload.offset === 0) && !state.hasMoreFollowing) {
                    return;
                }
            if(state.hasMoreFollower){
                const offset = state.followerList.length;
                if (payload && payload.offset === 0){
                    offset = 0;
                }
                const res = await this.$axios.get(`/user/${state.me.id}/followers?limit=3&offset=${offset}`, {
                    withCredentials: true,
                });
                commit('loadFollowers', {
                    data: res.data,
                    offset,
                });
            }
        } catch (err) {
            console.error(err);
        }
        
    },
    async loadFollowings({ commit, state }, payload){
        try {
            if (!(payload && payload.offset === 0) && !state.hasMoreFollowing) {
                return;
            }
            if(state.hasMoreFollowing){
                const offset = state.followingList.length;
                if (payload && payload.offset === 0){
                    offset = 0;
                }
                const res = await this.$axios.get(`/user/${state.me.id}/followings?limit=3&offset=${offset}`, {
                    withCredentials: true,
                });
                commit('loadFollowings', {
                    data: res.data,
                    offset,
                });
            }
        } catch (err) {
            console.error(err);
        }
        
    },

    async follow({ commit }, payload){
        try {
            const res= await this.$axios.post(`/user/${payload.userId}/follow`, {}, {
                withCredentials: true
            });
            commit('following', {
                userId: payload.userId,
            });
        } catch (err) {
            console.error(err);
            // alert(err.response.data);
        }
    },

    async unFollow({ commit }, payload){
        try {
            const res= await this.$axios.delete(`/user/${payload.userId}/follow`, {
                withCredentials: true
            });
            commit('removeFollowing', {
                userId: payload.userId,
            });
        } catch (err) {
            console.error(err);
            // alert(err.response.data);
        }
    },

};