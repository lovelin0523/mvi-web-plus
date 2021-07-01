<template>
	<div :class="['mvi-cell-group',border?'mvi-cell-group-border':'']">
		<div :class="['mvi-cell-group-title',titleClass?titleClass:'']" v-text="title" v-if="title"></div>
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name:"m-cell-group",
		props:{
			title:{
				type:String,
				default:null
			},
			border:{
				type:Boolean,
				default:true
			},
			titleClass:{
				type:String,
				default:null
			},
			active:{
				type:Boolean,
				default:true
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";
	
	.mvi-cell-group{
		display: block;
		width: 100%;
		margin-bottom: @mp-md;
		color: @font-color-sub;
	}
	.mvi-cell-group-title{
		padding:@mp-md @mp-sm;
	}
	
	.mvi-cell-group-border ::v-deep .mvi-cell.mvi-cell-border:last-child::after{
		border: none;
	}
</style>
