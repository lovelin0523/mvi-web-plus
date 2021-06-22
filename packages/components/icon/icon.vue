<template>
	<i v-if="url" :class="'mvi-icon-url'+(spin?' mvi-icon-spin':'')" :style="iconStyle"></i>
	<i v-else :class="'mvi-icon icon-'+ type + (spin?' mvi-icon-spin':'')" :style="iconStyle"></i>
</template>

<script>
	import {toRaw} from "vue"
	export default {
		name:"m-icon",
		props:{
			type:{
				type:String,
				default:""
			},
			spin:{
				type:Boolean,
				default:false
			},
			url:{
				type:String,
				default:null
			},
			size:{
				type:String,
				default:null
			},
			color:{
				type:String,
				default:null
			}
		},
		computed:{
			iconStyle(){
				let style = {};
				if(this.url){
					style.backgroundImage = 'url('+this.url+')';
					if(this.size){
						style.width = this.size;
						style.height = this.size;
					}
				}else{
					if(this.size){
						style.fontSize = this.size;
					}
					if(this.color){
						style.color = this.color;
					}
				}
				return style;
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";
	@import "../../css/mvi-icon.less";
	
	.mvi-icon {
		display:inline-flex;
		font-family: "mvi-icon" !important;
		font-style: normal;
		vertical-align: middle;
		justify-content: center;
		align-items: center;
		font-size: inherit;
		line-height: 1;
	}
	
	.mvi-icon-url{
		display: inline-block;
		width: 0.28rem;
		height: 0.28rem;
		vertical-align: middle;
		background-size: cover;
		-webkit-background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
	}

	//旋转效果的图标
	.mvi-icon-spin{
	 	animation:spin 1.4s linear infinite;
	 	-webkit-animation: spin 1.4s linear infinite;
	}
	//旋转
	@-webkit-keyframes spin{
	 	from{
	 		transform: rotateZ(0deg);
	 		transform-origin: center;
	 	}
	 	to{
	 	    transform: rotateZ(360deg);
	 		transform-origin: center;
	 	}
	}
</style>
