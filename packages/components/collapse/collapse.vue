<template>
	<div :disabled="disabled || null" class="mvi-collapse">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name:"m-collapse",
		data(){
			return {
				children:[]
			}
		},
		emits:['update:modelValue','before-slide-down','slide-down','before-slide-up','slide-up'],
		props:{
			modelValue:{//默认展开的面板索引
				type:[Number,Array],
				default:null
			},
			accordion:{//是否手风琴模式
				type:Boolean,
				default:false
			},
			inBorder:{//是否显示每个面板的内下边框
				type:Boolean,
				default:true
			},
			outBorder:{//是否展示每个面板的外下边框
				type:Boolean,
				default:true
			},
			disabled:{//是否禁用
				type:Boolean,
				default:false
			},
			active:{//点击标题栏是否显示点击态
				type:Boolean,
				default:true
			},
			noWrap:{//是否对标题栏的标题和内容使用单行限制
				type:Boolean,
				default:false
			},
			openArrow:{//展开时右侧图标
				type:[String,Object],
				default:'angle-up'
			},
			closeArrow:{//关闭时右侧图标
				type:[String,Object],
				default:'angle-down'
			},
			timeout:{//折叠或者展开的动画时长,单位ms
				type:Number,
				default:300
			}
		},
		provide(){
			return {
				collapse:this
			};
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";
	
	.mvi-collapse{
		display: block;
		width: 100%;
		vertical-align: middle;
		background-color: #fff;
	}
</style>
