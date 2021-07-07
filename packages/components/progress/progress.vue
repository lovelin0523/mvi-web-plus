<template>
	<!-- 进度条 -->
	<div :class="progressClass" :style="progressStyle">
		<!-- 进度条进度 -->
		<div :class="barClass" :style="progressBarStyle">
			<div v-if="showTip" class="mvi-progress-tooltip" :style="tipStyle">
				<slot name="tip" v-if="$slots.tip" :value="value"></slot>
				<span v-else v-text="computedText"></span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name:"m-progress",
		props:{
			value:{//当前进度值
				type:Number,
				default:0
			},
			max:{//最大值
				type:Number,
				default:100
			},
			min:{//最小值
				type:Number,
				default:0
			},
			strokeWidth:{//进度条粗细
				type:String,
				default:null
			},
			showTip:{//是否显示进度文字
				type:Boolean,
				default:false
			},
			color:{//进度条颜色
				type:String,
				default:null
			},
			tipColor:{//进度文字颜色
				type:String,
				default:null
			},
			trackColor:{//轨道颜色
				type:String,
				default:null
			},
			tipText:{//进度显示的文字，默认为百分比
				type:String,
				default:null
			},
			round:{//显示圆角
				type:Boolean,
				default:false
			},
			square:{//无角度
				type:Boolean,
				default:false
			},
			animation:{//是否开启动画效果
				type:Boolean,
				default:false
			},
			timeout:{//动画效果时长
				type:Number,
				default:400
			}
		},
		computed:{
			progressStyle(){
				let style = {};
				if(this.strokeWidth){
					style.height = this.strokeWidth;
				}
				if(this.trackColor){
					style.backgroundColor = this.trackColor;
				}
				return style;
			},
			progressBarStyle(){
				let style = {};
				if(this.animation){
					style.transition = 'width '+this.timeout+'ms';
					style.webkitTransition = 'width '+this.timeout+'ms';
				}
				if(this.color){
					style.backgroundColor = this.color;
				}
				if(this.value == this.max){
					style.borderRadius = 'inherit';
				}
				style.width = `calc(${(this.value - this.min < 0 ? 0 : this.value - this.min) / (this.max - this.min)} * 100%)`;
				
				return style;
			},
			computedText(){
				if(this.tipText){
					return this.tipText;
				}else{
					return Math.round(((this.value - this.min < 0 ? 0 : this.value - this.min) / (this.max - this.min))*100)+"%";
				}
			},
			tipStyle(){
				let style = {};
				if(this.tipColor){
					style.color = this.tipColor;
				}
				return style;
			},
			barClass(){
				let cls = ['mvi-progress-bar'];
				if(this.round){
					cls.push('mvi-progress-radius-round');
				}else if(this.square){
					cls.push('mvi-progress-radius-square');
				}
				return cls;
			},
			progressClass(){
				let cls = ['mvi-progress'];
				if(this.round){
					cls.push('mvi-progress-radius-round');
				}else if(this.square){
					cls.push('mvi-progress-radius-square');
				}
				return cls;
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";
	
	.mvi-progress{
		position: relative;
		display: block;
		width: 100%;
		height: 0.2rem;
		background-color: @bg-color-dark;
		border-radius: @radius-default;
	}
	.mvi-progress.mvi-progress-radius-square{
		border-radius: 0;
	}
	.mvi-progress.mvi-progress-radius-round{
		border-radius: @radius-round;
	}
	
	.mvi-progress-bar{
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: @info-normal;
		border-radius: @radius-default;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	.mvi-progress-bar.mvi-progress-radius-square{
		border-radius: 0;
	}
	.mvi-progress-bar.mvi-progress-radius-round{
		border-radius: @radius-round;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	
	.mvi-progress-tooltip{
		position: absolute;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		right: 0;
		top:50%;
		transform: translateY(-50%);
		-webkit-transform: translateY(-50%);
		width:auto;
		min-height: 100%;
		font-size: @font-size-small;
		color: #fff;
		padding-right: @mp-xs;
	}
</style>
