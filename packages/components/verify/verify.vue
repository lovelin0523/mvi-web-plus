<template>
	<div class="mvi-verify" @click="doRefresh">
		<canvas ref="canvas"></canvas>
	</div>
</template>

<script>
	import $util from "../../util/util"
	export default {
		name: "m-verify",
		data() {
			return {
				values: [],
			}
		},
		emits:['refresh','change'],
		props: {
			//是否自传值
			custom:{
				type:Boolean,
				default:false
			},
			//验证码的值
			value:{
				type:String,
				default:''
			},
			//验证码个数
			number: {
				type: Number,
				default: 4
			},
			//验证码取值数组
			codes: {
				type: Array,
				default: function() {
					return ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
						"V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q",
						"r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
					]
				}
			},
			//验证码字体大小
			fontSize: { 
				type: Number,
				default: 0.5
			},
			//验证码每个字符之间的间距，单位rem
			space: { 
				type: Number,
				default: 0.5
			},
			//验证码在水平方向上距离中间区域的向左偏移值，单位rem
			offset: { 
				type: Number,
				default: 1
			},
			//线条数目
			lineCounts: { 
				type: Number,
				default: 10
			},
			//点击验证码是否刷新
			clickRefresh:{
				type:Boolean,
				default:true
			}
		},
		mounted() {
			this.draw();
		},
		watch:{
			value(newValue){
				this.draw()
			},
			fontSize(newValue){
				this.draw()
			},
			number(newValue){
				this.draw()
			},
			space(newValue){
				this.draw()
			},
			offset(newValue){
				this.draw()
			},
			lineCounts(newValue){
				this.draw()
			},
			codes(newValue){
				this.draw()
			}
		},
		methods: {
			//点击刷新验证码
			doRefresh(){
				if(this.clickRefresh){
					//如果是自传值
					if(this.custom){
						this.$emit('refresh');
					}else {
						this.draw();
					}
				}
			},
			//绘制方法
			draw() {
				let context = this.$refs.canvas.getContext("2d"); //获取到canvas画图的环境
				let canvas_width = this.$el.offsetWidth;
				let canvas_height = this.$el.offsetHeight;
				this.$refs.canvas.width = canvas_width;
				this.$refs.canvas.height = canvas_height;
				//清除画布
				context.clearRect(0,0,canvas_width,canvas_height);
				//画验证码
				let length = this.codes.length; //获取到数组的长度
				if(this.custom){
					for (let i = 0; i < this.value.length; i++) {
						let deg = Math.random() * 30 * Math.PI / 180; //产生0~30之间的随机弧度
						this.values[i] = this.value[i].toLowerCase();
						let x = canvas_width / 2 - $util.rem2px(this.offset) + i * $util.rem2px(this.space); //文字在canvas上的x坐标
						let y = canvas_height / 2 + Math.random() * $util.rem2px(0.2); //文字在canvas上的y坐标
						context.font = "bold " + $util.rem2px(this.fontSize) + "px Consolas";
						context.translate(x, y);
						context.rotate(deg);
						context.fillStyle = this.getColors();
						context.fillText(this.value[i], 0, 0);
						context.rotate(-deg);
						context.translate(-x, -y);
					}
				}else {
					for (let i = 0; i < this.number; i++) {
						let j = Math.floor(Math.random() * length); //获取到随机的索引值
						let deg = Math.random() * 30 * Math.PI / 180; //产生0~30之间的随机弧度
						let txt = this.codes[j]; //得到随机的一个内容
						this.values[i] = txt.toLowerCase();
						let x = canvas_width / 2 - $util.rem2px(this.offset) + i * $util.rem2px(this.space); //文字在canvas上的x坐标
						let y = canvas_height / 2 + Math.random() * $util.rem2px(0.2); //文字在canvas上的y坐标
						context.font = "bold " + $util.rem2px(this.fontSize) + "px Consolas";
						context.translate(x, y);
						context.rotate(deg);
						context.fillStyle = this.getColors();
						context.fillText(txt, 0, 0);
						context.rotate(-deg);
						context.translate(-x, -y);
					}
				}
				//验证码上显示线条
				for (let i = 0; i < this.lineCounts; i++) { 
					context.strokeStyle = this.getColors();
					context.beginPath();
					context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
					context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
					context.stroke();
				}
				//触发事件
				this.$emit('change', this.values.join(''));
			},
			//获取随机颜色
			getColors() {
				let r = Math.floor(Math.random() * 256);
				let g = Math.floor(Math.random() * 256);
				let b = Math.floor(Math.random() * 256);
				return "rgb(" + r + "," + g + "," + b + ")";
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";
	
	.mvi-verify {
		display: block;
		width: 100%;
		position: relative;
		padding: 0;
		margin: 0;
		overflow: hidden;
		cursor: pointer;
	}

	.mvi-verify>canvas {
		display: block;
		width: 100%;
	}
</style>
