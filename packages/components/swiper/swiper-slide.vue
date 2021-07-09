<template>
	<transition v-if="swiper.fade" name="mvi-swiper-slide" @before-enter="addTransition" @after-enter="removeTransition" 
	@before-leave="addTransition" @after-leave="removeTransition">
		<div v-show="swiper.fadeActiveIndex == slideIndex" class="mvi-swiper-slide-fade" :style="slideStyle">
			<slot></slot>
		</div>
	</transition>
	<div v-else class="mvi-swiper-slide" :style="slideStyle">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name:"m-swiper-slide",
		created() {
			this.swiper.children.push(this);
		},
		inject:['swiper'],
		computed:{
			slideStyle(){
				let style = {};
				if(this.swiper.vertical){
					style.width = '100%';
				}else{//横向
					style.height = '100%';
				}
				if(this.swiper.width && (this.swiper.width.includes('rem') || this.swiper.width.includes('px'))){
					style.width = this.swiper.width;
				}
				
				if(this.swiper.height && (this.swiper.height.includes('rem') || this.swiper.height.includes('px'))){
					style.height = this.swiper.height;
				}
				return style;
			},
			//slide在swiper中的序列值
			slideIndex() {
				let index = 0;
				for (let i = 0; i < this.swiper.children.length; i++) {
					if (this.swiper.children[i] == this) {
						index = i;
						break;
					}
				}
				return index;
			},
		},
		methods:{
			addTransition(el){
				if(this.swiper.useOpacity){
					el.style.transition = 'opacity '+this.swiper.speed + 'ms';
					el.style.webkitTransition = 'opacity '+this.swiper.speed + 'ms';
				}else {
					el.style.transition = '';
					el.style.webkitTransition = '';
				}
			},
			removeTransition(el){
				if(this.swiper.useOpacity){
					el.style.transition = '';
					el.style.webkitTransition = '';
				}else{
					this.swiper.useOpacity = true;
				}
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../../css/mvi-basic.less";
	
	.mvi-swiper-slide{
		display: block;
		flex: 1;
	}
	
	.mvi-swiper-slide-fade{
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
	}
	
	.mvi-swiper-slide-enter-from,.mvi-swiper-slide-leave-to{
		opacity: 0;
	}
</style>
