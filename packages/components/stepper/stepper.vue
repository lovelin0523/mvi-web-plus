<template>
	<div :class="'mvi-stepper mvi-stepper-'+size">
		<div :disabled="disabledMinus || arrivalMin || disabled || null" :class="minusClass" v-if="showMinus" :style="minusStyle" 
		@click="doMinus">
			<m-icon type="minus" />
		</div>
		<div :disabled="disabledInput || null" :class="['mvi-stepper-input',border?'mvi-stepper-border':'']" :style="inputStyle" v-if="showInput">
			<input ref="input" v-model="realValue" :disabled="disabled || disabledInput || null" type="text" @blur="changeValue"
			 @keyup.enter="changeValue" :style="inputElStyle">
		</div>
		<div :disabled="disabledPlus || arrivalMax || disabled || null" :class="plusClass" v-if="showPlus" :style="plusStyle" 
		@click="doPlus">
			<m-icon type="plus" />
		</div>
	</div>
</template>

<script>
	import $util from "../../util/util"
	import mIcon from "../icon/icon"
	export default {
		name:"m-stepper",
		emits:['update:modelValue','change'],
		props:{
			modelValue:{
				type:[String,Number],
				default:0
			},
			step:{
				type:Number,
				default:1
			},
			size:{
				type:String,
				default:'medium',
				validator(value){
					return ['small','medium','large'].includes(value)
				}
			},
			min:{
				type:Number,
				default:null
			},
			max:{
				type:Number,
				default:null
			},
			digit:{//显示小数位数
				type:Number,
				default:0
			},
			disabled:{
				type:Boolean,
				default:false
			},
			disabledPlus:{
				type:Boolean,
				default:false
			},
			disabledMinus:{
				type:Boolean,
				default:false
			},
			disabledInput:{
				type:Boolean,
				default:false
			},
			showPlus:{
				type:Boolean,
				default:true
			},
			showMinus:{
				type:Boolean,
				default:true
			},
			showInput:{
				type:Boolean,
				default:true
			},
			inputWidth:{//输入框宽度
				type:String,
				default:null
			},
			background:{//按钮与输入框的背景色
				type:String,
				default:null
			},
			color:{//按钮与输入框的字体颜色
				type:String,
				default:null
			},
			active:{//是否显示点击态
				type:Boolean,
				default:true
			},
			inputAlign:{//输入框数字对齐方式
				type:String,
				default:'center',
				validator(value){
					return ['left','center','right'].includes(value)
				}
			},
			border:{//是否显示边框
				type:Boolean,
				default:false
			}
		},
		computed:{
			arrivalMin(){
				if(this.min != null){
					return this.realValue<=this.min;
				}else{
					return false;
				}
			},
			arrivalMax(){
				if(this.max != null){
					return this.realValue>=this.max;
				}else{
					return false;
				}
			},
			inputStyle(){
				let style = {};
				if(this.inputWidth){
					style.width = this.inputWidth;
				}
				if(this.color){
					style.color = this.color;
				}
				if(this.background){
					style.backgroundColor = this.background;
				}
				return style;
			},
			inputElStyle(){
				let style = {};
				if(this.inputAlign){
					style.textAlign = this.inputAlign;
				}
				return style;
			},
			minusStyle(){
				let style = {};
				if(this.color){
					style.color = this.color;
				}
				if(this.background){
					style.backgroundColor = this.background;
				}
				return style;
			},
			plusStyle(){
				let style = {};
				if(this.color){
					style.color = this.color;
				}
				if(this.background){
					style.backgroundColor = this.background;
				}
				return style;
			},
			minusClass(){
				let cls = ['mvi-stepper-minus'];
				if(!(this.disabledMinus || this.arrivalMin || this.disabled) && this.active){
					cls.push('mvi-stepper-active');
				}
				if(this.border){
					cls.push('mvi-stepper-border');
				}
				return cls;
			},
			plusClass(){
				let cls = ['mvi-stepper-plus'];
				if(!(this.disabledPlus || this.arrivalMax || this.disabled) && this.active){
					cls.push('mvi-stepper-active')
				}
				if(this.border){
					cls.push('mvi-stepper-border');
				}
				return cls;
			},
			realValue:{
				set(value){
					if(this.modelValue !== value){
						this.$emit('update:modelValue',value);
					}
				},
				get(){
					return this.modelValue;
				}
			}
		},
		components:{
			mIcon
		},
		mounted() {
			this.updateValue();
		},
		methods:{
			//减法
			doMinus(){
				if(this.disabled){
					return;
				}
				if(this.disabledMinus){
					return;
				}
				if(this.arrivalMin){
					return;
				}
				this.realValue = this.realValue.subtraction(this.step);
				this.updateValue();
			},
			//加法
			doPlus(){
				if(this.disabled){
					return;
				}
				if(this.disabledPlus){
					return;
				}
				if(this.arrivalMax){
					return;
				}
				this.realValue = this.realValue.add(this.step);
				this.updateValue();
			},
			//输入框修改值
			changeValue(){
				if(this.disabled){
					return;
				}
				if(this.disabledInput){
					return;
				}
				this.updateValue();
			},
			//更新value值
			updateValue(){
				let val = parseFloat(this.realValue);
				if(isNaN(val)){
					val = 0;
				}
				val = Number(val.toFixed(this.digit));
				if(val <= this.min && this.min != null){
					val = this.min;
				}
				if(val >= this.max && this.max != null){
					val = this.max;
				}
				if(this.realValue !== val){
					this.realValue = val;
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";
	
	.mvi-stepper{
		display: inline-flex;
		display: -webkit-inline-flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}
	
	.mvi-stepper-minus,.mvi-stepper-plus{
		display: inline-flex;
		display: -webkit-inline-flex;
		justify-content: center;
		align-items: center;
		background-color: @bg-color-dark;
		border-radius: @radius-default;
		color: @font-color-sub;
		position: relative;
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		
		&[disabled]{
			opacity: .5;
		}
	}
	
	.mvi-stepper-minus{
		margin-right: @mp-xs;
	}
	
	.mvi-stepper-active:active::before{
		.mvi-active();
	}
	
	.mvi-stepper-small>.mvi-stepper-minus,.mvi-stepper-small>.mvi-stepper-plus{
		width: @small-height;
		height: @small-height;
		font-size: @font-size-small;
	}
	
	.mvi-stepper-medium>.mvi-stepper-minus,.mvi-stepper-medium>.mvi-stepper-plus{
		width:@medium-height;
		height:@medium-height;
		font-size: @font-size-default;
	}
	
	.mvi-stepper-large>.mvi-stepper-minus,.mvi-stepper-large>.mvi-stepper-plus{
		width:@large-height;
		height:@large-height;
		font-size: @font-size-h6;
	}
	.mvi-stepper-input{
		min-width: 0;
		background-color: @bg-color-dark;
		margin-right: @mp-xs;
		border-radius: @radius-default;
		width: 1.5rem;
		color: @font-color-sub;
		
		&>input{
			position: relative;
			display: block;
			background-color: transparent;
			height: 100%;
			width: 100%;
			min-width: 0;
			color: inherit;
			font-size: inherit;
			border: none;
			border-radius: @radius-default;
			font-family: @font-family;
			background-image: none;
			margin: 0;
			font-size: @font-size-default;
			vertical-align: middle;
			&::-webkit-input-placeholder,&::placeholder{
				color: inherit;
				opacity: .5;
				vertical-align: middle;
				font-family: inherit;
				font-size: inherit;
			}
			
			&[disabled]{
				background-color: inherit;
				color: inherit;
				opacity:.5;
			}
		}
		
		
		&[disabled]{
			opacity: .5;
		}
	}
	.mvi-stepper-small>.mvi-stepper-input{
		height: @small-height;
		font-size: @font-size-small;
	}
	.mvi-stepper-medium>.mvi-stepper-input{
		height: @medium-height;
		font-size: @font-size-default;
	}
	.mvi-stepper-large>.mvi-stepper-input{
		height: @large-height;
		font-size: @font-size-h6;
	}
	&.mvi-stepper-border{
		border: 1px solid @border-color;
	}
</style>
