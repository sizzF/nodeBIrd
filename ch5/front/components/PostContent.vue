<template>
    <div>
        <post-images :images="post.Images || []" />
        <v-card-title>
            <h3>
                <nuxt-link :to="'/post/' + post.id">{{ post.User.nickname }}</nuxt-link>
                <v-btn v-if="canFollow" @click="onFollow">팔로우</v-btn>
                <v-btn v-if="canUnFollow" @click="onUnFollow">언팔로우</v-btn>
            </h3>
        </v-card-title>
        <v-card-text>
            <div> 
                <div>{{ post.content }}</div>
            </div>
        </v-card-text>
    </div>
</template>

<script>
import PostImages from './PostImages'
export default {
    components: {
        PostImages,
    },
    props: {
        post: { 
            type: Object,
            required: true,
        }
    },
    computed: {
        me() {
            return this.$store.state.users.me;
        },
        canFollow() {//로그인했는지, 게시글작성자 나아님, 이미 팔로우 안한사람
            return this.me && this.post.User.id !== this.me.id && !this.me.Followings.find( v => v.id === this.post.User.id);
        },
        canUnFollow() {//로그인했는지, 게시글작성자 나아님, 이미 팔로우 안한사람
            return this.me && this.post.User.id !== this.me.id && this.me.Followings.find( v => v.id === this.post.User.id);
        }
    },
    
    methods: {
        onFollow() {
            this.$store.dispatch('users/follow', {
                userId: this.post.User.id,
            });
        },
        onUnFollow() {
            this.$store.dispatch('users/unFollow', {
                userId: this.post.User.id,
            });
        },
    }
    
}
</script>

<style scoped>
    a {
        text-decoration: none;
        color: inherit;
    }
</style>