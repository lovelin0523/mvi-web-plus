<template>
	<div class="mvi-pull-refresh" @touchstart="startPull" @touchmove="onPull" @touchend="pulled"
	 @mousedown="startPull2">
		<div v-show="elShow" ref="refresh" class="mvi-pull-refresh-el" :style="elStyle">
			<slot name="el" v-if="$slots.el" :status="status"></slot>
			<m-icon v-if="!$slots.el" :type="icon.type" :spin="icon.spin" :url="icon.url" :size="icon.size" :color="icon.color" />
			<span v-if="!$slots.el" class="mvi-pull-refresh-text" v-text="message"></span>
		</div>
		<slot></slot>
	</div>
</template>

<script>
	import $util from "../../util/util"
	import mIcon from "../icon/icon"
	export default {
		name: "m-pull-refresh",
		data() {
			return {
				elShow: true, //是否显示
				amount: 0, //计数点
				amountMax: 4, //计数点最大值
				startY: 0, //垂直起点
				startY2: 0, //第一次垂直起点
				status: 0, //0表示还没触发下拉，1表示触发下拉了但是还没松手，2表示已经松手正在刷新，3表示刷新完成
				elHeight:0,//刷新元素高度
				transformY: 0, //垂直偏移距离
				canTouch:true,//是否能够执行事件
				hasTouch: false, //是否触摸行为导致下拉刷新
				mouseDown: false, //是否按下鼠标了
				isTop:false,//开始下拉时滚动条是否在顶部
				isScroll:false,//是否滚动了
			}
		},
		emits:['update:modelValue','refresh'],
		props: {
			pullingText: { //下拉文案
				type: String,
				default: '下拉刷新'
			},
			loosingText: {
				type: String,
				default: '释放刷新'
			},
			loadingText: { //刷新时显示的文本
				type: String,
				default: '正在刷新'
			},
			modelValue: { //是否刷新
				type: Boolean,
				default: false
			},
			pullingIcon: {
				type: [String, Object],
				default: null
			},
			loosingIcon: {
				type: [String, Object],
				default: null
			},
			loadingIcon: {
				type: [String, Object],
				default: null
			},
			disabled: {
				type: Boolean,
				default: false
			},
			color: {
				type: String,
				default: null
			},
			pullingColor: {
				type: String,
				default: null
			},
			loosingColor: {
				type: String,
				default: null
			},
			loadingColor: {
				type: String,
				default: null
			},
			zIndex: {
				type: Number,
				default: 4000
			},
			distance: { //下拉触发刷新的距离值
				type: Number,
				default: 1
			}
		},
		computed: {
			elStyle() {
				let style = {};
				style.transform = 'translateY(' + this.transformY + 'px)';
				if (this.color) {
					style.color = this.color;
				}
				if (this.pullingColor && this.status == 0) {
					style.color = this.pullingColor;
				} else if (this.loosingColor && this.status == 1) {
					style.color = this.loosingColor;
				} else if (this.loadingColor && this.status == 2) {
					style.color = this.loadingColor;
				}
				if (this.zIndex) {
					style.zIndex = this.zIndex;
				}
				return style;
			},
			icon() {
				if (this.status == 0) {
					return {
						type: this.pullingIconType,
						spin: this.pullingIconSpin,
						url: this.pullingIconUrl,
						size:this.pullingIconSize,
						color:this.pullingIconColor
					}
				} else if (this.status == 1) {
					return {
						type: this.loosingIconType,
						spin: this.loosingIconSpin,
						url: this.loosingIconUrl,
						size:this.loosingIconSize,
						color:this.loosingIconColor
					}
				} else if (this.status == 2) {
					return {
						type: this.loadingIconType,
						spin: this.loadingIconSpin,
						url: this.loadingIconUrl,
						size:this.loadingIconSize,
						color:this.loadingIconColor
					}
				}
			},
			message() {
				if (this.status == 0) {
					return this.pullingText;
				} else if (this.status == 1) {
					return this.loosingText;
				} else if (this.status == 2) {
					return this.loadingText;
				}
			},
			pullingIconType() {
				let t = 'arrow-down';
				if ($util.isObject(this.pullingIcon)) {
					if (typeof this.pullingIcon.type == "string") {
						t = this.pullingIcon.type;
					}
				} else if (typeof this.pullingIcon == "string") {
					t = this.pullingIcon;
				}
				return t;
			},
			pullingIconUrl() {
				let url = null;
				if ($util.isObject(this.pullingIcon)) {
					if (typeof this.pullingIcon.url == "string") {
						url = this.pullingIcon.url;
					}
				}
				return url;
			},
			pullingIconSpin() {
				let spin = false;
				if ($util.isObject(this.pullingIcon)) {
					if (typeof this.pullingIcon.spin == "boolean") {
						spin = this.pullingIcon.spin;
					}
				}
				return spin;
			},
			pullingIconSize(){
				let size = null;
				if ($util.isObject(this.pullingIcon)) {
					if (typeof this.pullingIcon.size == "string") {
						size = this.pullingIcon.size;
					}
				}
				return size;
			},
			pullingIconColor(){
				let color = null;
				if ($util.isObject(this.pullingIcon)) {
					if (typeof this.pullingIcon.color == "string") {
						color = this.pullingIcon.color;
					}
				}
				return color;
			},
			loosingIconType() {
				let t = 'arrow-up';
				if ($util.isObject(this.loosingIcon)) {
					if (typeof this.loosingIcon.type == "string") {
						t = this.loosingIcon.type;
					}
				} else if (typeof this.loosingIcon == "string") {
					t = this.loosingIcon;
				}
				return t;
			},
			loosingIconUrl() {
				let url = null;
				if ($util.isObject(this.loosingIcon)) {
					if (typeof this.loosingIcon.url == "string") {
						url = this.loosingIcon.url;
					}
				}
				return url;
			},
			loosingIconSpin() {
				let spin = false;
				if ($util.isObject(this.loosingIcon)) {
					if (typeof this.loosingIcon.spin == "boolean") {
						spin = this.loosingIcon.spin;
					}
				}
				return spin;
			},
			loosingIconSize(){
				let size = null;
				if ($util.isObject(this.loosingIcon)) {
					if (typeof this.loosingIcon.size == "string") {
						size = this.loosingIcon.size;
					}
				}
				return size;
			},
			loosingIconColor(){
				let color = null;
				if ($util.isObject(this.loosingIcon)) {
					if (typeof this.loosingIcon.color == "string") {
						color = this.loosingIcon.color;
					}
				}
				return color;
			},
			loadingIconType() {
				let t = 'load-e';
				if ($util.isObject(this.loadingIcon)) {
					if (typeof this.loadingIcon.type == "string") {
						t = this.loadingIcon.type;
					}
				} else if (typeof this.loadingIcon == "string") {
					t = this.loadingIcon;
				}
				return t;
			},
			loadingIconUrl() {
				let url = null;
				if ($util.isObject(this.loadingIcon)) {
					if (typeof this.loadingIcon.url == "string") {
						url = this.loadingIcon.url;
					}
				}
				return url;
			},
			loadingIconSpin() {
				let spin = true;
				if ($util.isObject(this.loadingIcon)) {
					if (typeof this.loadingIcon.spin == "boolean") {
						spin = this.loadingIcon.spin;
					}
				}
				return spin;
			},
			loadingIconSize(){
				let size = null;
				if ($util.isObject(this.loadingIcon)) {
					if (typeof this.loadingIcon.size == "string") {
						size = this.loadingIcon.size;
					}
				}
				return size;
			},
			loadingIconColor(){
				let color = null;
				if ($util.isObject(this.loadingIcon)) {
					if (typeof this.loadingIcon.color == "string") {
						color = this.loadingIcon.color;
					}
				}
				return color;
			}
		},
		components:{
			mIcon
		},
		mounted() {
			this.statusInit();
			document.body.on('mousemove.pullRefresh', this.onPull2);
			document.body.on('mouseup.pullRefresh', this.pulled2);
		},
		watch: {
			modelValue(newValue) {
				this.changeStatus();
			}
		},
		methods: {
			//初始化
			statusInit() {
				this.elHeight = this.$refs.refresh.offsetHeight;
				this.transformY = -this.elHeight;
				this.elShow = false;
			},
			//开始下拉(移动端)
			startPull(event) {
				if(this.disabled){
					return;
				}
				if(!this.canTouch){
					return;
				}
				if($util.getScrollTop(this.$el) != 0){
					this.isTop = false;
					return;
				}
				let el = this.getScrollEl(event.target);
				if(el != this.$el && $util.getScrollTop(el) != 0){
					this.isTop = false;
					return;
				}
				this.isTop = true;
				this.startY = event.touches[0].pageY; //元素按下时的位置
				this.startY2 = this.startY; //元素按下的位置，此数值不会变更
			},
			//开始下拉(PC端)
			startPull2(event) {
				if(this.disabled){
					return;
				}
				if(!this.canTouch){
					return;
				}
				if($util.getScrollTop(this.$el) != 0){
					this.isTop = false;
					return;
				}
				let el = this.getScrollEl(event.target);
				if(el != this.$el && $util.getScrollTop(el) != 0){
					this.isTop = false;
					return;
				}
				this.isTop = true;
				this.mouseDown = true;
				this.startY = event.pageY; //元素按下时的位置
				this.startY2 = this.startY; //元素按下的位置，此数值不会变更
			},
			//下拉过程(移动端)
			onPull(event) {
				if (this.disabled) {
					return;
				}
				if(!this.canTouch){
					event.preventDefault();
					return;
				}
				if(!this.isTop){
					return;
				}
				if($util.getScrollTop(this.$el) != 0){
					if(this.transformY>-this.elHeight){
						this.transformY = -this.elHeight;
					}
					this.isScroll = true;
					return;
				}
				let el = this.getScrollEl(event.target);
				if(el != this.$el && $util.getScrollTop(el) != 0){
					if(this.transformY>-this.elHeight){
						this.transformY = -this.elHeight;
					}
					this.isScroll = true;
					return;
				}
				if(this.isScroll){
					return;
				}
				let endY = event.touches[0].pageY;
				let move = endY - this.startY; //每一次移动的偏移量
				let move2 = endY - this.startY2; //距离第一次触摸时的偏移量
				this.startY = endY;
				//总偏移量小于0为手指向上滑动，元素向下滚动，不执行刷新
				if (move2 <= 0) {
					this.startY2 = this.startY;
					return;
				}
				this.hasTouch = true;
				if (event.cancelable) {
					event.preventDefault();
				}

				this.elShow = true;
				
				//当计数小于最大计数量时，每次移动计数+1
				if (this.amount < this.amountMax) {
					this.amount++;
				}
				//元素移动距离
				let y = this.transformY + move / this.amount;

				//如果移动距离大于distance指定的距离，则变为可释放状态
				if (y > $util.rem2px(this.distance)) {
					this.status = 1;
				} else {
					this.status = 0;
				}
				//改变元素位置
				this.transformY = y;
			},
			//下拉过程(PC端)
			onPull2(event) {
				if (this.disabled) {
					return;
				}
				if(!this.canTouch){
					event.preventDefault();
					return;
				}
				if (!this.mouseDown) {
					return;
				}
				if(!this.isTop){
					return;
				}
				if($util.getScrollTop(this.$el) != 0){
					if(this.transformY>-this.elHeight){
						this.transformY = -this.elHeight;
					}
					this.isScroll = true;
					return;
				}
				let el = this.getScrollEl(event.target);
				if(el != this.$el && $util.getScrollTop(el) != 0){
					if(this.transformY>-this.elHeight){
						this.transformY = -this.elHeight;
					}
					this.isScroll = true;
					return;
				}
				if(this.isScroll){
					return;
				}
				let endY = event.pageY;
				let move = endY - this.startY; //每一次移动的偏移量
				let move2 = endY - this.startY2; //距离第一次触摸时的偏移量
				this.startY = endY;

				//总偏移量小于0为手指向上滑动，元素向下滚动，不执行刷新
				if (move2 <= 0) {
					this.startY2 = this.startY;
					return;
				}
				this.hasTouch = true;
				if (event.cancelable) {
					event.preventDefault();
				}

				this.elShow = true;
				
				//当计数小于最大计数量时，每次移动计数+1
				if (this.amount < this.amountMax) {
					this.amount++;
				}
				//元素移动距离
				let y = this.transformY + move / this.amount;

				//如果移动距离大于distance指定的距离，则变为可释放状态
				if (y > $util.rem2px(this.distance)) {
					this.status = 1;
				} else {
					this.status = 0;
				}
				//改变元素位置
				this.transformY = y;
			},
			//下拉结束释放(移动端)
			pulled(event) {
				if (this.disabled) {
					return;
				}
				if(!this.canTouch){
					return;
				}
				if(this.isScroll){
					this.isScroll = false;
					return;
				}
				if(!this.hasTouch){
					return;
				}
				//当下拉结束时，判断状态是否为释放可加载状态，如果是，则更改modelValue值，变为加载状态
				if (this.status == 1 && this.modelValue == false) {
					this.$emit('update:modelValue', true);
				} else if (this.status != 1 && this.modelValue == true) {
					this.$emit('update:modelValue', false);
				} else {
					this.changeStatus();
				}
			},
			//下拉结束释放(PC端)
			pulled2(event) {
				if (this.disabled) {
					return;
				}
				if(!this.canTouch){
					return;
				}
				if(this.isScroll){
					this.isScroll = false;
					return;
				}
				if (!this.mouseDown) {
					return;
				}
				this.mouseDown = false;
				
				if(!this.hasTouch){
					return;
				}
				
				//当下拉结束时，判断状态是否为释放可加载状态，如果是，则更改modelValue值，变为加载状态
				if (this.status == 1 && this.modelValue == false) {
					this.$emit('update:modelValue', true);
				} else if (this.status != 1 && this.modelValue == true) {
					this.$emit('update:modelValue', false);
				} else {
					this.changeStatus();
				}
			},
			//根据modelValue的值改变状态
			changeStatus() {
				if (this.disabled) {
					return;
				}
				if (this.modelValue) { //modelValue值为true时状态变为加载状态
					this.status = 2;
					this.canTouch = false;
					this.$emit('refresh');
					if (!this.hasTouch) { //非触摸下拉的
						this.elShow = true;
						this.$refs.refresh.style.transition = 'all 300ms';
						this.$refs.refresh.style.webkitTransition = 'all 300ms';
						this.$nextTick(() => {
							setTimeout(() => {
								this.transformY = $util.rem2px(this.distance);
								setTimeout(() => {
									this.$refs.refresh.style.transition = '';
									this.$refs.refresh.style.webkitTransition = '';
								}, 300)
							}, 10);
						})
					}
				} else { //modelValue值为false时状态变为下拉前状态，数据恢复初始化
					this.amount = 0;
					this.hasTouch = false;
					this.$refs.refresh.style.transition = 'all 300ms';
					this.$refs.refresh.style.webkitTransition = 'all 300ms';
					setTimeout(() => {
						this.transformY = -this.elHeight;
						setTimeout(() => {
							this.$refs.refresh.style.transition = '';
							this.$refs.refresh.style.webkitTransition = '';
							this.status = 0;
							this.elShow = false;
							this.canTouch = true;
						}, 300)
					}, 10);
				}
			},
			//获取触摸元素最近的滚动容器
			getScrollEl(el){
				if(el === this.$el){
					return this.$el;
				}
				if($util.getScrollHeight(el) > el.clientHeight){
					return el;
				}
				return this.getScrollEl(el.parentNode);
			}
		},
		beforeUnmount() {
			document.body.off('mousemove.pullRefresh mouseup.pullRefresh');
		}
	}
</script>

<style lang="less" scoped>
	@import "../../css/mvi-basic.less";

	.mvi-pull-refresh {
		display: block;
		width: 100%;
		height: 100vh;
		position: relative;
		overflow: auto;
		overflow-x: hidden;
	}

	.mvi-pull-refresh-el {
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		color: @font-color-sub;
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
	}

	.mvi-pull-refresh-text {
		margin-left: @mp-xs;
	}
</style>
