<template>
	<m-button style="position: fixed;" @click="change">打开遮罩</m-button>
	<div style="margin-top: 1rem;">checkbox：{{ checkbox }}</div>
	<div>show：{{ show }}</div>
	<div>checked：{{ checked }}</div>
	<div>value：{{ value }}</div>
	<div>date：{{ date }}</div>
	<div>active：{{ active }}</div>
	<div>page：{{ page }}</div>
	<m-cell-group >
		<m-cell title="标题"></m-cell>
	</m-cell-group>
	<div class="a" style="position: relative;height: 3rem;">
		<!-- <m-image-preview mount-el="#app" v-model:show="show" :images="images"></m-image-preview> -->
		<!-- <m-dropdown  active-color="#ff3300" inactive-color="#333" mount-el="#app" v-model:value="value" v-model:show="show" :options="options"></m-dropdown> -->
		<!-- <m-actionsheet mount-el="#app" v-model:show="show" :options="options"></m-actionsheet> -->
		<!-- <m-number-keyboard closable class="mvi-bg-success" use-padding mount-el="#app" v-model:value="value" v-model:show="show"></m-number-keyboard> -->
		<m-overlay mount-el="#app" v-model:show="show" closable></m-overlay>
		<!-- <m-popup class="mvi-bg-error" mount-el="body" v-model:show="show" width="2rem" closable>222</m-popup> -->
		<!-- <m-modal class="mvi-bg-success" mount-el="#app" closable v-model:show="show" title="模态框" content="Modal Content"></m-modal> -->
	</div>
	<div style="height: 30rem;"></div>
</template>

<script>
import { ref, reactive, inject} from 'vue';
export default {
	name: 'App',
	data() {
		return {
			show: false,
			checkbox: [],
			checked: 0,
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
			refresh: false,
			images: [
				'https://www.mvi-web.cn/resources/blogImages/tE0vIcAedMNVlbJUBPPtScAz.jfif',
				'https://www.mvi-web.cn/resources/blogImages/MLPDRICUjWWSWDW3OcLtRQ_p.jfif',
				'https://www.mvi-web.cn/resources/blogImages/oQmx45AeZhuaAvrnTLBn6V6p.jfif'
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
	mounted() {},
	methods: {
		change(e) {
			console.log(e)
			this.$refs.table.resetSortActive()
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
