<template>
    <m-button type="success" form-control @click="selectDate">选择日期</m-button>
    <m-date-native-picker ref="datepicker" type="time" v-model="date"></m-date-native-picker>
</template>

<script>
import { ref, reactive, inject } from 'vue'
export default {
    name: 'App',
    data() {
        return {
            page: 1,
            date: new Date(),
            active: 0,
            show: false,
            value: '',
            options: [
                {
                    label: 'LOL',
                    value: '0'
                }
            ]
        }
    },
    methods: {
        selectDate() {
            this.$refs.datepicker.trigger()
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
