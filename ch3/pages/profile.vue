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
                    <v-subheader>팔로잉</v-subheader>
                    <follow-list :follow-list="followingList" :option="followingOption" />
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로워</v-subheader>
                    <follow-list :follow-list="followerList" :option="followerOption" />
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
    data() {
        return {
            name: 'nuxt.js',
            nickname: '',
            valid: false,
            nicknameRules: [
                v => !!v || '닉네임을 입력하세요.'
            ],
            followerOption: 'follower',
            followingOption: 'following',

        }
    },
    computed: {
        followerList() {
            return this.$store.state.users.followerList;
        },
        followingList() {
            return this.$store.state.users.followingList;
        }
    },
    methods: {
        async onChangeNickname() {
            if(this.$refs.form.validate()){
                try{
                    await this.$store.dispatch('users/changeNickname', {
                    nickname: this.nickname
                });
                }catch {
                    alert('닉네임 수정 에러.');
                }
            }
        }
    },

    head() {
        return {
            title: '프로필',
        }
    },

}
</script>

<style lang="stylus">

</style>