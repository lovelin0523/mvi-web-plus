import $util from "../../util/util"
/**
 * 滚动侦听
 */
class Spy {
	constructor(element,options) {
		this.$target = element;
		if(!$util.isObject(options)){
			options = {};
		}
		this.$el = options.el;
		this.beforeEnter = options.beforeEnter;
		this.enter = options.enter;
		this.beforeLeave = options.beforeLeave;
		this.leave = options.leave;
		this.hasInit = false; //是否已经初始化
	}
	
	init(){
		if (this.hasInit) {
			return;
		}
		this.hasInit = true;
		//根据el的值查找元素
		if(typeof this.$el == "string" && this.$el){
			this.$el = document.body.querySelector(this.$el);
		}
		if (!$util.isElement(this.$el)) {
			this.$el = window;
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
		
		this._set();
		this.$el.addEventListener('scroll',()=>{
			this._set();
		})
	}
	
	_set(){
		if (this.$el == window) {
			let clientTop1 = this.$target.getBoundingClientRect().top; //元素距离可视区域顶部的距离，不包含自身高度
			let clientTop2 = this.$target.getBoundingClientRect().bottom; //元素距离可视区域顶部的距离，包含自身高度
			if (clientTop2 > 0 && clientTop1 < window.innerHeight) {
				if (!this.$target.data("mvi-scroll-flag1")) {
					this.beforeEnter(this.$target);
					this.$target.data("mvi-scroll-flag1", true);
				}
			} else {
				if (this.$target.data("mvi-scroll-flag1")) {
					this.leave(this.$target);
					this.$target.data("mvi-scroll-flag1", null);
				}
			}
		
			if (clientTop1 > 0 && clientTop2 < window.innerHeight) {
				if (!this.$target.data("mvi-scroll-flag2")) {
					this.enter(this.$target);
					this.$target.data("mvi-scroll-flag2", true);
				}
			} else {
				if (this.$target.data("mvi-scroll-flag2")) {
					this.beforeLeave(this.$target);
					this.$target.data("mvi-scroll-flag2", null);
				}
			}
		} else {
			//元素距离滚动元素的可视距离,不包含自身高度
			let offsetTop1 = this.$target.getBoundingClientRect().top - this.$el.getBoundingClientRect().top;
			//元素距离滚动元素的可视距离,包含自身高度
			let offsetTop2 = this.$target.getBoundingClientRect().bottom - this.$el.getBoundingClientRect().top;
			if (offsetTop2 > 0 && offsetTop1 < this.$el.offsetHeight) {
				if (!this.$target.data("mvi-scroll-flag1")) {
					this.beforeEnter(this.$target);
					this.$target.data("mvi-scroll-flag1", true);
				}
			} else {
				if (this.$target.data("mvi-scroll-flag1")) {
					this.leave(this.$target);
					this.$target.data("mvi-scroll-flag1", null);
				}
			}
			if (offsetTop1 > 0 && offsetTop2 < this.$el.offsetHeight) {
				if (!this.$target.data("mvi-scroll-flag2")) {
					this.enter(this.$target);
					this.$target.data("mvi-scroll-flag2", true);
				}
			} else {
				if (this.$target.data("mvi-scroll-flag2")) {
					this.beforeLeave(this.$target);
					this.$target.data("mvi-scroll-flag2", null);
				}
			}
		}
	}
	
}

export default Spy
