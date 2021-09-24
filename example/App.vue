<template>
	<m-button @click="change">Button</m-button>
	<m-actionsheet @select="shown" v-model="show" title="LOL" :z-index="1400" :options="options"></m-actionsheet>
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
				show:false,
				options:[
					{
						label:'艾欧尼亚',
						color:'#ff3300',
						disabled:true
					},
					{
						label:'弗雷尔卓德',
						color:'#10928a'
					},
					{
						label:'德玛西亚',
						class:'mvi-text-primary',
						disabled:true
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
