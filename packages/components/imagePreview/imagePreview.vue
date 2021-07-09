<template>
	<m-overlay ref="overlay" :model-value="modelValue" color="#000" :fade="false" @showing="overlayShowing" :z-index="zIndex" :use-padding="usePadding" :mountEl="mountEl">
		<m-swiper v-if="firstShow" class="mvi-image-preview-swiper" :initial-slide="active" show-indicators ref="swiper"
		 :width="swiperWidth" :height="swiperHeight" @change="swiperChange" @mousedown="mouseDown" @mouseup="mouseUp" :show-control="showControl" :fade="fade" :touchable="!isDoubleTouch" :control-class="controlClass">
			<m-swiper-slide v-for="(item,index) in images" @wheel="wheelImage(index,$event)" 
			@touchstart="prviewTouchStart(index,$event)" @touchmove="previewTouchMove(index,$event)" 
			@touchend="previewTouchend(index,$event)" :id="'mvi-preview-slide-'+index" class="mvi-preview-container">
				<m-image :error-icon="errorIcon" :load-icon="loadIcon" @click="closeOverlay" class="mvi-image-preview" :src="item" fit="response" :ref="el=>imageRefs[index]=el"></m-image>
			</m-swiper-slide>
			<template #indicators="data">
				<div class="mvi-image-preview-page" v-if="showPage">
					<slot name="page" :total="data.total" :current="data.active" v-if="$slots.page"></slot>
					<div v-else>
						<span v-text="data.active+1"></span>
						<span>/</span>
						<span v-text="data.total"></span>
					</div>
				</div>
				<div v-if="$slots.descriptions || descriptions.length>0" class="mvi-image-preview-footer">
					<slot name="descriptions" :total="data.total" :current="data.active" v-if="$slots.descriptions"></slot>
					<div v-else-if="descriptions.length>0" class="mvi-image-preview-description" v-text="descriptions[data.active]"></div>
				</div>
			</template>
		</m-swiper>

	</m-overlay>
</template>

