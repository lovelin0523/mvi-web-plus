<template>
	<label :disabled="disabled || null" class="mvi-radio">
		<span :disabled="disabled || null" v-if="label && labelPlacement=='left'" class="mvi-radio-label" :data-placement="labelPlacement"
		 v-text="label" :style="labelStyle"></span>
		<input @change="change" :value="value" :disabled="disabled || null" :checked="check" type="radio" :name="name"/>
		<span :disabled="disabled || null" :class="['mvi-radio-item',check?'mvi-radio-item-check':'']" :style="radioStyle" >
			<m-icon :disabled="disabled || null" :type="iconType" :class="['mvi-radio-icon',check?'mvi-radio-icon-check':'']" 
			:style="iconStyle" />
		</span>
		<span :disabled="disabled || null" v-if="label && labelPlacement == 'right'" class="mvi-radio-label" :data-placement="labelPlacement" 
		v-text="label" :style="labelStyle"></span>
	</label>
</template>

<script>
	import $util from "../../util/util"
	export default {
		name:"m-radio",
		emits:['update:modelValue','change'],
		props:{
			value:{
				type:[String,Number],
				default:""
			},
			modelValue:{
				type:[Boolean,String,Number],
				default:false
			},
			disabled:{
				type:Boolean,
				default:false
			},
			label:{
				type:String,
				default:null
			},
			labelPlacement:{
				type:String,
				default:'right',
				validator(value){
					return ['left','right'].includes(value)
				}
			},
			labelColor:{
				type:String,
				default:null
			},
			labelSize:{
				type:String,
				default:null
			},	
			fillColor:{
				type:String,
				default:null
			},
			iconType:{
				type:String,
				default:'success'
			},
			iconColor:{
				type:String,
				default:null
			},
			iconSize:{
				type:String,
				default:null
			},
			round:{
				type:Boolean,
				default:true
			},
			name:{
				type:String,
				default:null
			}
		},
		computed:{
			labelStyle(){
				let style = {};
				if(this.disabled){
					style.color = '';
					style.fontSize = '';
				}else{
					if(this.labelColor){
						style.color = this.labelColor;
					}else{
						style.color = '';
					}
					if(this.labelSize){
						style.fontSize = this.labelSize;
					}else{
						style.fontSize = '';
					}
				}
				return style;
			},
			iconStyle(){
				let style = {};
				if(this.disabled){
					style.color = '';
					style.fontSize = '';
				}else {
					if(this.check){
						if(this.iconColor){
							style.color = this.iconColor;
						}else{
							style.color = '';
						}
						
					}
				}
				if(this.iconSize){
					style.fontSize = this.iconSize;
				}else{
					style.fontSize = '';
				}
				return style;
			},
			radioStyle(){
				let style = {};
				if(this.disabled){
					style.backgroundColor = '';
					style.borderColor = '';
				}else {
					if(this.check && this.fillColor){
						style.backgroundColor = this.fillColor;
						style.borderColor = this.fillColor;
					}else{
						style.backgroundColor = '';
						style.borderColor = '';
					}
				}
				if(this.round){
					style.borderRadius = '50%';
				}else{
					style.borderRadius = '';
				}
				return style;
			},
			check(){
				//modelValue为boolean
				if(typeof this.modelValue == "boolean"){
					return this.modelValue;
				}else if((typeof this.modelValue == "string" && this.modelValue) || $util.isNumber(this.modelValue)){
					if(this.modelValue == this.value){
						return true;
					}else{
						return false;
					}
				}else{
					return false;
				}
			}
		},
		methods:{
			change(){
				if((typeof this.modelValue == "string" && this.modelValue) || $util.isNumber(this.modelValue)){
					if(event.target.checked){//勾选
						this.$emit('update:modelValue',this.value);
						this.$emit('change',this.value);
					}
				}else if(typeof this.modelValue == "boolean"){
					this.$emit('update:modelValue',event.target.checked);
					this.$emit('change',event.target.checked)
				}
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";
	
	.mvi-radio{
		display: inline-flex;
		margin: 0;
		padding: 0;
		vertical-align: middle;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		cursor: pointer;
	}
	
	.mvi-radio>input[type="radio"]{
		width: 0;
		height: 0;
		opacity: 0;
		border: none;
		display: none;
	}
	
	.mvi-radio-item{
		display: inline-flex;
		display: -webkit-inline-flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin: 0;
		padding: @mp-xs/2;
		border: 1px solid @border-color;
		background-color:#fff;
	}
	
	.mvi-radio-item.mvi-radio-item-check{
		background-color: @info-normal;
		border-color: @info-normal;
	}
	
	.mvi-radio-item[disabled],.mvi-radio-item.mvi-radio-item-check[disabled]{
		background-color:@bg-color-dark;
		border-color: @border-color;
	}
	
	.mvi-radio-icon{
		font-size: @font-size-default;
		margin: 0;
		padding: 0;
		line-height: 1;
		color:transparent;
		transition: color 100ms;
	}
	
	.mvi-radio-icon.mvi-radio-icon-check{
		color: #fff;
	}
	
	.mvi-radio-icon.mvi-radio-icon-check[disabled]{
		color: @font-color-mute;
	}
	
	.mvi-radio-label{
		vertical-align: middle;
		font-size: @font-size-default;
		color: @font-color-default;
		user-select: none;
		
		&[data-placement='left']{
			margin-right: @mp-xs;
		}
		&[data-placement='right']{
			margin-left: @mp-xs;
		}
		&[disabled]{
			color: @font-color-mute;
		}
	}
	
	
</style>
