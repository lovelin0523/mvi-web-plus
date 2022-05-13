<template>
    <div>
        <m-select :layer-props="{width:'3rem',showTriangle:true,border:true,shadow:false,zIndex:1000}" style="width:5rem;margin:4rem auto;" @change="change" clearable placeholder="请选择" v-model="value" :options="options"></m-select>
        <m-autocomplete :layer-props="{showTriangle:true,border:true,borderColor:'#f30',background:'#f30'}" style="width:5rem;margin:4rem auto;" clearable placeholder="请选择" v-model="value" :list="['1','2']"></m-autocomplete>
        <m-date-chooser :layer-props="{width:'9rem',showTriangle:true,border:true,shadow:false}" style="width:5rem;margin:4rem auto;" block v-model="date">
            <m-field :model-value="date.toString()"></m-field>
        </m-date-chooser>
    </div>
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
