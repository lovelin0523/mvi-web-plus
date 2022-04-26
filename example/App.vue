<template>
    <m-slider v-model="value"></m-slider>
    <m-slider v-model="value"></m-slider>
</template>

<script>
import { ref, reactive, inject } from 'vue'
export default {
    name: 'App',
    data() {
        return {
            value: 20
        }
    },
    methods: {}
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
