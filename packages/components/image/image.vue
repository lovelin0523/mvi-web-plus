<template>
	<div class="mvi-image" :style="imageStyle">
		<!-- 加载中 -->
		<div v-if="(loading || lazying)&&showLoading" class="mvi-image-loading">
			<slot name="loading" v-if="$slots.loading"></slot>
			<m-icon v-else :type="loadIconType" :url="loadIconUrl" :spin="loadIconSpin" :size="loadIconSize" :color="loadIconColor" />
		</div>
		<!-- 加载失败 -->
		<div v-else-if="error&&showError" class="mvi-image-error" ref="error">
			<slot name="error" v-if="$slots.error"></slot>
			<m-icon v-else :type="errorIconType" :url="errorIconUrl" :spin="errorIconSpin" :size="errorIconSize" :color="errorIconColor" />
		</div>
		<!-- 加载成功 -->
		<img @load="loadSuccess" @error="loadError" :src="computedSrc" :alt="showError?'':alt"
		 :class="imgClass">
	</div>
</template>
<script>
	import $util from "../../util/util"
	import Spy from "../spy/spy"
	export default {
		name: "m-image",
		data() {
			return {
				error: false, //是否加载失败
				loading: true, //是否正在加载中
				lazySrc: "", //延迟加载显示的图片地址
				lazying:false,//是否正在延迟中
			}
		},
		emits:['success','error'],
		props: {
			src: {
				type: String,
				default: ""
			},
			fit: {
				type: String,
				default: "fill",
				validator(value) {
					return ['fill', 'cover', 'contain', 'response', 'none'].includes(value);
				}
			},
			alt: {
				type: String,
				default: ""
			},
			showError: {
				type: Boolean,
				default: true
			},
			showLoading: {
				type: Boolean,
				default: true
			},
			lazyLoad: { //是否启用延迟加载
				type: Boolean,
				default: false
			},
			root: { //延迟加载时定义滚动的根元素ID，如"#el"，如果不设置则默认为窗口滚动
				type: String,
				default: null
			},
			loadIcon:{
				type:[String,Object],
				default:null
			},
			errorIcon:{
				type:[String,Object],
				default:null
			},
			round: {//是否原形图片
				type: Boolean,
				default: false
			},
			width:{//图片宽度
				type:String,
				default:null
			},
			height:{//图片高度
				type:String,
				default:null
			}
		},
		computed: {
			loadIconType(){
				let type = 'image-alt';
				if ($util.isObject(this.loadIcon)) {
					if (typeof this.loadIcon.type == "string") {
						type = this.loadIcon.type;
					}
				} else if (typeof this.loadIcon == "string") {
					type = this.loadIcon;
				}
				return type;
			},
			loadIconUrl(){
				let url = null;
				if ($util.isObject(this.loadIcon)) {
					if (typeof this.loadIcon.url == "string") {
						url = this.loadIcon.url;
					}
				}
				return url;
			},
			loadIconSpin(){
				let spin = false;
				if ($util.isObject(this.loadIcon)) {
					if (typeof this.loadIcon.spin == "boolean") {
						spin = this.loadIcon.spin;
					}
				}
				return spin;
			},
			loadIconSize(){
				let size = null;
				if ($util.isObject(this.loadIcon)) {
					if (typeof this.loadIcon.size == "string") {
						size = this.loadIcon.size;
					}
				}
				return size;
			},
			loadIconColor(){
				let color = null;
				if ($util.isObject(this.loadIcon)) {
					if (typeof this.loadIcon.color == "string") {
						color = this.loadIcon.color;
					}
				}
				return color;
			},
			errorIconType(){
				let type = 'image-error';
				if ($util.isObject(this.errorIcon)) {
					if (typeof this.errorIcon.type == "string") {
						type = this.errorIcon.type;
					}
				} else if (typeof this.errorIcon == "string") {
					type = this.errorIcon;
				}
				return type;
			},
			errorIconUrl(){
				let url = null;
				if ($util.isObject(this.errorIcon)) {
					if (typeof this.errorIcon.url == "string") {
						url = this.errorIcon.url;
					}
				}
				return url;
			},
			errorIconSpin(){
				let spin = false;
				if ($util.isObject(this.errorIcon)) {
					if (typeof this.errorIcon.spin == "boolean") {
						spin = this.errorIcon.spin;
					}
				}
				return spin;
			},
			errorIconSize(){
				let size = null;
				if ($util.isObject(this.errorIcon)) {
					if (typeof this.errorIcon.size == "string") {
						size = this.errorIcon.size;
					}
				}
				return size;
			},
			errorIconColor(){
				let color = null;
				if ($util.isObject(this.errorIcon)) {
					if (typeof this.errorIcon.color == "string") {
						color = this.errorIcon.color;
					}
				}
				return color;
			},
			//图片容器样式
			imageStyle(){
				let style = {}
				if(this.round){
					style.borderRadius = '50%'
				}
				if(this.width){
					style.width = this.width
				}
				if(this.height){
					style.height = this.height
				}
				return style
			},
			//图片类
			imgClass() {
				if (this.fit == 'contain') {
					return 'mvi-image-contain';
				} else if (this.fit == 'cover') {
					return 'mvi-image-cover';
				} else if (this.fit == 'none') {
					return 'mvi-image-none';
				} else if (this.fit == 'response') {
					return 'mvi-image-response';
				} else {
					return 'mvi-image-fill';
				}
			},
			//图片链接
			computedSrc(){
				if(this.lazyLoad){
					return this.lazySrc;
				}else {
					return this.src;
				}
			}
		},
		watch:{
			computedSrc(newValue,oldValue){
				this.loading = true;
			}
		},
		mounted() {
			if(this.lazyLoad){
				this.lazyloadFun();
			}
		},
		methods: {
			//延时加载方法
			lazyloadFun() {
				this.lazying = true;
				let root = null;
				if (typeof this.root == 'string' && this.root) {
					root = document.body.querySelector(this.root);
				} else if ($util.isElement(this.root)) {
					root = this.root;
				}
				//延时加载
				let spy = new Spy(this.$el, {
					el: root, //根元素
					beforeEnter: el => { //图片进入可视端口时加载
						this.lazying = false;
						this.lazySrc = this.src;
					}
				})
				spy.init();
			},
			//图片加载成功
			loadSuccess(e) {
				this.error = false;
				this.loading = false;
				this.$emit('success', e.target)
			},
			//图片加载失败
			loadError(e) {
				this.loading = false;
				this.error = true;
				this.$emit('error', e.target)
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";

	.mvi-image {
		display: inline-block;
		overflow: hidden;
		position: relative;
	}

	.mvi-image>img {
		display: block;
		margin: 0;
		padding: 0;
		border-radius: inherit;
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 1;
	}

	.mvi-image>img.mvi-image-contain {
		object-fit: contain;
	}

	.mvi-image>img.mvi-image-cover {
		object-fit: cover;
	}

	.mvi-image>img.mvi-image-fill {
		object-fit: fill;
	}

	.mvi-image>img.mvi-image-none {
		object-fit: none;
	}

	.mvi-image>img.mvi-image-response {
		object-fit: scale-down;
	}

	.mvi-image-error,
	.mvi-image-loading {
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background-color: @bg-color-dark;
		color: @font-color-sub;
		z-index: 2;
	}
</style>
