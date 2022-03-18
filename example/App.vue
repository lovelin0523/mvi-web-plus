<template>
    <div class="mvi-mt-10 mvi-mx-10 mvi-text-center">
        <m-button square @click="change" form-control type="success">打开图片预览</m-button>
    </div>
    <m-image-preview show-control  v-model="show" :images="images"></m-image-preview>
</template>

<script>
import { ref, reactive, inject } from 'vue'
export default {
    name: 'App',
    data() {
        return {
            show:false,
            images: [
                "https://www.mvi-web.cn/mvi-resources/images/mvi_image_4_1624705387843.jfif",
                "https://www.mvi-web.cn/mvi-resources/images/mvi_image_3_1624705387828.jfif",
                "https://www.mvi-web.cn/mvi-resources/images/mvi_image_2_1624705387812.jfif",
                "https://www.mvi-web.cn/mvi-resources/images/mvi_image_1_1624705387797.jfif",
                "https://www.mvi-web.cn/mvi-resources/images/mvi_image_0_1624705387765.jfif"
            ]
        }
    },
    mounted() {},
    methods: {
        change() {
            this.show = !this.show
        }
    }
}
</script>

<style lang="less">
html {
    font-size: 50px;
}

#app {
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
    position: relative;
}
</style>
