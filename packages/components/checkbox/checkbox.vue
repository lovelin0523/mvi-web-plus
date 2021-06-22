<template>
	<label class="mvi-checkbox" :disabled="disabled || null">
		<span v-if="labelPlacement=='left' && label" :disabled="disabled || null" class="mvi-checkbox-label" :data-placement="labelPlacement"
		 v-text="label" :style="labelStyle"></span>
		<input @change="change" :value="value" :disabled="disabled || null" :checked="check" type="checkbox" :name="name" />
		<span :disabled="disabled || null" :class="'mvi-checkbox-item'+(check?' mvi-checkbox-item-check':'')" :style="checkboxStyle">
			<m-icon :disabled="disabled || null" :type="iconType" :class="'mvi-checkbox-icon'+(check?' mvi-checkbox-icon-check':'')"
			:style="iconStyle" />
		</span>
		<span v-if="labelPlacement=='right' && label" :disabled="disabled || null" class="mvi-checkbox-label" :data-placement="labelPlacement" 
		v-text="label" :style="labelStyle"></span>
	</label>
</template>

<script>
	export default {
		name: "m-checkbox",
		emits:['update:checked','change'],
		props: {
			disabled: {
				type: Boolean,
				default: false
			},
			checked: {
				type:[Boolean,Array],
				default: false
			},
			label: {
				type:String,
				default:null
			},
			labelColor:{
				type:String,
				default:null
			},
			labelSize:{
				type:String,
				default:null
			},
			value: {
				type:[String,Number],
				default: ""
			},
			fillColor:{
				type:String,
				default:null,
			},
			labelPlacement:{
				type:String,
				default:"right",
				validator(value){
					return ['left','right'].includes(value)
				}
			},
			round:{
				type:Boolean,
				default:false
			},
			iconType:{
				type:String,
				default:'success'
			},
			iconSize:{
				type:String,
				default:null
			},
			iconColor:{
				type:String,
				default:null
			},
			name:{
				type:String,
				default:null
			}
		},
		computed: {
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
			checkboxStyle(){
				let style = {};
				if(this.disabled){
					style.backgroundColor = '';
					style.borderColor = '';
				}else{
					if(this.check){
						if(this.fillColor){
							style.backgroundColor = this.fillColor;
							style.borderColor = this.fillColor;
						}else{
							style.backgroundColor = '';
							style.borderColor = '';
						}
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
			labelStyle(){
				let style = {};
				if(this.disabled){
					style.color = '';
				}else {
					if(this.labelColor){
						style.color = this.labelColor;
					}
				}
				if(this.labelSize){
					style.fontSize = this.labelSize;
				}
				return style;
			},
			check() {
				//checked为boolean
				if (typeof(this.checked) == "boolean") {
					return this.checked;
				} else if (this.checked instanceof Array) {
					let clude = false;//数组中是否已包含此复选框的值
					for(let i = 0;i<this.checked.length;i++){
						if(this.checked[i] === this.value){
							clude = true;
							break;
						}
					}
					return clude;
				} else {
					return false;
				}
			}
		},
		methods: {
			getIndex(arry, value) {
				let index = 0;
				let length = arry.length;
				for (let i = 0; i < length; i++) {
					if (arry[i] == value) {
						index = i;
						break;
					}
				}
				return index;
			},
			change(){
				if (this.checked instanceof Array) {
					let arr = this.checked.slice(0);
					let clude = false;//数组中是否已包含此复选框的值
					for(let i = 0;i<arr.length;i++){
						if(arr[i] === this.value){
							clude = true;
							break;
						}
					}
					if (event.target.checked && !clude) { //勾选且不包含
						arr.push(this.value);
					} else if(clude){ //取消且包含
						let index = this.getIndex(this.checked, this.value);
						arr.splice(index, 1);
					}
					this.$emit('update:checked', arr);
					this.$emit('change',arr);
				} else if (typeof(this.checked) == "boolean") {
					this.$emit('update:checked', event.target.checked);
					this.$emit('change',event.target.checked);
				}
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";
	
	.mvi-checkbox {
		display: inline-flex;
		margin: 0;
		padding: 0;
		position: relative;
		vertical-align: middle;
		justify-content: flex-start;
		align-items: center;
		cursor: pointer;
	}
	.mvi-checkbox>input[type="checkbox"]{
		width: 0;
		height: 0;
		opacity: 0;
		border: none;
		display: none;
	}
	
	.mvi-checkbox>.mvi-checkbox-item{
		display: inline-flex;
		display: -webkit-inline-flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin: 0;
		padding: @mp-xs/2;
		border: 1px solid @border-color;
		border-radius: @radius-default;
		background-color:#fff;
	}
	
	.mvi-checkbox>.mvi-checkbox-item.mvi-checkbox-item-check{
		background-color: @info-normal;
		border-color: @info-normal;
	}
	
	.mvi-checkbox>.mvi-checkbox-item[disabled],.mvi-checkbox>.mvi-checkbox-item.mvi-checkbox-item-check[disabled]{
		background-color:@bg-color-dark;
		border-color: @border-color;
	}
	
	.mvi-checkbox-icon{
		font-size: @font-size-default;
		margin: 0;
		padding: 0;
		line-height: 1;
		color:transparent;
		transition: color 100ms;
	}
	
	.mvi-checkbox-icon.mvi-checkbox-icon-check{
		color: #fff;
	}
	
	.mvi-checkbox-icon.mvi-checkbox-icon-check[disabled]{
		color: @font-color-mute;
	}
	
	.mvi-checkbox-label{
		vertical-align: middle;
		font-size: @font-size-default;
		color: @font-color-default;
		user-select: none;
		
		&[data-placement='left']{
			margin-right: @mp-sm;
		}
		&[data-placement='right']{
			margin-left: @mp-sm;
		}
		&[disabled]{
			color: @font-color-mute;
		}
	}
</style>
