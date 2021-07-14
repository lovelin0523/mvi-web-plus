import $util from "../../util/util"
/**
 * 滚动侦听
 */
class Spy {
	constructor(element,options) {
		this.$el = element;
		if(!$util.isObject(options)){
			options = {};
		}
		this.$root = options.el;
		this.beforeEnter = options.beforeEnter;
		this.enter = options.enter;
		this.beforeLeave = options.beforeLeave;
		this.leave = options.leave;
		this.hasInit = false; //是否已经初始化
		//是否触发的标记
		this.triggerTag = {
			before:false,
			after:false
		}
	}
	
	init(){
		if (this.hasInit) {
			return;
		}
		this.hasInit = true;
		
		//初始化参数
		if(typeof this.$root == "string" && this.$root){
			this.$root = document.documentElement.querySelector(this.$root);
		}
		if (!$util.isElement(this.$root)) {
			this.$root = document.body;
		}
		if (typeof this.beforeEnter != "function") {
			this.beforeEnter = function() {};
		}
		if (typeof this.enter != "function") {
			this.enter = function() {};
		}
		if (typeof this.beforeLeave != "function") {
			this.beforeLeave = function() {};
		}
		if (typeof this.leave != "function") {
			this.leave = function() {};
		}
		//给滚动容器添加监听事件
		this._scrollHandler();
		this.$root.on('scroll.spy',e=>{
			this._scrollHandler();
		});
	}
	
	//侦听处理
	_scrollHandler(){
		//获取容器元素是否含有滚动条
		let overflowX = $util.getCssStyle(this.$root,'overflow-x');
		let overflowY = $util.getCssStyle(this.$root,'overflow-y');
		let hasScrollX = (overflowX == 'auto' || overflowX == 'scroll');
		let hasScrollY = (overflowY == 'auto' || overflowY == 'scroll');
		//元素左侧距离滚动容器左侧的可视距离,即不包含自身宽度
		let offsetLeft1 = this.$el.getBoundingClientRect().left - this.$root.getBoundingClientRect().left;
		//元素右侧距离滚动元素左侧的可视距离，即包含自身宽度
		let offsetLeft2 = this.$el.getBoundingClientRect().right - this.$root.getBoundingClientRect().left;
		//元素顶部距离滚动容器顶部的可视距离,即不包含自身高度
		let offsetTop1 = this.$el.getBoundingClientRect().top - this.$root.getBoundingClientRect().top;
		//元素顶部距离滚动元素顶部的可视距离,即包含自身高度
		let offsetTop2 = this.$el.getBoundingClientRect().bottom - this.$root.getBoundingClientRect().top;
		//横向和竖向滚动都存在
		if(hasScrollX && hasScrollY){
			if ((offsetLeft2 >= 0 && offsetLeft1 <= this.$root.offsetWidth) && (offsetTop2 >= 0 && offsetTop1 <= this.$root.offsetHeight)) {
				//元素开始进入
				if (!this.triggerTag.before) {
					this.beforeEnter(this.$el);
					this.triggerTag.before = true;
				}
			} else {
				//元素完全离开
				if (this.triggerTag.before) {
					this.leave(this.$el);
					this.triggerTag.before = false;
				}
			}
			if ((offsetLeft1 >= 0 && offsetLeft2 <= this.$root.offsetWidth) && (offsetTop1 >= 0 && offsetTop2 <= this.$root.offsetHeight)) {
				//元素完全进入
				if (!this.triggerTag.after) {
					this.enter(this.$el);
					this.triggerTag.after = true;
				}
			} else{
				//元素开始离开
				if (this.triggerTag.after) {
					this.beforeLeave(this.$el);
					this.triggerTag.after = false;
				}
			}
		}else if(hasScrollX){
			if (offsetLeft2 >= 0 && offsetLeft1 <= this.$root.offsetWidth) {
				//元素开始进入
				if (!this.triggerTag.before) {
					this.beforeEnter(this.$el);
					this.triggerTag.before = true;
				}
			} else {
				//元素完全离开
				if (this.triggerTag.before) {
					this.leave(this.$el);
					this.triggerTag.before = false;
				}
			}
			if (offsetLeft1 >= 0 && offsetLeft2 <= this.$root.offsetWidth) {
				//元素完全进入
				if (!this.triggerTag.after) {
					this.enter(this.$el);
					this.triggerTag.after = true;
				}
			} else {
				//元素开始离开
				if (this.triggerTag.after) {
					this.beforeLeave(this.$el);
					this.triggerTag.after = false;
				}
			}
		}else if(hasScrollY){	
			if (offsetTop2 >= 0 && offsetTop1 <= this.$root.offsetHeight) {
				//元素开始进入
				if (!this.triggerTag.before) {
					this.beforeEnter(this.$el);
					this.triggerTag.before = true;
				}
			} else {
				//元素完全离开
				if (this.triggerTag.before) {
					this.leave(this.$el);
					this.triggerTag.before = false;
				}
			}
			if (offsetTop1 >= 0 && offsetTop2 <= this.$root.offsetHeight) {
				//元素完全进入
				if (!this.triggerTag.after) {
					this.enter(this.$el);
					this.triggerTag.after = true;
				}
			} else {
				//元素开始离开
				if (this.triggerTag.after) {
					this.beforeLeave(this.$el);
					this.triggerTag.after = false;
				}
			}		
		}
	}
	
	
	//移除滚动容器监听事件
	_setOff(){
		this.$root.off('scroll.spy');
	}
}

export default Spy
