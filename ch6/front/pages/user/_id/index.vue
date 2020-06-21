<template>
    <div>
        <v-container>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    {{other.nickname}}
                    <div style="display: flex; text-align: center;">
                    <v-card height="60px" style="flex: 1">
                        <div style="margin-top: 5px">게시글</div>
                        <div>{{ other.Posts.length }}</div>    
                    </v-card>
                   <v-card height="60px" style="flex: 1">
                        <div style="margin-top: 5px">팔로우</div>
                        <div>{{other.Followings.length}}</div>    
                    </v-card>
                    <v-card height="60px" style="flex: 1">
                        <div style="margin-top: 5px">팔로워</div>
                        <div>{{other.Followers.length}}</div>    
                    </v-card>
                </div>
                </v-container>
            </v-card>
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
       return Promise.all([
           store.dispatch('users/loadOther', { userId: params.id }),
           store.dispatch('posts/loadUserPosts', { userId: params.id, refresh: true })
           ]);
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
                        await this.$store.dispatch('posts/loadUserPosts', { userId: this.$route.params.id });

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