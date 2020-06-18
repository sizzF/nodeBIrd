<template>
    <div :style="{ marginBottom: '20px' }">
        <v-card>
            <post-images :images="post.Images || []" />
            <v-card-text>
                <div>
                    <h2>
                        <nuxt-link :to="'/user/' + post.id">{{ post.User.nickname }}</nuxt-link>
                    </h2>
                    <div>{{ post.content }}</div>
                    
                    <!--<nuxt-link :to="'/post/' + post.id">{{ post.content }}</nuxt-link>-->
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn text color="orange">
                    <v-icon>mdi-twitter-retweet</v-icon>
                </v-btn>
                 <v-btn text color="orange">
                    <v-icon>mdi-heart-outline</v-icon>
                </v-btn>
                 <v-btn text color="orange" @click="onToggleComment">
                    <v-icon>mdi-comment-outline</v-icon>
                </v-btn>
                <v-menu offset-y open-on-hover>
                    <template v-slot:activator="{ on }">
                        <v-btn text color="orange" v-on="on">
                            <v-icon>mdi-dots-horizontal</v-icon>
                        </v-btn>
                    </template>   
                    <div style="background: white">
                        <v-btn text color="blue" @click="onEditPost">수정</v-btn>
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
    </div>
</template>
<script>
import CommentForm from './CommentForm'
import PostImages from './PostImages'
export default {
    components: {
        CommentForm,
        PostImages,
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
        }
    },
    methods: {
        onEditPost() {
            this.$store.dispatch('posts/remove', {
                postId: this.post.id
            });

        },
        onRemovePost() {
            this.$store.dispatch('posts/remove', {
                postId: this.post.id
            });
        },
        async onToggleComment() {
            try {
                if(!this.commentOpened){
                await this.$store.dispatch('posts/loadComments', {
                    postId: this.post.id
                });
            }
            this.commentOpened = !this.commentOpened;

            } catch (err) {
                console.error(err);
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