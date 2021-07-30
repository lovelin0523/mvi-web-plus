<template>
	<div>{{counts}}</div>
	<m-button @click="change">打开遮罩</m-button>
	<div>{{value}}</div>
	<div>{{date}}</div>
	<m-input v-model="value" :maxlength="10" show-word-limit clearable></m-input>
</template>

<script>
import { ref, reactive, inject} from 'vue';
export default {
	name: 'App',
	data() {
		return {
			counts:100000,
			spyOpt:{
				el:'#el',
				enter:el=>{
					console.log('enter')
				}
			},
			show: true,
			checkbox: [],
			checked: 1,
			value: '#ff3300',
			active: 1,
			date: new Date(),
			options: [
				{
					label: 'iPhone 12',
					value: 0
				},
				{
					label: 'iPhone 11',
					value: 1,
					disabled: true
				},
				{
					label: 'iPhone 12 Pro',
					value: 2
				},
				{
					label: 'iPhone 12 Pro Max',
					value: 3
				},
				{
					label: 'iPhone 12 mini',
					value: 4
				}
			],
			refresh: true,
			images: [
				'https://www.mvi-web.cn/mvi-resources/images/mvi_image_4_1624705387843.jfif','https://www.mvi-web.cn/mvi-resources/images/mvi_image_3_1624705387828.jfif','https://www.mvi-web.cn/mvi-resources/images/mvi_image_2_1624705387812.jfif','https://www.mvi-web.cn/mvi-resources/images/mvi_image_1_1624705387797.jfif','https://www.mvi-web.cn/mvi-resources/images/mvi_image_0_1624705387765.jfif'
			],
			data:[
				{
					id:4,
					name:'张三',
					age:12
				},
				{
					id:12,
					name:'李四',
					age:22
				},
				{
					id:11,
					name:'王婆',
					age:45
				}
			],
			columns:[
				{
					key:'checkbox',
					value:''
				},
				{
					key:'id',
					value:'ID',
					sortable:true
				},
				{
					key:'name',
					value:'姓名',
					sortable:true
				},
				{
					key:'age',
					value:'年龄',
					sortable:true
				}
			],
			page: 1,
			tabs: [
				{
					value: 0,
					name: '首页'
				},
				{
					value: 1,
					name: '附近'
				},
				{
					value: 2,
					name: '关注'
				},
				{
					value: 3,
					name: '我的'
				}
			],
			list: ['iPhone', 'iPhone 12', 'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 11', 'HUAWEI', 'HUAWEI MATE 40']
		};
	},
	mounted() {
		setInterval(()=>{
			this.counts-=10;
		},10)
	},
	methods: {
		change(e) {
			this.$prompt({
				type:'number',
				clearable:true,
				value:'#ff3300'
			}).then(res=>{
				console.log(res)
			})
		},
		shown(e){
			console.log(e)
		}
	}
};
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
