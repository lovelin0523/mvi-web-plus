<template>
	<div :class="['mvi-collapse-item',computedOutBorder?'mvi-collapse-item-border':'']">
		<m-cell class="mvi-collapse-cell" :icon="icon" :content="label" :title="title" :border="cellBorder" :arrow="arrow" 
		:title-class="titleClass" :content-class="labelClass" @click="changeCollapse" :active="computedActive"
		:no-wrap="computedNoWrap"></m-cell>
		<m-transition-slide :expand="open" :timeout="computedTimeout" @before-slide-up="beforeSlideUp" @slide-up="slideUp" 
		@before-slide-down="beforeSlideDown" @slide-down="slideDown">
			<div :class="['mvi-collapse-item-content',contentClass?contentClass:'']">
				<slot v-if="$slots.default"></slot>
				<span v-else v-text="content"></span>
			</div>
		</m-transition-slide>
	</div>
</template>

<script>
	import $dap from "dap-util"
	import mCell from "../cell/cell"
	import mTransitionSlide from "../transitionSlide/transitionSlide"
	export default {
		name: "m-collapse-item",
		data() {
			return {
				open:true,
				cellBorder:false
			}
		},
		props: {
			icon: { //标题栏左侧图标
				type: [String, Object],
				default: null
			},
			title: { //标题
				type: String,
				default: null
			},
			label: { //标题栏内容
				type: String,
				default: null
			},
			outBorder: { //是否显示外下边框
				type: Boolean,
				default: null
			},
			inBorder: { //是否显示内下边框
				type: Boolean,
				default: null
			},
			titleClass: { //标题栏标题额外样式
				type: String,
				default: null
			},
			labelClass: { //标题栏内容额外样式
				type: String,
				default: null
			},
			active: { //标题栏是否显示点击态
				type: Boolean,
				default: null
			},
			disabled: { //是否禁用
				type: Boolean,
				default: false
			},
			content: { //展开的内容
				type: String,
				default: ''
			},
			contentClass: { //展开的内容的额外样式类
				type: String,
				default: null
			},
			noWrap: { //是否对标题栏的标题和内容使用单行限制
				type: Boolean,
				default: null
			},
			openArrow: {//打开时右侧图标
				type: [String, Object],
				default: null
			},
			closeArrow: {//关闭时右侧图标
				type: [String, Object],
				default: null
			},
			timeout:{//折叠或者展开的动画时长,单位ms
				type:Number,
				default: null
			}
		},
		inject: ['collapse'],
		components:{
			mCell,mTransitionSlide
		},
		created() {
			this.collapse.children.push(this);
			this.cellBorder = this.computedInBorder;
			this.isNeedHideSelf();
		},
		watch:{
			'collapse.modelValue':function(newValue,oldValue){
				this.isNeedHideSelf();
			}
		},
		computed: {
			computedOutBorder() {
				if (typeof this.outBorder == "boolean") {
					return this.outBorder;
				} else {
					return this.collapse.outBorder;
				}
			},
			computedInBorder() {
				if (typeof this.inBorder == "boolean") {
					return this.inBorder;
				} else {
					return this.collapse.inBorder;
				}
			},
			computedNoWrap() {
				if (typeof this.noWrap == "boolean") {
					return this.noWrap;
				} else {
					return this.collapse.noWrap;
				}
			},
			//item在collapse中的序列值
			itemIndex() {
				let index = 0;
				for (let i = 0; i < this.collapse.children.length; i++) {
					if (this.collapse.children[i] == this) {
						index = i;
						break;
					}
				}
				return index;
			},
			//打开时右侧图标
			computedOpenArrow() {
				if ((typeof this.openArrow == 'string' && this.openArrow) ||
					$dap.common.isObject(this.openArrow)) {
					return this.openArrow;
				} else {
					return this.collapse.openArrow;
				}
			},
			//关闭时右侧图标
			computedCloseArrow() {
				if ((typeof this.closeArrow == 'string' && this.closeArrow) ||
					$dap.common.isObject(this.openArrow)) {
					return this.closeArrow;
				} else {
					return this.collapse.closeArrow;
				}
			},
			//右侧图标
			arrow() {
				return this.open ? this.computedOpenArrow : this.computedCloseArrow;
			},
			//点击态
			computedActive() {
				if (typeof this.active == "boolean") {
					return this.active;
				} else {
					return this.collapse.active;
				}
			},
			//折叠面板显示隐藏动画时长
			computedTimeout() {
				if (typeof this.timeout == "number") {
					return this.timeout;
				} else {
					return this.collapse.timeout;
				}
			},
		},
		methods: {
			//面板展开前触发
			beforeSlideDown(){
				this.collapse.$emit('before-slide-down',this.itemIndex)
				if(this.computedInBorder){
					this.cellBorder = true;
				}
			},
			//面板展开后触发
			slideDown(){
				this.collapse.$emit('slide-down',this.itemIndex);
			},
			//面板收起前触发
			beforeSlideUp(){
				this.collapse.$emit('before-slide-up',this.itemIndex)
			},
			//面板收起后触发
			slideUp(){
				if(this.computedInBorder){
					this.cellBorder = false;
				}
				this.collapse.$emit('slide-up',this.itemIndex);
			},
			//判断是否需要隐藏此折叠面板
			isNeedHideSelf(){
				if (this.collapse.accordion) { //手风琴模式
					if(this.collapse.modelValue == this.itemIndex){
						this.open = true;
					}else{
						this.open = false;
					}
				} else { //非手风琴模式
					//值为数字
					if ($dap.number.isNumber(this.collapse.modelValue)) {
						if (this.collapse.modelValue == this.itemIndex) { 
							this.open = true;
						} else {
							this.open = false;
						}
					} else if ((this.collapse.modelValue) instanceof Array) { //值为数组
						if (this.collapse.modelValue.includes(this.itemIndex)) {
							this.open = true;
						} else {
							this.open = false;
						}
					} else {
						this.open = false;
					}
				}
			},
			//点击collapse-item
			changeCollapse() {
				if (this.disabled || this.collapse.disabled) {
					return false;
				}
				if (this.collapse.accordion) { //手风琴模式
					//关闭当前面板
					if(this.collapse.modelValue == this.itemIndex){
						this.collapse.$emit('update:modelValue', null);
					}else{
						this.collapse.$emit('update:modelValue', this.itemIndex);
					}
				} else { //非手风琴模式
					//值为数字
					if ($dap.number.isNumber(this.collapse.modelValue)) {
						if (this.collapse.modelValue == this.itemIndex) { //关闭当前展开的面板
							this.collapse.$emit('update:modelValue', []);
						} else { //打开面板
							this.collapse.$emit('update:modelValue', [this.collapse.modelValue, this.itemIndex]);
						}
					} else if (this.collapse.modelValue instanceof Array) { //值为数组
						if (this.collapse.modelValue.includes(this.itemIndex)) { //关闭当前面板
							let arry = [...this.collapse.modelValue];
							let index = this.getIndex(arry, this.itemIndex);
							arry.splice(index, 1);
							this.collapse.$emit('update:modelValue', arry);
						} else { //打开面板
							let arry = [...this.collapse.modelValue];
							arry.push(this.itemIndex);
							this.collapse.$emit('update:modelValue', arry);
						}
					} else {
						let arry = [];
						arry.push(this.itemIndex);
						this.collapse.$emit('update:modelValue', arry);
					}
				}
			},
			//获取元素在数组中的下标
			getIndex(arry, value) {
				let index = 0;
				arry.forEach((item, i) => {
					if (item == value) {
						index = i;
					}
				})
				return index;
			}
		}
	}
</script>
<style lang="less" scoped>
	@import "../../css/mvi-basic.less";

	.mvi-collapse-item {
		display: block;
		width: 100%;
		overflow: hidden;
		background-color: inherit;
	}

	.mvi-collapse-item.mvi-collapse-item-border {
		border-bottom: 1px solid @border-color;
	}
	
	.mvi-collapse-cell{
		background-color: inherit;
		color: inherit;
		cursor: pointer;
	}

	.mvi-collapse-item-content {
		display: block;
		width: 100%;
		padding: @mp-sm;
		font-size: @font-size-default;
		color: inherit;
		line-height: 1.5;
	}
	
</style>
