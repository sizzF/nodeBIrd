<template>
    <v-card style="margin-bottom:20px;">
        <v-container>    
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-textarea
                    v-model="content"
                    counter=300
                    outlined
                    auto-grow
                    label="오늘하루 어떤 신기한 일이 있었나요?"
                    :success-messages="successMessages"
                    :success="success"
                    :rules="rules" 
                    @input="onChangeTextarea"
                    />
                <v-container>
                    <v-btn type="submit" color="green" style="color:white" absolute right>게시</v-btn>
                    <input ref="imageInput" type="file" multiple hidden @change="onChangeImages">
                    <v-btn type="button" @click="onClickImageUpload">이미지 업로드</v-btn>
                    <div>
                        <div v-for="(p, i) in imagePaths" :key="p" style="display: inline-block; margin-right: 10px;">
                            <img :src="p" :alt="p" style="width: 200px">
                            <div>
                                <v-btn type="button" @click="onRemoveImage(i)">제거</v-btn>
                            </div>
                        </div>
                    </div>                
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
            rules: [
                v => !!v || '내용을 입력해주세요',
                v => v.length <= 300 || '최대 300자'
             ]
        }
    },
    computed: {
        ...mapState('users', ['me']),
        ...mapState('posts', ['imagePaths'])

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
                    })
                    this.success = true;
                    this.successMessages = '게시글 등록 성공';
                    this.content = '성공';

                    this.$store.commit('users/addPostId', {
                        id: this.$store.state.posts.mainPosts[0].id
                    });
                }catch(err){
                    console.error(err);
                    alert('게시글 등록 실패');
                }
                
            }else{
                this.hideDetails = false;
            }       
        },

        onClickImageUpload() {
            this.$refs.imageInput.click();
        },
        onChangeImages(e) {
            const imageFormData = new FormData();
            [].forEach.call(e.target.files, (f) => {//유사배열의 값 가져오는 방식
                imageFormData.append('image', f); // [image: [file1, file2]]
            });
            this.$store.dispatch('posts/uploadImages', imageFormData);
        },
        onRemoveImage(index){
            this.$store.commit('posts/removeImagePath', index);
        }
    },
}
</script>

<style lang="stylus">

</style>