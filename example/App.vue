<template>
    <m-pull-refresh v-model="refresh" @refresh="doRefresh">
		<template #el="data">
			<m-button>{{data}}</m-button>
		</template>
    	<m-cell-group>
    		<m-cell v-for="(item,index) in list" :key="index" :title="item.name" :content="item.detail" no-wrap></m-cell>
    	</m-cell-group>
    </m-pull-refresh>
    <m-button style="position: absolute;top: 1rem;" @click="refresh=true">refresh</m-button>
</template>

<script>
import { ref, reactive, inject } from 'vue'
export default {
    name: 'App',
    data() {
        return {
            refresh:false,
            disableRefresh:false,
            list:[],
            originalList:[
            	{
            		name:'奔驰',
            		detail:'2022款C260L运动版'
            	},
            	{
            		name:'奔驰',
            		detail:'2022款C200L运动版'
            	},
            	{
            		name:'奔驰',
            		detail:'2021款C260L运动星耀珍藏版'
            	},
            	{
            		name:'奔驰',
            		detail:'2022款C260L运动版'
            	},
            	{
            		name:'奔驰',
            		detail:'2022款C200L运动版'
            	},
            	{
            		name:'奔驰',
            		detail:'2021款C260L运动星耀珍藏版'
            	},
            	{
            		name:'奔驰',
            		detail:'2022款C260L皓夜运动版'
            	},
            	{
            		name:'奥迪',
            		detail:'2022款A4L TSFI 45 quattro 臻选'
            	},
            	{
            		name:'奥迪',
            		detail:'2022款A4L TSFI 40 quattro RS套件燃速型'
            	},
            	{
            		name:'奥迪',
            		detail:'2022款A4L TSFI 40 豪华致雅'
            	},
            	{
            		name:'奥迪',
            		detail:'2022款A4L TSFI 40 豪华动感'
            	},
            	{
            		name:'宝马',
            		detail:'2022款325Li M运动套装'
            	},
            	{
            		name:'宝马',
            		detail:'2022款325Li M运动曜夜套装'
            	},
            	{
            		name:'宝马',
            		detail:'2022款330i xDrive'
            	},
            	{
            		name:'奔驰',
            		detail:'2022款C260L运动版'
            	},
            	{
            		name:'奔驰',
            		detail:'2022款C200L运动版'
            	},
            	{
            		name:'奔驰',
            		detail:'2021款C260L运动星耀珍藏版'
            	},
            	{
            		name:'奔驰',
            		detail:'2022款C260L皓夜运动版'
            	},
            	{
            		name:'奥迪',
            		detail:'2022款A4L TSFI 45 quattro 臻选'
            	},
            	{
            		name:'奥迪',
            		detail:'2022款A4L TSFI 40 quattro RS套件燃速型'
            	},
            	{
            		name:'奥迪',
            		detail:'2022款A4L TSFI 40 豪华致雅'
            	},
            	{
            		name:'奥迪',
            		detail:'2022款A4L TSFI 40 豪华动感'
            	},
            	{
            		name:'宝马',
            		detail:'2022款325Li M运动套装'
            	},
            	{
            		name:'宝马',
            		detail:'2022款325Li M运动曜夜套装'
            	},
            	{
            		name:'宝马',
            		detail:'2022款330i xDrive'
            	}
            ]
        }
    },
    mounted() {
		this.getList()
	},
    methods: {
        doRefresh() {
           this.getList()
        },
        getList(){
        	setTimeout(()=>{
        		this.list = this.originalList
        		this.refresh = false
        	},2000)
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
