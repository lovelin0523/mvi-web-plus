<template>
	<m-overlay ref="overlay" :model-value="modelValue" color="#000" :fade="false" @showing="overlayShowing"
		:z-index="zIndex" :use-padding="usePadding" :mountEl="mountEl">
		<m-swiper v-if="firstShow" class="mvi-image-preview-swiper" :initial-slide="active" show-indicators ref="swiper"
			@change="swiperChange" @mousedown="mouseDown" @mouseup="mouseUp" :show-control="showControl" :fade="fade"
			:touchable="!isDoubleTouch" :control-class="controlClass">
			<m-swiper-slide v-for="(item,index) in images" @wheel="wheelImage(index,$event)"
				@touchstart="prviewTouchStart(index,$event)" @touchmove="previewTouchMove(index,$event)"
				@touchend="previewTouchend(index,$event)" :id="'mvi-preview-slide-'+index"
				class="mvi-preview-container">
				<m-image :error-icon="errorIcon" :load-icon="loadIcon" @click="closeOverlay" class="mvi-image-preview"
					:src="item" fit="response" :ref="el=>imageRefs[index]=el"></m-image>
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
					<slot name="descriptions" :total="data.total" :current="data.active" v-if="$slots.descriptions">
					</slot>
					<div v-else-if="descriptions.length>0" class="mvi-image-preview-description"
						v-text="descriptions[data.active]"></div>
				</div>
			</template>
		</m-swiper>

	</m-overlay>
</template>

<script>
	import {
		getCurrentInstance
	} from "vue"
	import $dap from "dap-util"
	import mOverlay from "../overlay/overlay"
	import mSwiper from "../swiper/swiper.vue"
	import mSwiperSlide from "../swiper/swiper-slide"
	import mImage from "../image/image"
	export default {
		name: "m-image-preview",
		data() {
			return {
				firstShow: false,
				start: 0,
				end: 0,
				//是否双指触摸
				isDoubleTouch: false,
				//双指触点距离
				touchDistance: 0,
				//缩放比例
				scale: 1,
				//image组件对象数组
				imageRefs: []
			}
		},
		emits: ['update:modelValue', 'change'],
		props: {
			//是否显示
			modelValue: {
				type: Boolean,
				default: false
			},
			//图片数组
			images: {
				type: Array,
				default: function() {
					return []
				}
			},
			//图片描述
			descriptions: { 
				type: Array,
				default: function() {
					return []
				}
			},
			//默认显示的图片序列
			active: { 
				type: Number,
				default: 0
			},
			//挂载元素
			mountEl: { 
				type: String,
				default: null
			},
			//是否显示页码
			showPage: { 
				type: Boolean,
				default: true
			},
			//z-index值
			zIndex: { 
				type: Number,
				default: 5000
			},
			//是否使用渐变
			fade: { 
				type: Boolean,
				default: false
			},
			//是否显示控制器
			showControl: { 
				type: Boolean,
				default: false
			},
			//控制器额外样式
			controlClass: { 
				type: String,
				default: null
			},
			//局部显示是否考虑滚动条影响
			usePadding: { 
				type: Boolean,
				default: false
			},
			//图片加载失败提示设置
			errorIcon: { 
				type: [String, Object],
				default: function() {
					return {
						size: '1rem'
					}
				}
			},
			//图片加载中提示设置
			loadIcon: { 
				type: [String, Object],
				default: function() {
					return {
						size: '1rem'
					}
				}
			}
		},
		components: {
			mOverlay,
			mSwiper,
			mSwiperSlide,
			mImage
		},
		setup() {
			const instance = getCurrentInstance()
			return {
				uid: instance.uid
			}
		},
		methods: {
			//遮罩层显示时
			overlayShowing() {
				if (!this.firstShow) {
					this.firstShow = true
				}
			},
			//pc端鼠标按下
			mouseDown(event) {
				this.start = event.pageX
			},
			//pc端鼠标松开
			mouseUp(event) {
				this.end = event.pageX
			},
			//关闭遮罩
			closeOverlay(e) {
				if (this.start != this.end) {
					return
				}
				this.scale = 1
				this.imageRefs.forEach(image => {
					image.$el.style.transform = ''
				})
				this.$emit('update:modelValue', false)
			},
			//图片变更
			swiperChange(active) {
				this.scale = 1
				this.imageRefs.forEach(image => {
					image.$el.style.transform = ''
				})
				this.$emit('change', active)
			},
			//滚轮
			wheelImage(index, event) {
				//正值向下滚，负值向上滚
				let deltaY = event.deltaY
				//图片元素
				let el = this.imageRefs[index].$el
				//向下滚，缩小图片
				if (deltaY > 0) { 
					if (this.scale > 0.5) {
						this.scale -= 0.1
					}
				} 
				//向上滚，放大图片
				else { 
					if (this.scale < 2) {
						this.scale += 0.1
					}
				}
				el.style.transform = `scale(${this.scale})`
			},
			//双指触摸事件
			prviewTouchStart(index, event) {
				if (event.touches.length == 2) {
					this.isDoubleTouch = true
					this.touchDistance = this.getDistance(event.touches[0], event.touches[1])
				} else {
					this.isDoubleTouch = false
				}
			},
			//双指移动事件
			previewTouchMove(index, event) {
				if (event.touches.length == 2 && this.isDoubleTouch) {
					if (event.cancelable) {
						event.preventDefault()
					}
					//图片元素
					let el = this.$refs.images[index].$el
					let distance = this.getDistance(event.touches[0], event.touches[1])
					//缩小
					if (distance < this.touchDistance) {
						if (this.scale > 0.5) {
							this.scale = $dap.number.add(this.scale, $dap.number.divide($dap.number.subtract(distance, this
								.touchDistance), el.offsetWidth))
						}
					}
					//放大
					else {
						if (this.scale < 2) {
							this.scale = $dap.number.add(this.scale, $dap.number.divide($dap.number.subtract(distance, this
								.touchDistance), el.offsetWidth))
						}
					}
					el.style.transform = `scale(${this.scale})`
					this.touchDistance = distance
				}
			},
			//双指触摸松开事件
			previewTouchend(index, event) {
				if (this.isDoubleTouch) {
					setTimeout(() => {
						this.isDoubleTouch = false
					}, 300)
				}
			},
			//获取两点间距离
			getDistance(p1, p2) {
				let x = p2.pageX - p1.pageX
				let y = p2.pageY - p1.pageY
				return Math.sqrt((x * x) + (y * y))
			}
		},
		beforeUnmount() {
			$dap.event.off(window, `resize.imagePreview_${this.uid}`)
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";

	.mvi-image-preview-swiper {
		background-color: #000;

		.mvi-preview-container {
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
