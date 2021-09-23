<template>
	<m-button @click="change">Button</m-button>
	<div id="root" style="height: 13rem;width: 7rem;border: 1px solid #bbb;overflow: auto;position: relative;">
		<m-collapse v-model="value">
		    <m-collapse-item title="标题1" label="这是一个简单的标题">
		        风萧萧兮易水寒
		    </m-collapse-item>
		    <m-collapse-item title="标题2" label="这是一个简单的标题" content="风萧萧兮易水寒,壮士一去兮不复还"></m-collapse-item>
		    <m-collapse-item title="标题3" label="这是一个简单的标题">
		        <div class="mvi-bg-error" v-prop="0.5"></div>
		    </m-collapse-item>
		</m-collapse>
	</div>
</template>

<script>
	import {
		ref,
		reactive,
		inject
	} from 'vue';
	export default {
		name: 'App',
		data() {
			return {
				arr: [{
					a: 1
				}, {
					b: 2
				}],
				observe: {
					attributes: true,
					childList: true,
					subtree: true,
					attributesChange: (attributeName, oldValue, newValue) => {
						console.log(attributeName, oldValue, newValue)
					},
					childNodesChange: (addNodes, removeNodes) => {
						console.log(addNodes, removeNodes)
					}
				},
				counts: 100000,
				spyOpt: {
					el: '#app',
					beforeEnter: el => {
						console.log('元素开始进入视图');
					},
					enter: el => {
						console.log('元素完全进入视图');
					},
					beforeLeave: el => {
						console.log('元素开始离开视图');
					},
					leave: el => {
						console.log(' 元素完全离开视图');
					}
				},
				show: false,
				checkbox: [],
				checked: 1,
				value: 0,
				active: 1,
				date: new Date(),
				options: [{
						label: 'iPhone 12',
						value: {
							a: 1
						}
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
					'https://www.mvi-web.cn/mvi-resources/images/mvi_image_4_1624705387843.jfif',
					'https://www.mvi-web.cn/mvi-resources/images/mvi_image_3_1624705387828.jfif',
					'https://www.mvi-web.cn/mvi-resources/images/mvi_image_2_1624705387812.jfif',
					'https://www.mvi-web.cn/mvi-resources/images/mvi_image_1_1624705387797.jfif',
					'https://www.mvi-web.cn/mvi-resources/images/mvi_image_0_1624705387765.jfif'
				],
				data: [{
						id: 4,
						name: '张三',
						age: 12
					},
					{
						id: 12,
						name: '李四',
						age: 22
					},
					{
						id: 11,
						name: '王婆',
						age: 45
					}
				],
				columns: [{
						key: 'checkbox',
						value: ''
					},
					{
						key: 'id',
						value: 'ID',
						sortable: true
					},
					{
						key: 'name',
						value: '姓名',
						sortable: true
					},
					{
						key: 'age',
						value: '年龄',
						sortable: true
					}
				],
				page: 1,
				tabs: [{
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
				list: ['iPhone', 'iPhone 12', 'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 11', 'HUAWEI',
					'HUAWEI MATE 40'
				],
				anchorOpt: {
					root: '#root',
					target: '#target',
					time: 400,
					callback: (value) => {
						console.log(value);
					}
				},
				uploadOpt: {
					select: files => {
						console.log(files)
					}
				},
				scrollOpt: {
					top: el => {
						console.log(el);
					},
					bottom: el => {
						console.log(el);
					}
				}
			};
		},
		mounted() {

		},
		methods: {
			change(e) {
				//this.show = !this.show
			},
			shown(e) {
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

	.demo {
		width: 4rem;
		height: 2rem;
		margin: .2rem auto;
		position: relative;
		border: 1px solid #000000;

		&::before {
			content: '';
			width: 100%;
			height: 1px;
			background-color: #000000;
			position: absolute;
			bottom: -1rem;
			left: 0;
		}
	}
</style>
