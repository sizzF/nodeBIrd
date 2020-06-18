<template>
    <div>
        <v-container>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>내 프로필</v-subheader>
                </v-container>
                <v-form ref="form" v-model="valid" @submit.prevent="onChangeNickname">
                    <v-container>
                        <v-text-field
                            v-model="nickname"
                            label="닉네임"
                            type="nickname"
                            :rules="nicknameRules"
                            required
                        />
                        <v-btn color="blue" type="submit">수정하기</v-btn>
                    </v-container>
                </v-form>
            </v-card>

            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로잉 {{ followingListLength }}</v-subheader>
                    <follow-list :follow-list="followingList" :remove="deleteFollowing" />
                    <v-btn v-if="hasMoreFollowing" dark color="blue" style="width: 100%;" @click="onLoadFollowings">더보기</v-btn>
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로워 {{ followerListLength }}</v-subheader>
                    <follow-list :follow-list="followerList" :remove="deleteFollower" />
                    <v-btn v-if="hasMoreFollower" dark color="blue" style="width: 100%;" @click="onLoadFollowers">더보기</v-btn>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import FollowList from '../components/FollowList'
export default {
    components: {
        FollowList,
    },
    fetch({ store }) {
        store.dispatch('users/loadFollowers');
        store.dispatch('users/loadFollowings');
    },
    data() {
        return {
            name: 'nuxt.js',
            nickname: '',
            valid: false,
            nicknameRules: [
                v => !!v || '닉네임을 입력하세요.'
            ],

        }
    },
    computed: {
        followerList() {
            return this.$store.state.users.followerList;
        },
        followingList() {
            return this.$store.state.users.followingList;
        },
        followerListLength() {
            return this.$store.state.users.followerList.length;
        },
        followingListLength() {
            return this.$store.state.users.followingList.length;
        },
        hasMoreFollowing() {
            return this.$store.state.users.hasMoreFollowing;
        },
        hasMoreFollower() {
            return this.$store.state.users.hasMoreFollower;
        }
    },
    methods: {
        async onChangeNickname() {
            if(this.$refs.form.validate()){
                try{
                    await this.$store.dispatch('users/changeNickname', {
                    nickname: this.nickname
                });
                }catch(err) {
                    console.error(err);
                    alert('닉네임 수정 에러.');
                }
            }
        },
        async deleteFollower(id){
            try{
                await this.$store.dispatch('users/deleteFollower',{ id })
            }catch(err){
                console.error(err);
                alert('팔로워 삭제 에러');
            }
        },
        async deleteFollowing(id){
            try{
                await this.$store.dispatch('users/deleteFollowing',{ id })
            }catch(err){
                console.error(err);
                alert('팔로잉 삭제 에러');
            }
        },
        async onLoadFollowings(){
            try{
                await this.$store.dispatch('users/loadFollowings');
            }catch(err){
                console.error(err);
                alert('팔로잉 더보기 에러');
            }
        },
         async onLoadFollowers(){
            try{
                await this.$store.dispatch('users/loadFollowers');
            }catch(err){
                console.error(err);
                alert('팔로워 더보기 에러');
            }
        }
    },

    head() {
        return {
            title: '프로필',
        }
    },

    middleware: 'authenticated',

}
</script>

<style lang="stylus">

</style>