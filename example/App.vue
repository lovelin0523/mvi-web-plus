<template>
    <div>
        {{value}}
    </div>
    <m-editor ref="editor" :menu-icons="{custom:'user'}" :menu-index="{custom:1}" :tooltips="{custom:'自定义'}" :menus="{custom:true,codeView:true,fontSize:[{label:'12px',value:'12px',icon:{custom:true,value:'fa fa-home'}}]}" @custom="change" v-model="value" :custom-active="customActive"></m-editor>
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
            this.$refs.editor.insertHtml(
                '<div data-v="1" class="mvi-bg-success mvi-p-4"></div>'
            )
        },
        customActive(key, node) {
            if (key === 'custom') {
                console.log(
                    this.$refs.editor.getCompareTagForAttr(node, 'data-v', '1')
                )
                if (this.$refs.editor.compareAttribute(node, 'data-v', '1')) {
                    return true
                }
                return false
            }
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
