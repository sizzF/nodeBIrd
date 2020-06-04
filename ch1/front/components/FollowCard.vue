<template>
    <v-card max-width="150px">
        <v-container>
            <span>{{ follow.nickname }}</span>
            <v-icon @click="onDeleteFollow">mdi-minus-circle-outline</v-icon>
        </v-container>
    </v-card>
</template>

<script>
export default {
    props: {
        follow: { 
            type: Object,
            required: true,
        },
        option: {
            type: String,
            required: true,
        }
    },
    methods: {
        async onDeleteFollow() {
            if(this.option === 'follower'){
                try{
                    await this.$store.dispatch('users/deleteFollower', {
                        id: this.follow.id
                    });
                }catch{
                    alert('팔로워 삭제 에러');
                }
            }else if(this.option === 'following'){
                try{
                    await this.$store.dispatch('users/deleteFollowing', {
                        id: this.follow.id
                    });
                }catch{
                    alert('팔로잉 삭제 에러');
                }
            }
        }
    },
}
</script>

<style lang="stylus">

</style>