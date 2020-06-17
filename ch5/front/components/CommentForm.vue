<template>
    <v-form ref="form" vmodel="valid" style="position: relative" @submit.prevent="onSubmitForm">
        <v-textarea 
            v-model="content" 
            filled
            label="댓글 달기"
            :hide-details="hideDetails"
            :success="success"
            :success-messages="successMessages"
            @input="onChangeTextarea"
            />
        <v-btn color="green" absolute top right style="color: white" type="submit">등록</v-btn>
    </v-form>
</template>

<script>
export default {
    props: {
        postId: {
            type: Number,
            required: true,
        }
    },
    data() {
        return {
            valid: false,
            content: '',
            hideDetails: true,
            success: false,
            successMessages : '',
        }
    },
    computed: {
        me() {
            return this.$store.state.users.me;
        }
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
                if(this.$refs.form.validate()){
                    try{
                        await this.$store.dispatch("posts/addComment", {
                            postId: this.postId,
                            content: this.content,
                        });
                    }catch{
                        alert('댓글작성 에러');
                    }

                    this.content = '';
                    this.success = true;
                    this.successMessages = '댓글이 작성되었습니다.';
                    this.hideDetails = false;

                }
            }
        },

}
</script>

<style lang="stylus">

</style>