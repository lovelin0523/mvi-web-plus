<template>
    <div style="width: 1rem;height: 1rem;background-color: #000000;position: absolute;" v-resize="options"></div>
</template>

<script>
import { ref, reactive, inject } from 'vue'
export default {
    name: 'App',
    data() {
        return {
            options: {
                beforeResize: data => {
                    console.log('beforeResize', data)
                }
            }
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
