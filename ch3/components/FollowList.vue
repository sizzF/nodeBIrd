<template>
    <v-container>
        <v-flex flex-direction: row>
            <follow-card v-for="follow in followList" :key="follow.id" :follow="follow" :option="option" style="margin-right:10px" />
        </v-flex>
    </v-container>
</template>

<script>
import FollowCard from './FollowCard'
export default {
    components: {
        FollowCard,
    },
    props: {
        followList: { 
            type: Array,
            required: true,
        },
        option: {
            type: String,
            required: true,
        }
    },
}
</script>

<style lang="stylus">

</style>