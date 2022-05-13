<template>
    <div>
        {{value}}
        <m-select placement="bottom-end" style="width:5rem;margin:4rem auto;" @change="change" clearable placeholder="请选择" v-model="value" :options="options" showTriangle width="3rem"></m-select>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            value: '',
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
