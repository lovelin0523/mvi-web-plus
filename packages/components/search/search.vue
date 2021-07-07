<template>
	<div class="mvi-search" :disabled="disabled || null">
		<div v-if="label" :class="['mvi-search-label',labelClass?labelClass:'']" v-text="label"></div>
		<div :class="['mvi-search-input-container',round?'mvi-search-input-round':'']" :style="{backgroundColor:background?background:'',color:color?color:''}">
			<div v-if="leftIconType || leftIconUrl" class="mvi-search-left-icon" @click="leftClick">
				<m-icon :type="leftIconType" :url="leftIconUrl" :spin="leftIconSpin" :size="leftIconSize" :color="leftIconColor" :class="(leftIconClass?leftIconClass:'')"/>
			</div>
			<input ref="input" class="mvi-search-input" :type="computedType" @keypress.enter="doSearch" autocomplete="off"
			:placeholder="placeholder" :maxlength="maxlength" :autofocus="autofocus" :disabled="disabled || null" :readonly="readonly || null" :inputmode="computedInputMode"
			:value="computedValue" @input="searchInput" @focus="getFocus" @blur="getBlur" :style="inputStyle">
			<div v-if="clearable" class="mvi-search-clear" @click="clearInput" v-show="showClear">
				<m-icon type="times-o"/>
			</div>
			<div v-if="rightIconType || rightIconUrl" class="mvi-search-right-icon" @click="rightClick">
				<m-icon :type="rightIconType" :url="rightIconUrl" :spin="rightIconSpin" :size="rightIconSize" :color="rightIconColor" :class="(rightIconClass?rightIconClass:'')" />
			</div>
		</div>
		<div v-if="showCancel" v-text="cancelText" :class="['mvi-search-cancel',cancelClass?cancelClass:'']" @click="doCancel"></div>
	</div>
</template>

