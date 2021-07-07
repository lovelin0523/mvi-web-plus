<template>
	<div :class="navbarClass" :style="'z-index:'+(fixed?zIndex:'')">
		<div @click="leftClick" :class="['mvi-navbar-left',leftClass?leftClass:'']" :style="leftStyle" v-if="leftIconType||leftIconUrl||$slots.left||leftText">
			<slot name="left" v-if="$slots.left"></slot>
			<m-icon :class="[leftText?'mvi-navbar-left-icon':'']" v-if="(leftIconType||leftIconUrl) && !$slots.left" :type="leftIconType"
			:url="leftIconUrl" :spin="leftIconSpin" :size="leftIconSize" :color="leftIconColor" />
			<span class="mvi-navbar-left-text" v-if="leftText && !$slots.left" v-text="leftText"></span>
		</div>
		<div @click="titleClick" class="mvi-navbar-center" :style="centerStyle" v-if="$slots.title||title">
			<div :class="['mvi-navbar-title',titleClass?titleClass:'']">
				<slot name="title" v-if="$slots.title"></slot>
				<span v-else-if="title" v-text="title"></span>
			</div>
		</div>
		<div @click="rightClick" :class="['mvi-navbar-right',rightClass?rightClass:'']" :style="rightStyle"
		v-if="rightIconType||rightIconUrl||$slots.right||rightText">
			<slot name="right" v-if="$slots.right"></slot>
			<span class="mvi-navbar-right-text" v-if="rightText && !$slots.right" v-text="rightText"></span>
			<m-icon :class="[rightText?'mvi-navbar-right-icon':'']" v-if="(rightIconType||rightIconSpin) && !$slots.right"
			:type="rightIconType" :url="rightIconUrl" :spin="rightIconSpin" :size="rightIconSize" :color="rightIconColor" />
		</div>
	</div>
</template>

<script>
	import $util from "../../util/util"
	export default {
		name:"m-navbar",
		props:{
			title:{
				type:String,
				default:null
			},
			leftText:{
				type:String,
				default:null
			},
			rightText:{
				type:String,
				default:null
			},
			leftIcon:{
				type:[String,Object],
				default:null
			},
			rightIcon:{
				type:[String,Object],
				default:null
			},
			fixed:{
				type:Boolean,
				default:false
			},
			border:{
				type:Boolean,
				default:false
			},
			zIndex:{
				type:Number,
				default:400
			},
			leftClass:{
				type:String,
				default:null
			},
			titleClass:{
				type:String,
				default:null
			},
			rightClass:{
				type:String,
				default:null
			},
		},
		emits:['left-click','right-click','title-click'],
		computed:{
			leftStyle(){
				let style = {};
				if(this.title || this.$slots.title){
					style.width = '20%';
				}else if(this.rightIconType||this.rightIconUrl||this.$slots.right||this.rightText){
					style.width = '50%';
				}else{
					style.width = '100%';
				}
				return style;
			},
			rightStyle(){
				let style = {};
				if(this.title || this.$slots.title){
					style.width = '20%';
				}else if(this.leftIconType||this.leftIconUrl||this.$slots.left||this.leftText){
					style.width = '50%';
				}else{
					style.width = '100%';
				}
				return style;
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
			navbarClass(){
				let cls = ['mvi-navbar'];
				if(this.fixed){
					cls.push('mvi-navbar-fixed');
				}
				if(this.border){
					cls.push('mvi-navbar-border');
				}
				return cls;
			},
			centerStyle(){
				let style = {};
				if((this.rightIconType||this.rightIconUrl||this.$slots.right||this.rightText) || (this.leftIconType||this.leftIconUrl||this.$slots.left||this.leftText)){
					style.width = '60%';
				} else{
					style.width = '100%';
				}
				return style;
			}
		},
		methods:{
			leftClick(){
				this.$emit('left-click');
			},
			rightClick(){
				this.$emit('right-click');
			},
			titleClick(){
				this.$emit('title-click');
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";
	
	.mvi-navbar{
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: @medium-height;
		background-color: #fff;
		padding: 0 @mp-sm;
		position: relative;
		color: @font-color-default;
		font-size: @font-size-h6;
	}
	
	.mvi-navbar-border{
		border-bottom: 1px solid @border-color;
	}
	
	.mvi-navbar-fixed{
		position: fixed;
		top: 0;
		left: 0;
	}
	
	.mvi-navbar-left{
		display: flex;
		display: -webkit-flex;
		justify-content: flex-start;
		align-items: center;
		position: absolute;
		left:0;
		top: 0;
		height: 100%;
		vertical-align: middle;
		padding-left: @mp-sm;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}
	
	.mvi-navbar-left-icon{
		margin-right: @mp-xs;
	}
	.mvi-navbar-left-text{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.mvi-navbar-center{
		display:flex;
		display: -webkit-flex;
		align-items: center;
		height: 100%;	
	}
	.mvi-navbar-title{
		display: block;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
	}

	.mvi-navbar-right{
		display: flex;
		display: -webkit-flex;
		justify-content: flex-end;
		align-items: center;
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		padding-right: @mp-sm;
		vertical-align: middle;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.mvi-navbar-right-icon{
		margin-left: @mp-xs;
	}
	.mvi-navbar-right-text{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

</style>
