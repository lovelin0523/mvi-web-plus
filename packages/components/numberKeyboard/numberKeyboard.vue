<template>
	<m-overlay ref="overlay" :model-value="show" @show="overlayShow" @hide="overlayHide" :z-index="zIndex" :color="overlayColor" 
	:timeout="timeout" @click.self="hide" :mount-el="mountEl" :use-padding="usePadding">
		<transition name="mvi-keyboard" @before-enter="beforeEnter" @after-enter="afterEnter" @before-leave="beforeLeave"
		@after-leave="afterLeave" @leave="leave" @enter="enter">
			<div ref="keyboard" class="mvi-number-keyboard" v-if="firstShow" v-show="keyboardShow" :style="boardStyle" v-bind="$attrs">
				<div class="mvi-number-keyboard-left">
					<div :class="leftNumberClass(item)" v-for="(item,index) in numbers" v-text="item" 
					@click="numberClick(item)" v-if="showDecimal?true:(item != '.')" :data-decimal="''+showDecimal"></div>
				</div>
				<div class="mvi-number-keyboard-right" v-if="showComplete || showDelete">
					<div :disabled="deleteDisabeld || null" :class="deleteBtnClass" @click="deleteClick" v-if="showDelete">
						<slot name="delete" v-if="$slots.delete"></slot>
						<span v-text="deleteText" v-else></span>
					</div>
					<div :disabled="(promiseEmpty?null:completeDisabled || null)" :class="completeBtnClass" @click="completeClick" v-if="showComplete">
						<slot name="complete" v-if="$slots.complete"></slot>
						<span v-text="completeText"></span>
					</div>
				</div>
			</div>
		</transition>
	</m-overlay>
</template>

<script>
	import $util from "../../util/util"
	import mOverlay from "../overlay/overlay"
	export default {
		name:"m-number-keyboard",
		data(){
			return {
				firstShow:false,//第一次显示进行渲染
				keyboardShow:false,//键盘是否显示
				numbers:['1','2','3','4','5','6','7','8','9','0','.'],
			}
		},
		emits:['update:modelValue','input','delete','complete','update:show','show','showing','shown','hide','hidding','hidden'],
		inheritAttrs:false,
		props:{
			showDecimal:{//是否显示小数点
				type:Boolean,
				default:true
			},
			showDelete:{//是否显示删除按钮
				type:Boolean,
				default:true
			},
			showComplete:{//是否显示完成按钮
				type:Boolean,
				default:true
			},
			show:{//是否显示键盘
				type:Boolean,
				default:false
			},
			modelValue:{//当前输入的值
				type:[String,Number],
				default:''
			},
			zIndex:{//zIndex
				type:Number,
				default:850
			},
			timeout:{//动画时长
				type:Number,
				default:300,
			},
			closable:{//点击背景是否可关闭
				type:Boolean,
				default:false
			},
			maxlength:{//输入值最大长度
				type:Number,
				default:-1
			},
			deleteText:{//删除按钮文字
				type:String,
				default:'删除'
			},
			completeText:{//完成按钮文字
				type:String,
				default:'完成'
			},
			completeClass:{//完成按钮样式
				type:String,
				default:null
			},
			deleteClass:{//删除按钮样式
				type:String,
				default:null
			},
			promiseEmpty:{//空值时完成按钮是否可点击
				type:Boolean,
				default:false
			},
			active:{//是否显示点击态
				type:Boolean,
				default:true
			},
			mountEl:{//挂载元素
				type:String,
				default:null
			},
			overlayColor:{//遮罩层颜色
				type:String,
				default:'rgba(0,10,20,.2)'
			},
			usePadding:{//是否考虑滚动条
				type:Boolean,
				default:false
			},
			calibration:{//是否进行数字校准
				type:Boolean,
				default:false
			}
		},
		computed:{
			computedValue:{
				set(value){
					this.$emit('update:modelValue',value);
				},
				get(){
					if($util.isNumber(this.modelValue)){
						return this.modelValue.toString();
					}else{
						return this.modelValue;
					}
				}
			},
			boardStyle(){
				let style = {};
				style.transition = 'all '+ this.timeout + 'ms';
				style.webkitTransition = 'all '+this.timeout + 'ms';
				style.zIndex = this.zIndex + 10;
				return style;
			},
			deleteDisabeld(){
				if(this.modelValue === ''){
					return true;
				}else{
					return false;
				}
			},
			completeDisabled(){
				if(this.modelValue === ''){
					return true;
				}else{
					return false;
				}
			},
			leftNumberClass(){
				return item=>{
					let cls = ['mvi-number-keyboard-left-number'];
					if(item == 0){
						cls.push('mvi-number-keyboard-number-zero');
					}
					if(this.active){
						cls.push('mvi-number-keyboard-active');
					}
					return cls;
				}
			},
			deleteBtnClass(){
				let cls = ['mvi-number-keyboard-delete'];
				if(this.showDelete && !this.showComplete){
					cls.push('mvi-number-keyboard-hide');
				}
				if(this.deleteClass){
					cls.push(this.deleteClass)
				}
				if(this.active && !this.deleteDisabeld){
					cls.push('mvi-number-keyboard-active');
				}
				return cls;
			},
			completeBtnClass(){
				let cls = ['mvi-number-keyboard-complete'];
				if(this.showComplete && !this.showDelete){
					cls.push('mvi-number-keyboard-hide');
				}
				if(this.completeClass){
					cls.push(this.completeClass)
				}
				if(this.active && !(this.promiseEmpty?false:this.completeDisabled)){
					cls.push('mvi-number-keyboard-active');
				}
				return cls;
			}
		},
		components:{
			mOverlay
		},
		methods:{
			//遮罩层显示前
			overlayShow(el){
				if(!this.firstShow){
					this.firstShow = true;
				}
				this.keyboardShow = true;
			},
			//遮罩层隐藏前
			overlayHide(el){
				this.keyboardShow = false;
			},
			//数字点击
			numberClick(item){
				if(this.computedValue.length >= this.maxlength && this.maxlength>0){
					return;
				}
				this.computedValue += item;
				this.$emit('input',item);
			},
			//删除点击
			deleteClick(){
				if(this.deleteDisabeld){
					return;
				}
				let value = $util.deleteStr(this.computedValue,this.computedValue.length-1,1);
				this.computedValue = value;
				this.$emit('delete',value);
			},
			//完成点击
			completeClick(){
				if(this.completeDisabled && !this.promiseEmpty){
					return;
				}
				if(this.calibration){
					this.computedValue = parseFloat(this.computedValue) || '';
				}
				this.$emit('complete',this.computedValue)
				this.hideKeyboard();
			},
			//点击遮罩层关闭
			hide(){
				if(this.closable){
					this.hideKeyboard();
				}
			},
			//关闭
			hideKeyboard(){
				this.$emit('update:show',false);
			},
			//弹出层显示前
			beforeEnter(el){
				//解决v-if和v-show作用在同一元素上时触发两次钩子函数的bug
				if(el.data('mvi-keyboard-beforeEnter-trigger')){
					return;
				}
				el.data('mvi-keyboard-beforeEnter-trigger',true);
				this.$emit('show',el);
				if(typeof this.keyboardComponentWatch == 'function'){
					this.keyboardComponentWatch.apply(this,['show',el])
				}
			},
			//弹出层显示时
			enter(el){
				//解决v-if和v-show作用在同一元素上时触发两次钩子函数的bug
				if(el.data('mvi-keyboard-enter-trigger')){
					return;
				}
				el.data('mvi-keyboard-enter-trigger',true);
				this.$emit('showing',el);
				if(typeof this.keyboardComponentWatch == 'function'){
					this.keyboardComponentWatch.apply(this,['showing',el])
				}
			},
			//弹出层显示后
			afterEnter(el){
				this.$emit('shown',el);
				if(typeof this.keyboardComponentWatch == 'function'){
					this.keyboardComponentWatch.apply(this,['shown',el])
				}
			},
			//弹出层隐藏前
			beforeLeave(el){
				//清除标记
				el.data('mvi-keyboard-beforeEnter-trigger',false);
				el.data('mvi-keyboard-enter-trigger',false);
				
				this.$emit('hide',el);
				if(typeof this.keyboardComponentWatch == 'function'){
					this.keyboardComponentWatch.apply(this,['hide',el])
				}
			},
			//弹出层隐藏时
			leave(el){
				this.$emit('hidding',el);
				if(typeof this.keyboardComponentWatch == 'function'){
					this.keyboardComponentWatch.apply(this,['hidding',el])
				}
			},
			//弹出层隐藏后
			afterLeave(el){
				this.$emit('hidden',el);
				if(typeof this.keyboardComponentWatch == 'function'){
					this.keyboardComponentWatch.apply(this,['hidden',el])
				}
			}
		}
	}
