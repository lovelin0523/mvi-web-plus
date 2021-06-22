import $util from "../../util/util"
/**
 * 监听元素滚动条到达顶部或者底部
 */
class Scroll {
	constructor(element,options) {
		this.$el = element;
		if(!$util.isObject(options)){
			options = {};
		}
		this.top = options.top;
		this.bottom = options.bottom;
		this.hasInit = false; //是否已经初始化
	}
	
	init(){
		if (this.hasInit) {
			return;
		}
		this.hasInit = true;
		if(!$util.isElement(this.$el)){
			this.$el = window;
		}
		if(typeof(this.top)!="function"){
			this.top = function(){};
		}
		if(typeof(this.bottom)!="function"){
			this.bottom = function(){};
		}
		$util.scrollTopBottomTrigger(this.$el,res=>{
			if(res.state == 'top'){
				this.top(res.target)
			}else {
				this.bottom(res.target)
			}
		})
		
	}
	
}

export default Scroll