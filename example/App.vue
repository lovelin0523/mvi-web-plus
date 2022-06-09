<template>
    <div>
        {{value}}
    </div>
    <m-editor ref="editor" :menu-icons="{custom:'user'}" :menu-index="{custom:1}" :tooltips="{custom:'自定义'}" :menus="{custom:true,codeView:true,fontSize:[{label:'12px',value:'12px',icon:{custom:true,value:'fa fa-home'}}]}" @custom="change" v-model="value"></m-editor>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            value: '',
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
            this.$refs.editor.insertHtml(
                '<img src="https://www.mvi-web.cn/mvi-resources/images/mvi_image_8_1624705387875.jpg"/>'
            )
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
