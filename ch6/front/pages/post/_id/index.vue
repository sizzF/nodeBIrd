<template>
    <v-container v-if="post">
        <post-card :post="post" />
    </v-container>
    <v-container v-else>
        해당 아이디의 게시글이 존재하지 않습니다.
    </v-container>
</template>

<script>
import PostCard from '~/components/Postcard'
export default {
    components: {
        PostCard
    },
    fetch({ store, params }) {
        return store.dispatch('posts/loadPost', { postId: params.id });
    },
    computed: {
        post() {
            return this.$store.state.posts.mainPosts.find( v => v.id === parseInt(this.$route.params.id, 10));
        }
    },
    head() {
      return {
        title: `${this.post.User.nickname}님의 게시글`,
        meta: [{
          hid: 'desc', name: 'description', content: this.post.content,
        }, {
          hid: 'ogtitle', property: 'og:title', content: `${this.post.User.nickname}님의 게시글`,
        }, {
          hid: 'ogdesc', property: 'og:description', content: this.post.content,
        }, {
          hid: 'ogimage', property: 'og:image', content: this.post.Images && this.post.Images[0] ? this.post.Images[0].src : 'https://vue.nodebird.com/vue-nodebird.png',
        }, {
          hid: 'ogurl', property: 'og:url', content: `https://vue.nodebird.com/post/${this.post.id}`,
        }],
      };
    }
}
</script>

<style lang="stylus">

</style>