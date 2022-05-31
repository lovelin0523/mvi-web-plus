<template>
    <div>
        <m-stepper v-model="value" :digit="2" :step="0.01"></m-stepper>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            value: 0.12,
            date: new Date(),
            options: [
                {
                    label: '安徽',
                    value: 10
                },
                {
                    label: '江苏',
                    value: 20
                }
            ]
        }
    },
    methods: {
        change(res) {
            console.log(res)
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
