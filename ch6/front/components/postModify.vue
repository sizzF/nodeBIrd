<template>
<div id="image-zoom">
        <header>
            <h1>게시글 수정</h1>
            <v-icon id="close-btn" @click="closeModal">mdi-close</v-icon>
        </header>
    <v-card style="margin-bottom:20px;">
        <v-container>    
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-textarea
                    v-model="content"
                    outlined
                    auto-grow
                    auto-focus
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
                    <input ref="imageInput" type="file" multiple hidden @change="onChangeImages">
                    <v-btn type="button" @click="onClickImageUpload">이미지 업로드</v-btn>
                    <div>
                        <div v-for="(p, i) in modifyImagePaths" :key="p" style="display: inline-block; margin-right: 10px;">
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
</div>
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
            content: this.post.content,
        }
    },
     props: {
        post: {
            type: Object,
            required: true,
        },
        closeModal: {
            type: Function,
            required: true,
        }

    },
    computed: {
        ...mapState('users', ['me']),
        ...mapState('posts', ['modifyImagePaths']),


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
                    await this.$store.dispatch('posts/update', {
                    postId: this.post.id,
                    content: this.content,
                    })
                    this.content = '';
                    this.hideDetails = false;
                    this.success = true;
                    this.successMessages = '게시글 등록 성공';

                    this.closeModal();
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
            this.$store.dispatch('posts/modifyUploadImages', imageFormData);
        },
        onRemoveImage(index){
            this.$store.commit('posts/removeModifyImagePath', index);
        }
    },
    mounted() {
        const imagePaths = this.post.Images.map( v => v.src);
        this.$store.commit('posts/concatModifyImagePaths', imagePaths);
    }
}
</script>

<style scoped>
    #image-zoom {
        position: fixed;
        z-index: 5000;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    #image-zoom header {
        height: 44px;
        background: white;
        position: relative;
        padding: 0;
        text-align: center;
    }
    #image-zoom header h1 {
        margin: 0;
        font-size: 17px;
        color: #333;
        line-height: 44px;
    }
    #close-btn {
    position: absolute;
    right: 0;
    top: 0;
    padding: 15px;
    line-height: 14px;
    cursor: pointer;
  }
</style>