<template>
    <v-app>
        <nav>
            <v-toolbar dark color="green">
                <v-toolbar-title>
                    <nuxt-link to="/" :style="{ color:'white', textDecoration:'none' }">NodeBird</nuxt-link>
                </v-toolbar-title>
                <v-spacer />
                <v-toolbar-items>
                    <v-form @submit.prevent="onSearchHashtag">
                        <div :style="{ display: 'flex', height: '100%', alignItems: 'center' }">
                            <v-text-field
                            v-model="hashtag"
                                label="검색" 
                                hide-details prepend-icon="mdi-magnify" 
                                :style="{ display: 'flex', alignItems: 'center' }" 
                            />
                        </div>
                    </v-form>
                    
                    <v-btn v-if="me" text nuxt to="/profile">
                        프로필
                    </v-btn>
                    <v-btn v-else text nuxt to="/signup">
                        회원가입
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
        </nav>
        <v-row no-gutters>
            <v-col cols="12" md="4">
                <login-form />
            </v-col>
            <v-col cols="12" md="8">
                <nuxt />    
            </v-col>
        </v-row>
    </v-app>
</template>

<script>
import LoginForm from '../components/LoginForm';

export default {
    components: {
        LoginForm
    },    
    data(){
        return {
            hashtag: '',
        };
    },
    computed: {
        name() {
            return this.$store.state.posts.name;
        },
        me() {
            return this.$store.state.users.me;
        }
    },
    methods: {
        onChangeName() {
            this.$store.commit('posts/BYE');
        },
        onSearchHashtag() {
            this.$router.push({
                path: `/hashtag/${encodeURIComponent(this.hashtag)}`,
            });
            this.hashtag = '';
        }
    },
}
</script>

<style lang="stylus">

</style>