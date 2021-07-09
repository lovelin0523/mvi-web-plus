<template>
	<div :disabled="disabled || null" :class="sliderClass" :style="sliderStyle" @click="dragTo">
		<div ref="bar" class="mvi-slider-bar" :style="sliderBarStyle">
		</div>
		<div class="mvi-slider-button" ref="btn">
			<slot name="button" v-if="$slots.button"></slot>
			<div v-else :class="['mvi-slider-button-el',buttonClass?buttonClass:'']" :style="buttonElStyle"></div>
		</div>
	</div>
</template>

<script>
	import $util from "../../util/util.js"
	import Drag from "../drag/drag";
	export default {
		name: "m-slider",
		data() {
			return {
				btn:null,
				drag: null,
				isdrag:false
			}
		},
		emits:['update:modelValue','change'],
		props: {
			modelValue: { //当前值
				type: Number,
				default: 0
			},
			min: { //最小值
				type: Number,
				default: 0
			},
			max: { //最大值
				type: Number,
				default: 100
			},
			barHeight: { //进度粗细
				type: String,
				default: null
			},
			activeColor: { //激活的进度颜色
				type: String,
				default: null
			},
			barColor: { //进度条默认颜色
				type: String,
				default: null
			},
			disabled: { //是否禁用
				type: Boolean,
				default: false
			},
			vertical: { //是否垂直
				type: Boolean,
				default: false
			},
			round:{
				type:Boolean,
				default:false
			},
			square:{
				type:Boolean,
				default:false
			},
			buttonClass: { //拖拽按钮额外样式类
				type: String,
				default: null
			}
		},
		computed: {
			sliderStyle() {
				let style = {};
				if (this.barHeight) {
					if (this.vertical) {
						style.width = this.barHeight;
					} else {
						style.height = this.barHeight;
					}
				}
				if (this.barColor) {
					style.backgroundColor = this.barColor;
				}
				return style;
			},
			sliderBarStyle() {
				let style = {};
				if (this.activeColor) {
					style.backgroundColor = this.activeColor;
				}
				if (this.vertical) {
					style.height = `calc(${(this.modelValue - this.min) / (this.max - this.min)} * 100%)`;
				} else {
					style.width = `calc(${(this.modelValue - this.min) / (this.max - this.min)} * 100%)`;
				}
				return style;
			},
			buttonElStyle() {
				let style = {};
				if (this.barHeight) {
					style.width = `calc(${this.barHeight} * 2)`;
					style.height = `calc(${this.barHeight} * 2)`;
				}
				if(this.btn){
					this.setBtnOffset();
				}
				return style;
			},
			sliderClass(){
				let cls = ['mvi-slider'];
				if(this.round){
					cls.push('mvi-slider-radius-round');
				}else if(this.square){
					cls.push('mvi-slider-radius-square');
				}
				if(this.vertical){
					cls.push('mvi-slider-vertical');
				}
				return cls;
			}
		},
		mounted() {
			this.btn = this.$refs.btn;
			this.drag = new Drag(this.$refs.btn,{
				container:this.$el,
				mode: 'on',
				draggableY: this.vertical && (!this.disabled),
				draggableX: (!this.vertical) && (!this.disabled),
				drag:this.onDrag,
				dragged:()=>{
					this.$nextTick(()=>{
						setTimeout(()=>{
							this.isdrag = false;
						},10)
					})
				}
			});
			this.drag.init();
		},
		watch:{
			disabled(newValue){
				if(this.drag){
					if(newValue){
						if(this.vertical){
							this.drag.draggableY = false;
						}else{
							this.drag.draggableX = false;
						}
					}else{
						if(this.vertical){
							this.drag.draggableY = true;
						}else{
							this.drag.draggableX = true;
						}
					}
				}
				
			},
			vertical(newValue){
				this.$nextTick(()=>{
					this.setBtnOffset();
				})
			}
		},
		methods: {
			//拖拽
			onDrag(res) {
				this.isdrag = true;
				if (this.vertical) {
					let top = res.placement.top;
					let value = ((top + this.$refs.btn.offsetHeight / 2) / this.$el.offsetHeight) * (this.max - this.min) + this.min;
					this.$emit('update:modelValue', value);
					this.$emit('change',value);
				} else {
					let left = res.placement.left;
					let value = ((left + this.$refs.btn.offsetWidth / 2) / this.$el.offsetWidth) * (this.max - this.min) + this.min;
					this.$emit('update:modelValue', value);
					this.$emit('change',value);
				}
			},
			//设置按钮的移动距离
			setBtnOffset() {
				if (this.vertical) {
					this.$refs.btn.style.left = "50%";
					this.$refs.btn.style.top = ((this.modelValue - this.min) / (this.max - this.min)) * this.$el.offsetHeight - this.$refs.btn.offsetHeight /
						2 + "px";
				} else {
					this.$refs.btn.style.top = "50%";
					this.$refs.btn.style.left = ((this.modelValue - this.min) / (this.max - this.min)) * this.$el.offsetWidth - this.$refs.btn.offsetWidth /
						2 + "px";
				}
			},
			//跳转到指定位置
			dragTo(event) {
				if (this.disabled) {
					return;
				}
				if(this.isdrag){
					return;
				}
				if($util.isContains(this.$refs.btn,event.target)){
					return;
				}
				if (this.vertical) {
					let top = event.offsetY;
					let value = (top / this.$el.offsetHeight) * (this.max - this.min) + this.min;
					this.$emit('update:modelValue', value);
					this.$emit('change',value);
				} else {
					let left = event.offsetX;
					let value = (left / this.$el.offsetWidth) * (this.max - this.min) + this.min;
					this.$emit('update:modelValue', value);
					this.$emit('change',value);
				}
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";
	
	.mvi-slider {
		position: relative;
		display: block;
		width: 100%;
		height: 0.1rem;
		background-color: @bg-color-dark;
		touch-action: none;
		border-radius: @radius-default;
		margin: @mp-sm 0;
		user-select: none;
		-ms-user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
	}

	.mvi-slider[disabled] {
		opacity: .5;
	}

	.mvi-slider-vertical {
		height: 100%;
		width: 0.1rem;
		margin: 0 @mp-sm;
	}

	.mvi-slider.mvi-slider-radius-square{
		border-radius: 0;
	}

	.mvi-slider.mvi-slider-radius-round {
		border-radius: @radius-round;
	}

	.mvi-slider-bar {
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: @info-normal;
		border-radius: inherit;
		touch-action: none;
	}

	.mvi-slider-button {
		position: absolute;
		left: 0;
		top: 50%;
		cursor: pointer;
		transform: translateY(-50%);
		-webkit-transform: translateY(-50%);
	}

	.mvi-slider-vertical .mvi-slider-button {
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		-webkit-transform: translateX(-50%);
	}

	.mvi-slider-button-el {
		display: block;
		min-width: .4rem;
		min-height: .4rem;
		background-color: #fff;
		box-shadow: @boxshadow;
		-webkit-box-shadow: @boxshadow;
		border-radius: @radius-circle;
	}
</style>