<script>
	import { toRaw } from "vue"
	export default {
		name: "m-image-preview",
		data() {
			return {
				firstShow: false,
				start: 0,
				end: 0,
				isDoubleTouch:false,//是否双指触摸
				touchDistance:0,//双指触点距离
				swiperWidth:'100%',//轮播图宽度
				swiperHeight:'100%',//轮播图高度
				scale:1,//缩放比例
				imageRefs:[]//image组件对象数组
			}
		},
		emits:['update:modelValue','change'],
		props: {
			modelValue: { //是否显示
				type: Boolean,
				default: false
			},
			images: { //图片数组
				type: Array,
				default: function() {
					return [];
				}
			},
			descriptions: { //图片描述
				type: Array,
				default: function() {
					return []
				}
			},
			active: { //默认显示的图片序列
				type: Number,
				default: 0
			},
			mountEl:{//挂载元素
				type:String,
				default:null
			},
			showPage: { //是否显示页码
				type: Boolean,
				default: true
			},
			zIndex: { //z-index值
				type: Number,
				default: 5000
			},
			fade: { //是否使用渐变
				type: Boolean,
				default: false
			},
			showControl: { //是否显示控制器
				type: Boolean,
				default: false
			},
			controlClass: { //控制器额外样式
				type: String,
				default: null
			},
			usePadding: {//局部显示是否考虑滚动条影响
				type: Boolean,
				default: false
			},
			errorIcon:{//图片加载失败提示设置
				type:[String,Object],
				default:function(){
					return {
						size:'1rem'
					}
				}
			},
			loadIcon:{//图片加载中提示设置
				type:[String,Object],
				default:function(){
					return {
						size:'1rem'
					}
				}
			}
		},
		mounted() {
			window.addEventListener('resize',this.resize)
		},
		methods: {
			//调整大小
			resize(){
				if(this.modelValue){
					this.$nextTick(()=>{
						this.swiperWidth = this.$refs.overlay.$$el.offsetWidth+'px';
						this.swiperHeight = this.$refs.overlay.$$el.offsetHeight+'px';
					})
				}
			},
			//遮罩层显示时
			overlayShowing() {
				if (!this.firstShow) {
					this.firstShow = true;
				}
				this.$nextTick(()=>{
					this.swiperWidth = this.$refs.overlay.$$el.offsetWidth+'px';
					this.swiperHeight = this.$refs.overlay.$$el.offsetHeight+'px';
				})
			},
			//pc端鼠标按下
			mouseDown(event) {
				this.start = event.pageX;
			},
			//pc端鼠标松开
			mouseUp(event) {
				this.end = event.pageX;
			},
			//关闭遮罩
			closeOverlay(e) {
				if (this.start != this.end) {
					return;
				}
				this.scale = 1;
				this.imageRefs.forEach(image=>{
					image.$el.style.transform = '';
				})
				this.$emit('update:modelValue', false);
			},
			//图片变更
			swiperChange(active) {
				this.scale = 1;
				this.imageRefs.forEach(image=>{
					image.$el.style.transform = '';
				})
				this.$emit('change', active);
			},
			//滚轮
			wheelImage(index,event) {
				let deltaY = event.deltaY; //正值向下滚，负值向上滚
				let el = this.imageRefs[index].$el; //图片元素
				if (deltaY > 0) { //向下滚，缩小图片
					if(this.scale > 0.5){
						this.scale -= 0.1;
					}
				} else { //向上滚，放大图片
					if(this.scale < 2){
						this.scale += 0.1;
					}
					
				}
				el.style.transform = `scale(${this.scale})`;
			},
			//双指触摸事件
			prviewTouchStart(index,event){
				if(event.touches.length == 2){
					this.isDoubleTouch = true;
					this.touchDistance = this.getDistance(event.touches[0],event.touches[1]);
				}else {
					this.isDoubleTouch = false;
				}
			},
			//双指移动事件
			previewTouchMove(index,event){
				if(event.touches.length == 2 && this.isDoubleTouch){
					if(event.cancelable){
						event.preventDefault()
					}
					let el = this.imageRefs[index].$el; //图片元素
					let distance = this.getDistance(event.touches[0],event.touches[1])
					if(distance < this.touchDistance){//缩小
						if(this.scale > 0.5){
							this.scale += (distance - this.touchDistance) / el.offsetWidth;
						}
					}else {//放大
						if(this.scale < 2){
							this.scale += (distance - this.touchDistance) / el.offsetWidth;
						}
					}
					el.style.transform = `scale(${this.scale})`;
					this.touchDistance = distance;
				}
			},
			//双指触摸松开事件
			previewTouchend(index,event){
				if(this.isDoubleTouch){
					setTimeout(()=>{
						this.isDoubleTouch = false;
					},300)
				}
			},
			//获取两点间距离
			getDistance(p1, p2){
				let x = p2.pageX - p1.pageX;
				let y = p2.pageY - p1.pageY;
				return Math.sqrt((x * x) + (y * y));
			}
		},
		beforeUnmount() {
			window.removeEventListener('resize',this.resize)
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";

	.mvi-image-preview-swiper {
		background-color: #000;

		.mvi-preview-container{
			overflow: hidden;
		}

		.mvi-image-preview {
			width: 100%;
			height: 100%;
		}
	}

	.mvi-image-preview-page {
		position: absolute;
		display: block;
		color: #fff;
		top: 0;
		left: 0;
		width: 100%;
		padding: @mp-sm 0;
		text-align: center;
		background-color: rgba(0, 0, 0, .6);
		z-index: 20;

		span+span {
			margin-left: @mp-xs;
		}
	}

	.mvi-image-preview-footer {
		display: block;
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .6);
		color: #fff;
		z-index: 20;
	}

	.mvi-image-preview-description {
		padding: @mp-md @mp-sm;
	}
</style>
