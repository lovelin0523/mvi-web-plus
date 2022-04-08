<template>
    <m-editor v-model="value" @file-paste="paste"></m-editor>
</template>

<script>
import { ref, reactive, inject } from 'vue'
export default {
    name: 'App',
    data() {
        return {
            value: ''
        }
    },
    methods: {
        paste(e) {
            console.log(e)
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
