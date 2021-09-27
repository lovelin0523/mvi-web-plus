<template>
	<m-button square @click="change">Button</m-button>
	<div>value：{{value}}</div>
	<div id="root" style="position: relative;width: 7rem;height: 10rem;border: 1px solid #000000;">
		<m-field v-model="value" type="textarea" :rows="10"></m-field>
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
				value:'',
				list:[
					{
						label:'今日',
						value:{
							a:1
						},
						icon:'user'
					},
					{
						label:'昨天',
						value:{
							a:0
						}
					},
					{
						label:'明天',
						value:{
							a:2
						}
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
