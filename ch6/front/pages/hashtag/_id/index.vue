<template>
    <div>
        <v-container>
            <div>
                <post-card v-for="post in mainPosts" :key="post.id" :post="post" />
            </div>
        </v-container>
    </div>
</template>

<script>
import PostCard from '~/components/PostCard'
export default {
    components: {
        PostCard,
    },
    fetch({ store, params }) {
       return store.dispatch('posts/loadHashtagPosts', { 
           hashtag: encodeURIComponent(params.id), 
           refresh: true 
           });
    },
    data() {
        return {
            name: 'nuxt.js',
        }
    },
    computed: {
        me() {
            return this.$store.state.users.me;
        },
        other() {
            return this.$store.state.users.other;
        },
        mainPosts() {
            return this.$store.state.posts.mainPosts;
        },
        hasMorePost() {
            return this.$store.state.posts.hasMorePost;
        }
    },

    mounted() {
        window.addEventListener('scroll',this.onScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll);
    },

    methods: {
        async onScroll() {
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 400){
                if(this.hasMorePost){
                    try{
                        await this.$store.dispatch('posts/loadHashtagPosts', { hashtag: this.$route.params.id });

                    }catch(err){
                        console.error(err);
                        alert('온스크롤 메소드 에러');
                    }
                }
               
            }
        }
    },

    

}
</script>

<style lang="stylus">

</style>