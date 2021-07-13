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
		this.beforeEnter = options.beforeEnter;
		this.enter = options.enter;
		this.beforeLeave = options.beforeLeave;
		this.leave = options.leave;
		this.hasInit = false; //是否已经初始化
		this.rootQueue = []; //滚动元素队列容器
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
		
		//初始化容器队列
		this._initRootQueue(this.$el)
		this._scrollHandler = this._scrollHandler.bind(this);
		//给容器队列添加监听事件
		this._initRootListens();
	}
	
	//容器队列的滚动元素添加滚动监听事件
	_initRootListens(){
		this.rootQueue.forEach(root=>{
			this._scrollHandler(root);
			root.addEventListener('scroll',this._scrollHandler);
		})
	}
	
	//容器队列的滚动元素移除滚动监听事件
	_removeRootListens(){
		this.rootQueue.forEach(root=>{
			root.removeEventListener('scroll',this._scrollHandler);
		})
	}
	
	//初始化容器队列
	_initRootQueue(el){
		let $parent = el.parentNode;
		if($parent){
			let overflowX = $util.getScrollWidth($parent) > $parent.offsetWidth;
			let overflowY = $util.getScrollHeight($parent) > $parent.offsetHeight;
			//如果含有滚动条
			if(overflowX || overflowY){
				$parent.data('overflowX',overflowX);
				$parent.data('overflowY',overflowY)
				this.rootQueue.push($parent)
			}
			this._initRootQueue($parent)
		}
	}
	
	//滚动处理事件
	_scrollHandler(e){
		let $root = $util.isElement(e)?e:e.currentTarget;
		//横向滚动
		if($root.data('overflowX')){
			//元素距离滚动容器的可视距离,不包含自身宽度
			let offsetLeft1 = this.$el.getBoundingClientRect().left - $root.getBoundingClientRect().left;
			//元素距离滚动元素的可视距离,包含自身宽度
			let offsetLeft2 = this.$el.getBoundingClientRect().right - $root.getBoundingClientRect().left;
			if (offsetLeft2 > 0 && offsetLeft1 < $root.offsetWidth) {
				//元素开始进入
				if (!this.triggerTag.before) {
					this.beforeEnter(this.$el,$root);
					this.triggerTag.before = true;
				}
			} else {
				//元素完全离开
				if (this.triggerTag.before) {
					this.leave(this.$el,$root);
					this.triggerTag.before = false;
				}
			}
			if (offsetLeft1 > 0 && offsetLeft2 < $root.offsetWidth) {
				//元素完全进入
				if (!this.triggerTag.after) {
					this.enter(this.$el,$root);
					this.triggerTag.after = true;
				}
			} else {
				//元素开始离开
				if (this.triggerTag.after) {
					this.beforeLeave(this.$el,$root);
					this.triggerTag.after = false;
				}
			}
		}
		//纵向滚动
		if($root.data('overflowY')){
			//元素距离滚动容器的可视距离,不包含自身高度
			let offsetTop1 = this.$el.getBoundingClientRect().top - $root.getBoundingClientRect().top;
			//元素距离滚动元素的可视距离,包含自身高度
			let offsetTop2 = this.$el.getBoundingClientRect().bottom - $root.getBoundingClientRect().top;
			
			if (offsetTop2 > 0 && offsetTop1 < $root.offsetHeight) {
				//元素开始进入
				if (!this.triggerTag.before) {
					this.beforeEnter(this.$el,$root);
					this.triggerTag.before = true;
				}
			} else {
				//元素完全离开
				if (this.triggerTag.before) {
					this.leave(this.$el,$root);
					this.triggerTag.before = false;
				}
			}
			if (offsetTop1 > 0 && offsetTop2 < $root.offsetHeight) {
				//元素完全进入
				if (!this.triggerTag.after) {
					this.enter(this.$el,$root);
					this.triggerTag.after = true;
				}
			} else {
				//元素开始离开
				if (this.triggerTag.after) {
					this.beforeLeave(this.$el,$root);
					this.triggerTag.after = false;
				}
			}		
		}
	}
	
}

export default Spy
