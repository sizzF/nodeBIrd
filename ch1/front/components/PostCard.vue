<template>
        <v-card :style="{ marginBottom: '20px' }">
            <v-image />
            <v-card-text>
                <div>
                    <h3>닉네임</h3>
                    <div>게시글 예시</div>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn text color="orange">
                    <v-icon>mdi-twitter-retweet</v-icon>
                </v-btn>
                 <v-btn text color="orange">
                    <v-icon>mdi-heart-outline</v-icon>
                </v-btn>
                 <v-btn text color="orange">
                    <v-icon>mdi-comment-outline</v-icon>
                </v-btn>
                 <v-btn text color="orange">
                    <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
</template>
<script>
export default {
    
}
</script>
<style lang="stylus">

</style>