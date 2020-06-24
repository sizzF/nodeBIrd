<template>
    <div :style="{ marginBottom: '20px' }">
        <v-card>
            <div v-if="post.RetweetId && post.Retweet">
                <v-subheader>{{post.User.nickname}}님이 리트윗 하셨습니다.</v-subheader>
                <v-card style="margin: 0 20px">
                    <post-content :post="post.Retweet" />
                </v-card>
            </div>
           <post-content v-else :post="post" />

            <v-card-actions>
                <v-btn text color="orange" @click="onRetweet">
                    <v-icon>mdi-twitter-retweet</v-icon>
                </v-btn>
                 <v-btn text color="orange" @click="onClickHeart">
                    <v-icon>{{ heartIcon }}</v-icon>
                </v-btn>
                 <v-btn text color="orange" @click="onToggleComment">
                    <v-icon>mdi-comment-outline</v-icon>
                </v-btn>
                <v-menu v-if="userId === post.User.id" offset-y open-on-hover>
                    <template v-slot:activator="{ on }">
                        <v-btn text color="orange" v-on="on">
                            <v-icon>mdi-dots-horizontal</v-icon>
                        </v-btn>
                    </template>   
                    <div style="background: white">
                        <v-btn text color="blue" @click="onPostEdit">수정</v-btn>
                        <v-btn text color="red" @click="onRemovePost">삭제</v-btn>
                    </div>                 
                </v-menu>
            </v-card-actions>
        </v-card>
        <template v-if="commentOpened">
            <v-card>
                <comment-form :post-id="post.id" />
                <v-list>
                    <v-list-item v-for="comment in post.Comments" :key="comment.id">
                        <v-list-item-avatar color="teal" style="color: white;">
                            <span>{{ comment.User.nickname[0] }}</span>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title><span>{{ comment.User.nickname }}</span></v-list-item-title>
                            <v-list-item-subtitle><span>{{ comment.content }}</span></v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
        </template>
    <post-modify v-if="postEdit" :post="post" :close-modal="closePostEdit" />
    </div>
</template>
<script>
import CommentForm from './CommentForm'
import PostContent from './PostContent'
import PostModify from './postModify'
export default {
    components: {
        CommentForm,
        PostContent,
        PostModify,
    },
    props: {
        post: { 
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            commentOpened: false, 
            postEdit: false,
        }
    },
    computed: {
        me(){
            return this.$store.state.users.me;
        },
        userId() {
            if (!!this.me){
                return this.me.id 
            }
            else{
                return [];
            }
        },
        liked(){
            const me = this.$store.state.users.me;
            return (this.post.Likers || []).find(v => v.id === (me && me.id));
        },
        heartIcon() {
            return this.liked ? 'mdi-heart' : 'mdi-heart-outline'
        }
    },
    methods: {
        onRetweet() {
            if(!this.me){
                return alert('로그인이 필요합니다.');
            }
            return this.$store.dispatch('posts/onRetweet', {
                postId: this.post.id,
            });
        },
        onClickHeart() {
            if(!this.me){
                return alert('로그인이 필요합니다.');//alert은 모달창으로 에러 페이지 띄우는걸로 바꾸자
            }
            if(this.liked){
                return this.$store.dispatch('posts/unlikePost', {
                    postId: this.post.id,
                });
            }
            return this.$store.dispatch('posts/likePost', {
                postId: this.post.id,
            });
        },
        onPostEdit() {
            this.postEdit=true;
            
        },
        closePostEdit() {
            this.postEdit = false;
            this.$store.commit('posts/deleteModifyImagePaths');
        },
        async onRemovePost() {
            try {
                 await this.$store.dispatch('posts/remove', {
                    postId: this.post.id
            });
                this.$store.commit('users/removePostId', { id: this.post.id });
            } catch (err) {
                console.error(err);
                alert(err);
            }
           
        },
        async onToggleComment() {//댓글쓰고 적용안되는건 post를 props로 받아와서그럼 나중에 댓글창을 따로 만들어
            try {
                if(!this.commentOpened){
                await this.$store.dispatch('posts/loadComments', {
                    postId: this.post.id
                });
            }
            this.commentOpened = !this.commentOpened;
           
            } catch (err) {
                console.error(err);
                alert(err);
            }
            
        }
    },
}
</script>
<style scoped>
    a {
        color: inherit;
        text-decoration: none;
    }
</style>