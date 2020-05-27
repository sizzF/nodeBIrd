<template>
    <div>
        <v-container>
            <post-card />
            <post-card />
            <post-card />
            <post-card />
            <post-card />
            <post-card />
            <post-card />
            <post-card />
            <post-card />
        </v-container>
    </div>
</template>

<script>
import PostCard from '../components/PostCard'
export default {
    components: {
        PostCard
    },
    data() {
        return {
            name: 'nuxt.js'
        }
    },

}
</script>

<style lang="stylus">

</style>