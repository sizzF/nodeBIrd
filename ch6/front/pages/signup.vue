<template>
    <v-container>
            <v-alert v-if="finish" type="success">
                회원가입 완료
            </v-alert>
        <v-card>
            <v-subheader>회원가입</v-subheader>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-container>
                    <v-text-field
                        v-model="email"
                        label="이메일"
                        type="email"
                        :rules="emailRules"
                        required
                    />
                    <v-text-field
                        v-model="password"
                        label="비밀번호"
                        type="password"
                        :rules="passwordRules"
                        required
                    />
                    <v-text-field
                        v-model="passwordCheck"
                        label="비밀번호 확인"
                        type="password"
                        :rules="passwordCheckRules"
                        required
                    />
                    <v-text-field
                        v-model="nickname"
                        label="닉네임"
                        type="nickname"
                        :rules="nicknameRules"
                        required
                    />
                    <v-checkbox
                        v-model="terms"
                        :rules="termsRules"
                        required
                        label="정보제공에 동의합니다."
                    />
                    <v-btn color="green" type="submit" :disabled="!valid">가입하기</v-btn>
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
            passwordCheck: '',
            nickname: '',
            terms: false,
            finish: false,
            emailRules: [
                v => !!v || '이메일은 필수입니다.',
                v => /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(v) || '유효하지 않은 이메일입니다.'
            ],
            passwordRules: [
                v => !!v || '비밀번호는 필수입니다.',
            ],
            passwordCheckRules: [
                v => !!v || '비밀번호 확인은 필수입니다.',
                v => v === this.password || '비밀번호가 일치하지 않습니다.'
            ],
            nicknameRules: [
                v => !!v || '닉네임은 필수입니다.',
            ],
            termsRules: [
                v => !!v || '약관에 동의해야 합니다.'
            ]

        };
    },
    computed: {
        me() {
            return this.$store.state.users.me;
        }
    },
    watch: {
        me(value, oldvalue) {
            if(value){
                this.$router.push({
                    path: '/',
                });
            }
        }
    },
    methods: {
        async onSubmitForm(){
            if(this.$refs.form.validate()){
                try{
                    await this.$store.dispatch('users/signUp', {
                        email: this.email,
                        password: this.password,
                        nickname: this.nickname,
                    });
                    this.finish=true;
                    this.$router.push('/');
                }catch(err){
                    console.error(err);

            }
                
            }else{
                alert('폼이 유효하지 않습니다.');
            }
        }
    },
    head() {
        return {
            title: '회원가입',
        }
    },
    middleware: 'anonymous',

    
}
</script>

<style lang="stylus">

</style>