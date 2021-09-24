<template>
	<m-button square @click="change">Button</m-button>
	<div>{{value}}</div>
	<m-collapse accordion v-model="value">
	    <m-collapse-item title="标题1" label="这是一个简单的标题">
	        风萧萧兮易水寒
	    </m-collapse-item>
	    <m-collapse-item title="标题2" label="这是一个简单的标题" content="风萧萧兮易水寒,壮士一去兮不复还"></m-collapse-item>
	    <m-collapse-item title="标题3" label="这是一个简单的标题">
	        <div class="mvi-bg-error" v-prop="0.5"></div>
	    </m-collapse-item>
	</m-collapse>
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
				value:2
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
