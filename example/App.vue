<template>
	<m-button square @click="change">Button</m-button>
	<div>value：{{value}}</div>
	<div id="root" style="position: relative;width: 7rem;height: 10rem;border: 1px solid #000000;overflow: auto;">
		<!-- <div style="height: 10rem;"></div> -->
		<m-stepper v-model="value" border></m-stepper>
		<div style="height: 10rem;"></div>
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
				page: 1,
				date: new Date(),
				options:[
					{
						label:'No.1',
						value:{a:1}
					},
					{
						label:'No.2',
						value:{a:2}
					},
					{
						label:'No.3',
						value:{a:3}
					},
					{
						label:'No.4',
						value:{a:4}
					}
				]
			}
		},
		mounted() {

		},
		methods: {
			change(e) {
				this.show = !this.show
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
