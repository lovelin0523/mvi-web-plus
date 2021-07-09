import $util from "../../util/util"
/**
 * 锚点定位
 */
class Anchor {
	constructor(element,options) {
		this.$el = element;//点击的元素
		if(!$util.isObject(options)){
			options = {};
		}
		this.$target = options.target;//锚点到的元素
		this.$root = options.root;//相对的父祖元素
		this.callback = options.callback;//回调函数
		this.time = options.time;//间隔效果
		this.distance = options.distance;//距离
		this.hasInit = false;
	}
	
	init(){
		if (this.hasInit) {
			return;
		}
		this.hasInit = true;
		//根据root的值查找元素
		if (typeof this.$root == "string" && this.$root) {
			this.$root = document.body.querySelector(this.$root);
		}
		//根据target的值查找元素
		if (typeof this.$target == "string" && this.$target) {
			this.$target = document.body.querySelector(this.$target);
		}
		
		if(!$util.isElement(this.$el)){
			throw new TypeError("The element you click on is not a node element");
		}
		if(!$util.isElement(this.$target)){
			throw new TypeError("Anchor element is not a node element");
		}
		if (!$util.isNumber(this.time)) {
			this.time = 0;
		}
		if(typeof this.callback != "function"){
			this.callback = function(){};
		}
		if(!$util.isNumber(this.distance)){
			this.distance = 0.1;
		}
		
		if ($util.isElement(this.$root)) {
			this.$el.addEventListener('click',(e)=>{
				let scrollTop = $util.getElementPoint(this.$target, this.$root).top;
				$util.setScrollTop({
					el:this.$root,
					number:scrollTop - $util.rem2px(this.distance),
					time:this.time
				}).then(()=>{
					let top = (scrollTop - $util.rem2px(this.distance)) <= 0 ? 0 : (scrollTop - $util.rem2px(this.distance));
					this.callback(top);
				});
			})
		} else {
			this.$el.addEventListener('click',(e)=>{
				//获取目标元素到浏览器顶部的距离
				let scrollTop = $util.getElementPoint(this.$target).top;
				$util.setScrollTop({
					number:scrollTop - $util.rem2px(this.distance),
					time:this.time
				}).then(()=>{
					let top = (scrollTop - $util.rem2px(this.distance)) <= 0 ? 0 : (scrollTop - $util.rem2px(this.distance));
					this.callback(top);
				})
			})
		}
	}
}

export default Anchor