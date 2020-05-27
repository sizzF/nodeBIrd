<template>
    <v-container>
        <v-card>
            <v-form ref="form" v-model="valid" @submit.prevent="onLoginForm">
                <v-container>
                    <v-text-field
                        v-model="email"
                        label="이메일"
                        type="email"
                        :rules="emailRules"
                        required
                        prepend-icon="mdi-account"
                    />
                    <v-text-field
                        v-model="password"
                        label="비밀번호"
                        type="password"
                        :rules="passwordRules"
                        required
                        prepend-icon="mdi-lock"
                    />
                    <v-btn color="green" type="submit" :disabled="!valid">로그인</v-btn>
                    <v-btn nuxt to="/signup">회원가입</v-btn>
                </v-container>
            </v-form>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            valid: false,
            email: '',
            password: '',
            emailRules: [
                v => !!v || '이메일은 필수입니다.',
                v => /.+@+/.test(v) || '유효하지 않은 이메일입니다.'
            ],
            passwordRules: [
                v => !!v || '비밀번호는 필수입니다.',
            ],
        }
    },
    methods: {
        onLoginForm(){
            if(this.$refs.form.validate()){
                alert('로그인시도');
            }else{
                alert('잘못입력');
            }
        }
    },
}
</script>

<style lang="stylus">

</style>