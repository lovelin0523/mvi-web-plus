<template>
	<div :data-id="'mvi-autocomplete-'+uid" :class="autocompleteClass" :disabled="disabled || null">
		<div :class="targetClass" :style="targetStyle" :data-id="'mvi-autocomplete-target-'+uid" ref="target">
			<div @click="leftClick" v-if="leftIconType ||　leftIconUrl" class="mvi-autocomplete-left-icon">
				<m-icon :type="leftIconType" :url="leftIconUrl" :spin="leftIconSpin" :size="leftIconSize" :color="leftIconColor"/>
			</div>
			<input ref="input" @input="input" :value="modelValue" type="text" :placeholder="placeholder" :style="inputStyle" :name="name" @focus="inputFocus" @blur="inputBlur" :disabled="disabled || null" autocomplete="off"/>
			<div @click="doClear" v-if="clearable" v-show="showClearIcon" class="mvi-autocomplete-clear" :style="clearStyle">
				<m-icon type="times-o" />
			</div>
			<div class="mvi-autocomplete-right-icon" v-if="rightIconType ||　rightIconUrl" @click="rightClick">
				<m-icon :type="rightIconType" :url="rightIconUrl" :spin="rightIconSpin" :size="rightIconSize" :color="rightIconColor"/>
			</div>
		</div>
		<m-layer :model-value="show" :target="`[data-id='mvi-autocomplete-target-${uid}']`" 
		:root="`[data-id='mvi-autocomplete-${uid}']`" :placement="placement" :offset="offset" :fixed="fixed" :z-index="zIndex"  :fixed-auto="fixedAuto" ref="layer" :wrapper-class="wrapperClass" :animation="animation" shadow :border="false" :timeout="timeout" :closable="false" :show-triangle="false" @showing="layerShow">
			<div class="mvi-autocomplete-menu" :style="menuStyle" ref="menu">
				<div class="mvi-autocomplete-list" v-for="(item,index) in computedFilter" v-text="item" @click="doSelect(item)" @mouseenter="listEnter" @mouseleave="listLeave"></div>
			</div>
		</m-layer>
	</div>
</template>