<script>
	import $util from "../../util/util"
	export default {
		name:"m-search",
		emits:['update:modelValue','search','cancel','left-click','right-click','focus','blur','input'],
		data(){
			return {
				focus:false
			}
		},
		props:{
			modelValue:{
				type:[String,Number],
				default:''
			},
			type:{
				type:String,
				default:'text'
			},
			placeholder:{
				type:String,
				default:''
			},
			label:{//搜索框左侧文本
				type:String,
				default:null
			},
			labelClass:{//左侧文本额外样式
				type:String,
				default:null
			},
			round:{//搜索框是否圆形
				type:Boolean,
				default:false
			},
			background:{//输入框区域背景色
				type:String,
				default:null
			},
			color:{//输入框区域字体色
				type:String,
				default:null
			},
			maxlength:{//输入的最大长度
				type:Number,
				default:-1
			},
			autofocus:{//是否自动聚焦
				type:Boolean,
				default:false
			},
			showCancel:{//是否在输入框右侧显示取消按钮
				type:Boolean,
				default:false
			},
			cancelText:{//取消按钮文字
				type:String,
				default:'取消'
			},
			cancelClass:{//取消按钮额外样式
				type:String,
				default:null
			},
			disabled:{//是否禁用
				type:Boolean,
				default:false
			},
			readonly:{//是否只读
				type:Boolean,
				default:false
			},
			align:{//输入框内容对齐方式
				type:String,
				default:'left',
				validator(value){
					return ['left','center','right'].includes(value)
				}
			},
			leftIcon:{//左侧图标
				type:[String,Object],
				default:null
			},
			rightIcon:{//右侧图标
				type:[String,Object],
				default:null
			},
			leftIconClass:{//左侧图标额外的样式类
				type:String,
				default:null
			},
			rightIconClass:{//右侧图标额外的样式类
				type:String,
				default:null
			},
			clearable:{//使用清除图标
				type:Boolean,
				default:false
			},
			inputMode:{//输入框调起移动端键盘类型
				type:[String,Boolean],
				default:false,
				validator(value){
					return [false,'none','text','decimal','numeric','tel','search','email','url']
				}
			}
		},
		computed:{
			showClear(){
				if(this.disabled || this.readonly){
					return false;
				}
				if(this.focus){
					if (this.modelValue === '') {
						return false;
					} else {
						return true;
					}
				}else{
					return false;
				}
			},
			leftIconType() {
				let t = null;
				if ($util.isObject(this.leftIcon)) {
					if (typeof this.leftIcon.type == "string") {
						t = this.leftIcon.type;
					}
				} else if (typeof this.leftIcon == "string") {
					t = this.leftIcon;
				}
				return t;
			},
			leftIconUrl() {
				let url = null;
				if ($util.isObject(this.leftIcon)) {
					if (typeof this.leftIcon.url == "string") {
						url = this.leftIcon.url;
					}
				}
				return url;
			},
			leftIconSpin() {
				let spin = false;
				if ($util.isObject(this.leftIcon)) {
					if (typeof this.leftIcon.spin == "boolean") {
						spin = this.leftIcon.spin;
					}
				}
				return spin;
			},
			leftIconSize(){
				let size = null;
				if ($util.isObject(this.leftIcon)) {
					if (typeof this.leftIcon.size == "string") {
						size = this.leftIcon.size;
					}
				}
				return size;
			},
			leftIconColor(){
				let color = null;
				if ($util.isObject(this.leftIcon)) {
					if (typeof this.leftIcon.color == "string") {
						color = this.leftIcon.color;
					}
				}
				return color;
			},
			rightIconType() {
				let t = null;
				if ($util.isObject(this.rightIcon)) {
					if (typeof this.rightIcon.type == "string") {
						t = this.rightIcon.type;
					}
				} else if (typeof this.rightIcon == "string") {
					t = this.rightIcon;
				}
				return t;
			},
			rightIconUrl() {
				let url = null;
				if ($util.isObject(this.rightIcon)) {
					if (typeof this.rightIcon.url == "string") {
						url = this.rightIcon.url;
					}
				}
				return url;
			},
			rightIconSpin() {
				let spin = false;
				if ($util.isObject(this.rightIcon)) {
					if (typeof this.rightIcon.spin == "boolean") {
						spin = this.rightIcon.spin;
					}
				}
				return spin;
			},
			rightIconSize(){
				let size = null;
				if ($util.isObject(this.rightIcon)) {
					if (typeof this.rightIcon.size == "string") {
						size = this.rightIcon.size;
					}
				}
				return size;
			},
			rightIconColor(){
				let color = null;
				if ($util.isObject(this.rightIcon)) {
					if (typeof this.rightIcon.color == "string") {
						color = this.rightIcon.color;
					}
				}
				return color;
			},
			computedValue(){
				let value = this.modelValue.toString();
				if(this.type == 'number'){
					value = value.replace(/\D/g, '');
				}
				if(this.maxlength > 0 && value.length>this.maxlength){
					value = value.substr(0, this.maxlength);
				}
				if(this.modelValue != value){
					this.$emit('update:modelValue',value)
				}
				return value;
			},
			computedType(){
				if(this.type == 'number'){
					return 'text';
				}else{
					return this.type;
				}
			},
			computedInputMode(){
				let mode = false;
				if(typeof this.inputMode == 'string'){
					mode = this.inputMode
				}
				return mode
			},
			inputStyle(){
				let style = {}
				if(this.align){
					style.textAlign = this.align
				}
				if(this.leftIconType || this.leftIconUrl){
					style.paddingLeft = 0;
				}
				if(this.showClear && this.clearable){
					style.paddingRight = 0;
				}else if(this.rightIconType || this.rightIconUrl){
					style.paddingRight = 0;
				}
				return style;
			}
		},
		methods:{
			//输入框获取焦点
			getFocus(){
				this.$emit('focus',this.modelValue)
				setTimeout(()=>{
					this.focus = true;
				},300)
			},
			//输入框失去焦点
			getBlur(){
				this.$emit('blur',this.modelValue)
				setTimeout(()=>{
					this.focus = false;
				},300)
			},
			//输入监听
			searchInput(){
				let value = this.$refs.input.value;
				//数字类型会过滤非数字字符
				if(this.type == 'number'){
					value = value.replace(/\D/g, '');
				}
				//如果设置了maxlength，则进行字符串截取
				if (this.maxlength > 0 && value.length > this.maxlength) {
					value = value.substr(0, this.maxlength);
				}
				this.$refs.input.value = value;
				
				if(this.modelValue != value){
					this.$emit('update:modelValue',value)
					this.$emit('input',value)
				}
			},
			//搜索
			doSearch(){
				if(this.disabled){
					return;
				}
				this.$emit('search',this.modelValue);
			},
			//取消
			doCancel(){
				if(this.disabled){
					return;
				}
				this.$emit('cancel',this.modelValue);
			},
			//左侧图标点击
			leftClick(){
				if(this.disabled){
					return;
				}
				this.$emit('left-click',this.modelValue);
			},
			//右侧图标点击
			rightClick(){
				if(this.disabled){
					return;
				}
				this.$emit('right-click',this.modelValue);
			},
			//清除输入框
			clearInput(){
				if(this.disabled){
					return;
				}
				this.$refs.input.value = '';
				this.$emit('update:modelValue','')
				this.$refs.input.focus();
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";
	
	.mvi-search{
		display: flex;
		display: -webkit-flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		position: relative;
		padding: @mp-sm;
		background-color: #fff;
		color: @font-color-default;
		font-size: @font-size-default;
	}
	
	.mvi-search[disabled]{
		opacity: .6;
	}
	
	.mvi-search-label{
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		padding-right: @mp-sm;
		height: .68rem;
		white-space: nowrap;
	}
	
	.mvi-search-input-container{
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		position: relative;
		width: 100%;
		flex: 1;
		height: .68rem;
		border-radius: @radius-default;
		background-color: @bg-color-default;
		color: @font-color-default;
	}
	
	.mvi-search-input{
		display: block;
		width: 100%;
		flex: 1;
		height: 100%;
		border: none;
		border-radius: inherit;
		padding: 0 @mp-md;
		line-height: 1.5;
		color: inherit;
		background-color: inherit;
		font-family: @font-family;
		background-image: none;
		margin: 0;
		font-size: @font-size-default;
		
		&::-webkit-input-placeholder,&::placeholder{
			color: inherit;
			opacity: .5;
			vertical-align: middle;
			font-family: inherit;
			font-size: inherit;
		}
	}
	
	.mvi-search-input-round{
		border-radius: @radius-round;
	}
	
	.mvi-search-cancel{
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		padding-left: @mp-sm;
		height: .68rem;
		white-space: nowrap;
		cursor: pointer;
	}
	
	.mvi-search-left-icon,.mvi-search-right-icon{
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		height: .68rem;
		width: .68rem;
	}
	
	.mvi-search-clear{
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		height: .68rem;
		width: .68rem;
		
		&:hover{
			cursor: pointer;
		}
		
		&>.mvi-icon{
			opacity: .5;
		}
	}
</style>