</script>

<style lang="less" scoped >
	@import "../../css/mvi-basic.less";
	
	.mvi-number-keyboard{
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		overflow: hidden;
		background-color: #fff;
		user-select: none;
		-webkit-user-select: none;
	}
	
	.mvi-number-keyboard-left{
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		-webkit-flex-wrap: wrap;
		flex: 1;
	}
	
	.mvi-number-keyboard-left-number{
		position: relative;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		width: calc(~'1/3 * 100%');
		height: 1.2rem;
		border-top: 1px solid @border-color;
		border-right: 1px solid @border-color;
		margin: 0;
		padding: 0;
		font-weight: bold;
		cursor: pointer;
	}
	
	.mvi-number-keyboard-left-number.mvi-number-keyboard-number-zero{
		width: calc(~'2/3 * 100%');
	}
	
	.mvi-number-keyboard-left-number.mvi-number-keyboard-number-zero[data-decimal="false"]{
		width: 100%;
	}
	
	.mvi-number-keyboard-right{
		display: block;
		height: 100%;
		width: 2.1rem;
	}
	
	.mvi-number-keyboard-delete{
		position: relative;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height:2.4rem;
		background-color: @bg-color-dark;
		font-weight: bold;
		cursor: pointer;
		border-top: 1px solid @border-color;
	}
	
	.mvi-number-keyboard-complete{
		position: relative;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height:2.4rem;
		background-color: @primary-normal;
		color: #fff;
		font-weight: bold;
		cursor: pointer;
		border-top: 1px solid @border-color;
	}
	
	.mvi-number-keyboard-hide{
		height: 4.8rem;
	}
	
	.mvi-keyboard-enter-from,.mvi-keyboard-leave-to{
		transform: translateY(100%);
	}
	
	.mvi-number-keyboard-active:active::before{
		.mvi-active();
	}
	
	.mvi-number-keyboard-delete[disabled]::before,
	.mvi-number-keyboard-complete[disabled]::before{
		content: ' ';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 20;
		background-color: #fff;
		opacity: .4;
		box-sizing: content-box;
		-webkit-box-sizing: content-box;
	}
</style>
