<template>
	<teleport to="body">
		<div class="mvi-loading-bar" ref="bar" :style="barStyle"></div>
	</teleport>
</template>

<script>
	import $util from "../../util/util"
	export default {
		name:"m-loading-bar",
		data(){
			return {
				opacityTime:300,//透明度变化时间
				widthEnterTime:4000,//进场时宽度变化时间
				widthLeaveTime:2000//离开时宽度变化时间
			}
		},
		props:{
			color:{
				type:String,
				default:null
			},
			zIndex:{
				type:Number,
				default:null
			},
			remove:{
				type:Function,
				default:function(){
					return function(){}
				}
			},
			init:{
				type:Function,
				default:function(){
					return function(){}
				}
			}
		},
		computed:{
			computedColor(){
				if(typeof this.color == 'string' && this.color){
					return this.color;
				}else{
					return null;
				}
			},
			computedZIndex(){
				if($util.isNumber(this.zIndex)){
					return this.zIndex;
				}else{
					return null;
				}
			},
			barStyle(){
				let style = {};
				if(this.computedColor){
					style.background = this.computedColor;
				}
				if(this.computedZIndex){
					style.zIndex = this.computedZIndex;
				}
				return style;
			}
		},
		mounted() {
			this.init(this);
			this.enter();
		},
		methods:{
			//进入
			enter(){
				this.removeTransition().then(()=>{
					this.$refs.bar.style.width = 0;
						setTimeout(()=>{
							this.addTransition('enter').then(()=>{
								this.$refs.bar.style.width = window.innerWidth * 0.9 + 'px';
								this.$refs.bar.style.opacity = 1;
							})
						},10)
				})
			},
			leave(){
				this.addTransition('leave').then(()=>{
					this.$refs.bar.style.width = window.innerWidth + 'px';
					this.$refs.bar.style.opacity = 0;
					setTimeout(()=>{
						//执行移除方法
						this.remove();
					},this.widthLeaveTime + this.opacityTime)
				})
			},
			//添加动画
			addTransition(type){
				return new Promise((resolve,reject)=>{
					//进入动画
					if(type == 'enter'){
						this.$refs.bar.style.transition = `opacity ${this.opacityTime}ms linear, width ${this.widthEnterTime}ms ease-out`;
						this.$refs.bar.style.webkitTransition = `opacity ${this.opacityTime}ms linear, width ${this.widthEnterTime}ms ease-out`;
					}else if(type == 'leave'){
						this.$refs.bar.style.transition = `opacity ${this.opacityTime}ms ${this.widthLeaveTime}ms linear, width ${this.widthLeaveTime}ms ease`;
						this.$refs.bar.style.webkitTransition = `opacity ${this.opacityTime}ms ${this.widthLeaveTime}ms linear, width ${this.widthLeaveTime}ms ease`;
					}
					setTimeout(()=>{
						resolve();
					},10)
				})
			},
			//移除动画
			removeTransition(){
				return new Promise((resolve,reject)=>{
					this.$refs.bar.style.transition = '';
					this.$refs.bar.style.webkitTransition = '';
					setTimeout(()=>{
						resolve();
					},10)
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";
	
	.mvi-loading-bar{
		position: fixed;
		left: 0;
		top: 0;
		width:0;
		opacity: 0;
		height: 0.04rem;
		background-color:@success-normal;
		z-index: 3000;
	}
</style>