<script>
	import { getCurrentInstance } from "vue"
	import $util from "../../util/util"
	import mIcon from "../icon/icon"
	import mLayer from "../layer/layer"
	export default {
		name:'m-autocomplete',
		data(){
			return {
				focus:false,
				target:null
			}
		},
		emits:['update:modelValue','focus','blur','input','left-click','right-click','select'],
		props:{
			modelValue:{//输入框的值
				type:[String,Number],
				default:''
			},
			placeholder:{//占位符
				type:String,
				default:''
			},
			size:{//组件大小
				type:String,
				default:'medium',
				validator(value){
					return ['small','medium','large'].includes(value)
				}
			},
			list:{//可选值数组
				type:Array,
				default:function(){
					return [];
				}
			},
			activeType:{//激活样式
				type:String,
				default:'info',
				validator(value){
					return ['info','success','warn','error','primary'].includes(value)
				}
			},
			activeColor:{//激活颜色
				type:String,
				default:null
			},
			filterMethod:{//过滤方法
				type:[Function,Boolean],
				default:false
			},
			clearable:{//是否启用清除图标
				type:Boolean,
				default:false
			},
			disabled:{//是否禁用
				type:Boolean,
				default:false
			},
			placement:{//layer位置
				type:String,
				default:'bottom-start'
			},
			fixed:{//layer的fixed
				type:Boolean,
				default:false
			},
			fixedAuto:{//layer适配transform父元素
				type:Boolean,
				default:false
			},
			width:{//layer的width
				type:String,
				default:null
			},
			zIndex:{//layer的z-index
				type:Number,
				default:400
			},
			height:{//layer最大高度
				type:String,
				default:null
			},
			offset:{//layer的offset
				type:String,
				default:'0.1rem'
			},
			wrapperClass:{//layer的额外样式
				type:String,
				default:null
			},
			animation:{//layer显示与隐藏动画
				type:String,
				default:null
			},
			timeout:{//layer动画时间
				type:Number,
				default:300
			},
			name:{//原生name
				type:String,
				default:null
			},
			hoverClass:{//layer层列表悬浮样式
				type:String,
				default:null
			},
			leftIcon:{//左侧图标
				type:[String,Object],
				default:null
			},
			rightIcon:{//右侧图标
				type:[String,Object],
				default:null
			},
			round:{//是否圆角
				type:Boolean,
				default:false
			},
			square:{//是否方形
				type:Boolean,
				default:false
			},
			align:{//对齐方式
				type:String,
				default:'left',
				validator(value){
					return ['left','right','center'].includes(value)
				}
			}
		},
		components:{
			mIcon,mLayer
		},
		setup() {
			const instance = getCurrentInstance();
			return {
				uid:instance.uid
			}
		},
		computed:{
			show(){
				return this.focus && this.computedFilter.length != 0
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
			leftIconSize() {
				let size = null;
				if ($util.isObject(this.leftIcon)) {
					if (typeof this.leftIcon.size == "string") {
						size = this.leftIcon.size;
					}
				}
				return size;
			},
			leftIconColor() {
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
			rightIconSize() {
				let size = null;
				if ($util.isObject(this.rightIcon)) {
					if (typeof this.rightIcon.size == "string") {
						size = this.rightIcon.size;
					}
				}
				return size;
			},
			rightIconColor() {
				let color = null;
				if ($util.isObject(this.rightIcon)) {
					if (typeof this.rightIcon.color == "string") {
						color = this.rightIcon.color;
					}
				}
				return color;
			},
			showClearIcon(){
				if(this.disabled){
					return false;
				}
				if(this.modelValue && this.focus){
					return true;
				}else{
					return false;
				}
			},
			clearStyle(){
				let style = {}
				if(this.rightIconType || this.rightIconUrl){
					style.borderRadius = 0;
				}
				return style
			},
			menuStyle(){
				let style = {};
				if(this.height){
					style.maxHeight = this.height;
				}
				return style;
			},
			computedFilter(){
				if(typeof this.filterMethod == 'function'){
					return this.filterMethod(this.modelValue,this.list);
				}else if(this.filterMethod){
					return this.defaultFilter();
				}else{
					return this.list;
				}
			},
			inputStyle(){
				let style = {}
				if(this.leftIconType || this.leftIconUrl){
					style.paddingLeft = 0;
				}
				if(this.showClearIcon && this.clearable){
					style.paddingRight = 0;
				}else if(this.rightIconType || this.rightIconUrl){
					style.paddingRight = 0;
				}
				if(this.align){
					style.textAlign = this.align;
				}
				return style
			},
			autocompleteClass(){
				let cls = ['mvi-autocomplete','mvi-autocomplete-'+this.size];
				if(this.round){
					cls.push('mvi-autocomplete-round')
				}else if(this.square){
					cls.push('mvi-autocomplete-square')
				}
				return cls;
			},
			targetStyle(){
				let style = {};
				if(this.activeColor && this.focus){
					style.borderColor = this.activeColor;
				}
				return style;
			},
			targetClass(){
				let cls = ['mvi-autocomplete-target'];
				if(this.activeType && !this.activeColor && this.focus){
					cls.push('mvi-autocomplete-'+this.activeType)
				}
				return cls
			}
		},
		methods:{
			//悬浮层显示前进行宽度设置
			layerShow(){
				if(this.width){
					this.$refs.menu.style.width = this.width;
				}else {
					this.$refs.menu.style.width = this.$refs.target.offsetWidth + 'px';
				}
			},
			rightClick(e){
				if(this.disabled){
					return;
				}
				this.$emit('right-click',this.modelValue)
			},
			leftClick(e){
				if(this.disabled){
					return;
				}
				this.$emit('left-click',this.modelValue)
			},
			listEnter(e){
				if(this.hoverClass){
					$util.addClass(e.currentTarget,this.hoverClass);
				}
			},
			listLeave(e){
				if(this.hoverClass){
					$util.removeClass(e.currentTarget,this.hoverClass);
				}
			},
			input(){
				if(this.disabled){
					return;
				}
				this.focus = true;
				this.$nextTick(()=>{
					setTimeout(()=>{
						this.$refs.layer.reset();
					},10)
				})
				this.$emit('update:modelValue',this.$refs.input.value)
				this.$emit('input',this.$refs.input.value)
			},
			inputBlur(){
				this.$emit('blur',this.modelValue)
				setTimeout(()=>{
					this.focus = false;
				},200)
			},
			inputFocus(){
				if(this.disabled){
					return;
				}
				this.$emit('focus',this.modelValue);
				setTimeout(()=>{
					this.focus = true;
				},200)
			},
			doClear(){
				if(this.disabled){
					return;
				}
				this.$emit('update:modelValue','')
				this.$refs.input.value = '';
				this.$refs.input.focus();
			},
			doSelect(item){
				this.$emit('update:modelValue',item);
				this.$emit('select',item);
				this.focus = false;
			},
			//默认过滤方法
			defaultFilter(){
				let arr = [];
				let length = this.list.length;
				for(let i = 0;i<length;i++){
					if(this.list[i].includes(this.modelValue)){
						arr.push(this.list[i]);
					}
				}
				return arr;
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";
	
	.mvi-autocomplete{
		display: block;
		width: 100%;
		border-radius: @radius-default;
		color: @font-color-default;
		position: relative;
		background-color: #fff;

		&.mvi-autocomplete-round{
			border-radius: @radius-round;
		}
		
		&.mvi-autocomplete-square{
			border-radius: 0;
		}

		&.mvi-autocomplete-small{
			font-size: @font-size-small;
			height: @small-height;
			
			.mvi-autocomplete-left-icon,.mvi-autocomplete-right-icon,.mvi-autocomplete-clear{
				padding: 0 @mp-xs*2.4;
			}
			
			input{
				padding: 0 @mp-sm;
			}
			
			.mvi-autocomplete-list{
				padding: @mp-sm;
			}
		}
		
		&.mvi-autocomplete-medium{
			font-size: @font-size-default;
			height: @medium-height;
			
			.mvi-autocomplete-left-icon,.mvi-autocomplete-right-icon,.mvi-autocomplete-clear{
				padding: 0 @mp-md;
			}
			
			input{
				padding: 0 @mp-md;
			}
			
			.mvi-autocomplete-list{
				padding: @mp-md;
			}
		}
		
		&.mvi-autocomplete-large{
			font-size: @font-size-h6;
			height: @large-height;
			
			.mvi-autocomplete-left-icon,.mvi-autocomplete-right-icon,.mvi-autocomplete-clear{
				padding: 0 @mp-xs*3.4;
			}
			
			input{
				padding: 0 @mp-lg;
			}
			
			.mvi-autocomplete-list{
				padding: @mp-lg;
			}
		}
		
		&[disabled]{
			opacity: .6;
		}
	}
	
	.mvi-autocomplete-target{
		display: flex;
		display: -webkit-flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 100%;
		border-radius: inherit;
		border: 1px solid @border-color;
		transition: border-color 600ms;
		-webkit-transition: border-color 600ms;
		-ms-transition: border-color 600ms;
		-moz-transition: border-color 600ms;
		
		input{
			appearance: none;
			-moz-appearance: none;
			-webkit-appearance: none;
			display: block;
			width: 100%;
			height: 100%;
			flex: 1;
			margin: 0;
			padding: 0;
			border: none;
			border-radius: inherit;
			background-color: inherit;
			color: inherit;
			font-size: inherit;
			vertical-align: middle;
			
			&::-webkit-input-placeholder,&::placeholder,&::-moz-placeholder,&:-ms-input-placeholder{
				color: inherit;
				font-family: inherit;
				font-size: inherit;
				opacity: .5;
				vertical-align: middle;
			}
			
			&[disabled]{
				background-color: inherit;
				color: inherit;
			}
		}
		
		//左侧图标、右侧图标、清除图标
		.mvi-autocomplete-left-icon,.mvi-autocomplete-right-icon,.mvi-autocomplete-clear{
			display: flex;
			display: -webkit-flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			border-radius: 0;
			
			&:hover{
				cursor: pointer;
			}
		}
		
		.mvi-autocomplete-clear{
			opacity: .6;
		}
		
		.mvi-autocomplete-left-icon{
			border-top-left-radius: inherit;
			border-bottom-left-radius: inherit;
		}
		
		.mvi-autocomplete-right-icon,.mvi-autocomplete-clear{
			border-top-right-radius: inherit;
			border-bottom-right-radius: inherit;
		}
		
		&.mvi-autocomplete-info{
			border-color: @info-normal;
		}
		&.mvi-autocomplete-success{
			border-color: @success-normal;
		}
		&.mvi-autocomplete-primary{
			border-color: @primary-normal;
		}
		&.mvi-autocomplete-warn{
			border-color: @warn-normal;
		}
		&.mvi-autocomplete-error{
			border-color: @error-normal;
		}
	}

	//悬浮层
	.mvi-autocomplete-menu{
		display: block;
		padding: @mp-xs 0;
		overflow: auto;
		overflow-x: hidden;
		
		.mvi-autocomplete-list{
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		
		.mvi-autocomplete-list:hover{
			cursor: pointer;
			background-color: @bg-color-default;
		}
	}
</style>
