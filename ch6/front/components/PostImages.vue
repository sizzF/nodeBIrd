<template>
    <div v-if="images.length === 0" />
    <div v-else-if="images.length === 1">
        <v-img
            :src="images[0].src"
            contain
            aspect-ratio="2"
            @click="zoomImages"
        />
        <image-zoom v-if="imageZoomed" :images="images" :close-modal="closeModal" />
    </div>
    <div v-else-if="images.length === 2" style="display: flex">
        <v-img
            :src="String(images[0].src).replace(`/original\//`, 'thumb/')"
            contain
            aspect-ratio="2"
            style="flex: 1"
            @click="zoomImages"
        />
        <v-img
            :src="String(images[1].src).replace(`/original\//`, 'thumb/')"
            contain
            aspect-ratio="2"
            style="flex: 1"
            @click="zoomImages"
        />
        <image-zoom v-if="imageZoomed" :images="images" :close-modal="closeModal" />
    </div>
    <div v-else-if="images.length > 2" style="display: flex">
        <v-img
            :src="String(images[0].src).replace(`/original\//`, 'thumb/')"
            contain
            aspect-ratio="2"
            style="flex: 1"
            @click="zoomImages"
        />
       <div style="flex: 1; align-items: center; justify-content: center; display: flex" @click="zoomImages">
           <div style="text-align: center">
                <v-icon>mdi-dots-horizontal</v-icon>
                <div>{{images.length-1}}개 더보기</div>
           </div>
       </div>
        <image-zoom v-if="imageZoomed" :images="images" :close-modal="closeModal" />
    </div>
</template>

<script>
import ImageZoom from './ImageZoom'

export default {
    components: {
        ImageZoom
    },
     props: {
        images: { 
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            imageZoomed: false,
        }
    },
    methods: {
        closeModal() {
            this.imageZoomed = false;
        },
        zoomImages() {
            this.imageZoomed = true;
        }
    },
}

</script>

<style lang="stylus">

</style>