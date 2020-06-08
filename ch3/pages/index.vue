<template>
    <div>
        <v-container>
            <post-form v-if="me" />
            <div>
                <post-card v-for="post in mainPosts" :key="post.id" :post="post" />
            </div>
        </v-container>
    </div>
</template>

<script>
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
export default {
    components: {
        PostCard,
        PostForm
    },
    fetch({ store }) {
        store.dispatch('posts/loadPosts');
    },
    data() {
        return {
            name: 'nuxt.js'
        }
    },
    computed: {
        me() {
            return this.$store.state.users.me;
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
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 250){
                if(this.hasMorePost){
                    try{
                        this.$store.dispatch('posts/loadPosts');

                    }catch{
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