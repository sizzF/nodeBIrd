import Vue from 'vue';
import throttle from 'lodash.throttle';

export const state = () => ({
    me: null, //로그인 상태확인
    followerList: [],
    followingList: [],
    hasMoreFollower: true,
    hasMoreFollowing: true,
    other: null,
});

const totalFollower = 8;
const totalFollowing = 7;
const limit = 3;

export const mutations = { //동기적 작업
    SETME(state, payload) {
        state.me = payload;
    },
    setOther(state, payload) {
        state.other = payload;
    },
    changeNickname(state, payload) {
        state.me.nickname = payload.nickname;
    },
    loadFollowers(state, payload) {
        if (payload.refresh) {
            state.followerList = payload.data;
            state.hasMoreFollower = payload.data.length === limit;
        } else {
            state.followerList = state.followerList.concat(payload.data);
            state.hasMoreFollower = payload.data.length === limit;
        }
    },
    loadFollowings(state, payload) {
        if (payload.refresh) {
            state.followingList = payload.data;
            state.hasMoreFollowing = payload.data.length === limit;
        } else {
            state.followingList = state.followingList.concat(payload.data);
            state.hasMoreFollowing = payload.data.length === limit;
        }
    },
    following(state, payload) {
        state.me.Followings.push({ id: payload.userId });
    },
    removeFollower(state, payload) {
        let index = state.followerList.findIndex(v => v.id === payload.userId);
        state.followerList.splice(index, 1);
        index = state.me.Followers.findIndex(v => v.id === payload.userId);
        state.me.Followers.splice(index, 1);

    },
    removeFollowing(state, payload) {
        let index = state.me.Followings.findIndex(v => v.id === payload.userId);
        state.me.Followings.splice(index, 1);
        index = state.followingList.findIndex(v => v.id === payload.userId);
        state.followingList.splice(index, 1);
    },
    addPostId(state, payload) {
        state.me.Posts.push({ id: payload.id });
    },
    removePostId(state, payload) {
        const index = state.me.Posts.findIndex(v => v.id === payload.id);
        state.me.Posts.splice(index, 1);
    }

};

export const actions = { //비동기적 작업 동기도됨
    async loadUser({ commit }) {
        try {
            const res = await this.$axios.get('/user', {
                withCredentials: true,
            });
            commit('SETME', res.data);
        } catch (err) {
            console.error(err);
            //    alert(err.response.data);
        }

    },
    async loadOther({ commit }, payload) {
        try {
            const res = await this.$axios.get(`/user/${payload.userId}`, {
                withCredentials: true,
            });
            commit('setOther', res.data);
        } catch (err) {
            console.error(err);
            //    alert(err.response.data);
        }

    },
    signUp: throttle(async function(context, payload) { //context안에는 {commit, dispatch, state, rootState ,getters, rootGetters }
        //서버에 회원가입 요청
        try {
            const res = await this.$axios.post('/user', {
                email: payload.email,
                password: payload.password,
                nickname: payload.nickname
            }, {
                withCredentials: true,
            }); //user사용자를 post생성하다
            //context.dispatch('logIn', res.data);
        } catch (err) {
            console.error(err);
            alert(err.response.data);
        }


    }, 5000),

    logIn: throttle(async function(context, payload) {
        try {
            const res = await this.$axios.post('/user/login', {
                email: payload.email,
                password: payload.password
            }, {
                withCredentials: true,
            });
            context.commit('SETME', res.data);
        } catch (err) {
            console.error(err);
            alert('로그인 실패');

        }

    }, 5000),

    logOut: throttle(async function(context, payload) {
        try {
            const data = await this.$axios.post('/user/logout', {}, {
                withCredentials: true,
            });
            context.commit('SETME', null);
        } catch (err) {
            console.error(err);
            alert(err.response.data);
        }
    }, 5000),

    changeNickname: throttle(async function({ commit }, payload) {
        try {
            const res = await this.$axios.patch('/user/nickname', { nickname: payload.nickname }, {
                withCredentials: true,
            });
            commit('changeNickname', payload);
        } catch (err) {
            console.error(err);
            alert(err.response.data);
        }
    }, 3000),
    async removeFollower({ commit }, payload) {
        try {
            const res = await this.$axios.delete(`/user/${payload.userId}/follower`, {
                withCredentials: true,
            });
            commit('removeFollower', { userId: payload.userId });
        } catch (err) {
            console.error(err);
            alert(err.response.data);
        }
    },
    async loadFollowers({ commit, state }, payload) {
        try {
            if (state.hasMoreFollower || (payload && payload.refresh)) {
                let lastId = state.followerList[state.followerList.length - 1];
                if (payload && payload.refresh) {
                    lastId = undefined;
                }
                const res = await this.$axios.get(`/user/${state.me.id}/followers?limit=3&lastId=${lastId && lastId.id}`, {
                    withCredentials: true,
                });
                commit('loadFollowers', {
                    data: res.data,
                    refresh: payload && payload.refresh,
                });
            }
        } catch (err) {
            console.error(err);
            alert(err.response.data);
        }

    },
    async loadFollowings({ commit, state }, payload) {
        try {
            if (state.hasMoreFollowing || (payload && payload.refresh)) {
                let lastId = state.followingList[state.followingList.length - 1];
                if (payload && payload.refresh) {
                    lastId = undefined;
                }
                const res = await this.$axios.get(`/user/${state.me.id}/followings?limit=3&lastId=${lastId && lastId.id}`, {
                    withCredentials: true,
                });
                commit('loadFollowings', {
                    data: res.data,
                    refresh: payload && payload.refresh,
                });
            }
        } catch (err) {
            console.error(err);
            alert(err.response.data);
        }

    },

    async follow({ commit }, payload) {
        try {
            const res = await this.$axios.post(`/user/${payload.userId}/follow`, {}, {
                withCredentials: true
            });
            commit('following', {
                userId: payload.userId,
            });
        } catch (err) {
            console.error(err);
            alert(err.response.data);
        }
    },

    async unFollow({ commit }, payload) {
        try {
            const res = await this.$axios.delete(`/user/${payload.userId}/follow`, {
                withCredentials: true
            });
            commit('removeFollowing', {
                userId: payload.userId,
            });
        } catch (err) {
            console.error(err);
            alert(err.response.data);
        }
    },



};