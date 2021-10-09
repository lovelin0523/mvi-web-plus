<template>
	<m-button square @click="change">Button</m-button>
	<div>value：{{active}}</div>
	<div id="root" style="position: relative;width: 7rem;height: 10rem;border: 1px solid #000000;overflow: hidden;">
		<!-- <div style="height: 10rem;"></div> -->
		<m-tabs v-model="active">
		    <m-tab title="标签一" disabled>
		        <p>愿你三冬暖，愿你春不寒；愿你天黑有灯，下雨有伞。愿你路上有良人相伴。</p>
		    </m-tab>
		    <m-tab title="标签二">
		        <p>待我君临天下，许你四海为家。待我了无牵挂，许你浪迹天涯。待我半生戎马。</p>
		    </m-tab>
		    <m-tab title="标签三">
		        <p>我跨过山，涉过水，见过万物复苏，周而复始，如今山是你，水也是你。</p>
		    </m-tab>
		    <m-tab title="标签四">
		        <p>纵然，从此一别两宽，各自欢喜，你也曾写进了他的生命里，虽非经久不衰，却最浓墨重彩。</p>
		    </m-tab>
		</m-tabs>

		<!-- <div style="height: 10rem;"></div> -->
	</div>
</template>

<script>
	import {
		ref,
		reactive,
		inject
	} from 'vue'
	export default {
		name: 'App',
		data() {
			return {
				show: false,
				value: 20,
				active: 0,
				page: 1,
				date: new Date(),
				data: [{
						name: '张三',
						age: 24,
						sex: '男'
					},
					{
						name: '李四',
						age: 20,
						sex: '男'
					},
					{
						name: '王红',
						age: 22,
						sex: '女'
					},
					{
						name: '赵钱',
						age: 30,
						sex: '男'
					}
				],
				columns: [{
						key: 'name',
						value: '姓名'
					},
					{
						key: 'age',
						value: '年龄'
					},
					{
						key: 'sex',
						value: '性别'
					}
				],
				options: [{
						label: 'No.1',
						value: {
							a: 1
						}
					},
					{
						label: 'No.2',
						value: {
							a: 2
						}
					},
					{
						label: 'No.3',
						value: {
							a: 3
						}
					},
					{
						label: 'No.4',
						value: {
							a: 4
						}
					}
				]
			}
		},
		mounted() {},
		methods: {
			change(e) {
				//this.show = !this.show
				this.$confirm({
					title:'hello',
					btnText:['h','a'],
					btnColor:['#999']
				})
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
</style>
