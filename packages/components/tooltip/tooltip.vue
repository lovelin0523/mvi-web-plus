<template>
	<div :class="['mvi-tooltip',block?'mvi-tooltip-block':'']" :data-id="'mvi-tooltip-' + uid">
		<div @click="clickShowTooltip" @mouseenter="hoverShowTooltip" @mouseleave="hoverHideToolTip" class="mvi-tooltip-toggle" ref="toggle" :data-id="'mvi-tooltip-target-' + uid">
			<slot></slot>
		</div>
		<m-layer v-model="show" :offset="offset" :background="color" border :border-color="borderColor" closable :show-triangle="showTriangle" :z-index="zIndex" :target="`[data-id='mvi-tooltip-target-${uid}']`" :root="`[data-id='mvi-tooltip-${uid}']`"
		:placement="placement" :fixed="fixed" :fixed-auto="fixedAuto" :width="width" :timeout="timeout" 
		:animation="animation?animation:'mvi-tooltip'" :shadow="false" >
			<div class="mvi-tooltip-content" ref="content" :style="contentStyle">
				<slot v-if="$slots.title" name="title"></slot>
				<span v-else v-text="title"></span>
			</div>
		</m-layer>
	</div>
</template>

<script>
	import { getCurrentInstance } from "vue"
	import $util from "../../util/util"
	export default {
		name:"m-tooltip",
		data(){
			return {
				show:false
			}
		},
		props:{
			title:{
				type:String,
				default:""
			},
			placement:{
				type:String,
				default:"bottom",
				validator(value){
					return ['bottom','bottom-start','bottom-end',
							'top','top-start','top-end',
							'left','left-start','left-end',
							'right','right-start','right-end'].indexOf(value)>-1;
				}
			},
			disabled:{
				type:Boolean,
				default:false
			},
			timeout:{
				type:Number,
				default:400
			},
			borderColor:{
				type:String,
				default:'#333'
			},
			color:{
				type:String,
				default:'#333'
			},
			textColor:{
				type:String,
				default:'#fff'
			},
			trigger:{
				type:String,
				default:'click',
				validator(value){
					return ['hover','click','custom'].includes(value)
				}
			},
			offset:{
				type:String,
				default:'0.1rem'
			},
			zIndex:{
				type:Number,
				default:20
			},
			fixed:{
				type:Boolean,
				default:false
			},
			fixedAuto:{
				type:Boolean,
				default:false
			},
			width:{
				type:String,
				default:null
			},
			animation:{
				type:String,
				default:null
			},
			showTriangle:{
				type:Boolean,
				default:true
			},
			block:{
				type:Boolean,
				default:false
			}
		},
		computed:{
			contentStyle(){
				let style = {};
				if(this.textColor){
					style.color = this.textColor;
				}
				if(this.width){
					style.whiteSpace = 'normal';
				}
				return style;
			}
		},
		setup() {
			const instance = getCurrentInstance();
			return {
				uid:instance.uid
			}
		},
		methods:{
			//鼠标进入显示
			hoverShowTooltip(){
				if(this.trigger == 'hover'){
					this.showTooltip();
				}
			},
			//鼠标移出隐藏
			hoverHideToolTip(){
				if(this.trigger == 'hover'){
					this.hideTooltip();
				}
			},
			//点击显示工具提示
			clickShowTooltip(){
				if(this.trigger === 'click'){
					if(this.show){
						this.hideTooltip();
					}else{
						this.showTooltip();
					}
				}
			},
			//显示
			showTooltip(){
				if(this.disabled){
					return;
				}
				this.show = true;
			},
			//隐藏
			hideTooltip(){
				if(this.disabled){
					return;
				}
				this.show = false;
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";
	
	.mvi-tooltip{
		display: inline-block;
		position: relative;
		
		.mvi-tooltip-toggle{
			position: relative;
			display: inline-block;
		}
		
		&.mvi-tooltip-block{
			display: block;
			
			.mvi-tooltip-toggle{
				display: block;
			}
		}
	}

	.mvi-tooltip-content{
		position: relative;
		display: block;
		padding: @mp-sm;
		font-size: @font-size-small;
		margin: 0;
		white-space: nowrap;
		line-height: 1;
		text-align: center;
	}
</style>
<style lang="less">
	.mvi-tooltip-enter-from,.mvi-tooltip-leave-to{
		opacity: 0;
	}
</style>
