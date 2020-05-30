<template>
    <v-card style="margin-bottom:20px;">
        <v-container>    
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-textarea
                    v-model="content"
                    outlined
                    auto-grow
                    clearable
                    label="오늘하루 어떤 신기한 일이 있었나요?"
                    :hide-details="hideDetails"
                    :success-messages="successMessages"
                    :success="success"
                    :rules="[v => !!v || '내용을 입력하세요.']" 
                    @input="onChangeTextarea"
                    />
                <v-container>
                    <v-btn type="submit" color="green" style="color:white" absolute right>게시</v-btn>
                    <v-btn @click="onImageUpload">이미지 업로드</v-btn>                
                </v-container>
            </v-form>   
            </v-container>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            valid: false,
            hideDetails: true,
            successMessages:  '',
            success: false,
            content: '',
        }
    },
    computed: {
        ...mapState('users', ['me'])
    },
    methods: {
        onChangeTextarea(value) {
            if(value) {
                this.hideDetails = true;
                this.success = false;
                this.successMessages = '';
            }else{
                this.hideDetails = false;
            }
        },
        async onSubmitForm() {
            if(this.$refs.form.validate()) {
                try{
                    await this.$store.dispatch('posts/add', {
                    content: this.content,
                    user: {
                        nickname: this.me.nickname,
                    },
                    comments: [],
                    images: [],
                    id: Date.now(),
                    createdAt: Date.now(),
                })

                }catch{
                        alert('게시글 등록 실패');
                }
                this.content = '';
                this.hideDetails = false;
                this.success = true;
                this.successMessages = '게시글 등록 성공';
            }else{
                this.hideDetails = false;
            }
            
                    
        },

        onImageUpload() {
            alert('이미지 업로드 버튼 클릭');
        }
    },
}
</script>

<style lang="stylus">

</style>