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
                        <v-btn dark color="blue" type="submit">수정하기</v-btn>
                    </v-container>
                </v-form>
            </v-card>

            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로잉 
                        <span v-if="me">{{ me.Followings.length }}</span>
                    </v-subheader>
                    <follow-list :follow-list="followingList" :remove="removeFollowing" />
                    <v-btn v-if="hasMoreFollowing" dark color="blue" style="width: 100%;" @click="onLoadFollowings">더보기</v-btn>
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로워 
                        <span v-if="me">{{ me.Followers.length }}</span>
                    </v-subheader>
                    <follow-list :follow-list="followerList" :remove="removeFollower" />
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
        return Promise.all([
            store.dispatch('users/loadFollowings', { refresh: true }),
            store.dispatch('users/loadFollowers', { refresh: true }),
        ]);
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
        me() {
            return this.$store.state.users.me;
        },
        followerList() {
            return this.$store.state.users.followerList;
        },
        followingList() {
            return this.$store.state.users.followingList;
        },
        hasMoreFollowing() {
            return this.$store.state.users.hasMoreFollowing;
        },
        hasMoreFollower() {
            return this.$store.state.users.hasMoreFollower;
        }
    },
    watch: {
        me(value, oldvalue) {
            if(!value){
                this.$router.push({
                    path: '/',
                });
            }
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
        async removeFollower(userId){
            try{
                await this.$store.dispatch('users/removeFollower',{ userId })
            }catch(err){
                console.error(err);
                alert('팔로워 삭제 에러');
            }
        },
        async removeFollowing(userId){
            try{
                await this.$store.dispatch('users/unFollow',{ userId })
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