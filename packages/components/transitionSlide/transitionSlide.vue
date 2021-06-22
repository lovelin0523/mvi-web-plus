<template>
	<transition name="mvi-transition-slide" @before-enter="beforeEnter" @after-enter="afterEnter" @before-leave="beforeLeave"
	@after-leave="afterLeave">
		<div class="mvi-transition-slide" v-show="show"><slot></slot></div>
	</transition>
</template>

<script>
import $util from '../../util/util';
export default {
	name: 'm-transition-slide',
	data() {
		return {
			show:true,
			height:null,
			useAnimation:false
		};
	},
	emits:['before-slide-down','slide-down','before-slide-up','slide-up'],
	props: {
		expand: {
			type: Boolean,
			default: true
		},
		timeout: {
			type: Number,
			default: 400
		}
	},
	watch:{
		expand(newValue){
			this.show = newValue;
		}
	},
	mounted() {
		//show取值于expand
		this.show = this.expand;
		//启用动画
		this.$nextTick(()=>{
			this.useAnimation = true;
		})
	},
	methods: {
		beforeEnter(el){
			//设置高度为0
			el.style.height = 0;
			//设置动画
			if(this.useAnimation){
				el.style.transition = 'height ' + this.timeout + 'ms linear';
				el.style.webkitTransition = 'height ' + this.timeout + 'ms linear';
			}
			this.$emit('before-slide-down')
			//执行动画
			setTimeout(()=>{
				el.style.height = this.height;
			},10)
		},
		afterEnter(el){
			//移除动画
			if(this.useAnimation){
				el.style.transition = '';
				el.style.webkitTransition = '';
			}
			//动画结束后恢复高度
			el.style.height = this.height;
			this.$emit('slide-down')
		},
		beforeLeave(el){
			//只记录第一次的高度
			if(!this.height){
				this.height = $util.getCssStyle(el,'height');
			}
			//设置元素高度
			el.style.height = this.height;
			//设置动画
			if(this.useAnimation){
				el.style.transition = 'height ' + this.timeout + 'ms linear';
				el.style.webkitTransition = 'height ' + this.timeout + 'ms linear';
			}
			this.$emit('before-slide-up')
			//执行动画
			setTimeout(()=>{
				el.style.height = 0;
			},10)
		},
		afterLeave(el){
			//移除动画
			if(this.useAnimation){
				el.style.transition = '';
				el.style.webkitTransition = '';
			}
			//动画结束后恢复高度
			el.style.height = this.height;
			this.$emit('slide-up')
		}
	}
}
</script>

<style scoped lang="less">
	.mvi-transition-slide{
		display: block;
		width: 100%;
		overflow: hidden;
		padding: 0;
		margin: 0;
		border: none;
		background: none;
	}
</style>
