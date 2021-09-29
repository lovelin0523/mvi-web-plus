<template>
	<m-button square @click="change">Button</m-button>
	<div>value：{{value}}</div>
	<div id="root" style="position: relative;width: 7rem;height: 10rem;border: 1px solid #000000;">
		<m-image-preview showControl v-model="show" :images="images" fade></m-image-preview>
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
				images:[
					'https://www.mvi-web.cn/mvi-resources/images/mvi_image_4_1624705387843.jfif',
					'https://www.mvi-web.cn/mvi-resources/images/mvi_image_4_1624705387843.jfif'
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
