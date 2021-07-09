import $util from "../../util/util"
/**
 * 高度比例系数
 */
class Prop {
	constructor(element,ratio) {
		this.$el = element;//元素
		this.ratio = ratio;//比率
		this.width = 0;//元素宽度
		this.height = 0;//元素高度
		this.hasInit = false;
	}
	
	init(){
		if (this.hasInit) {
			return;
		}
		this.hasInit = true;
		if(!$util.isElement(this.$el)){
			throw new Error("The bound element is not a node element");
		}
		if(typeof this.ratio != "number" || isNaN(this.ratio)){
			this.ratio = 0;
		}
		this._set();
		window.addEventListener('resize',()=>{
			this._set();
		})
	}
	
	//设置高度的方法
	_set(){
		this.width = this.$el.offsetWidth; //宽度
		/*比例系数乘以宽度获得高度*/
		this.height = this.width * this.ratio;
		this.$el.style.height = this.height + "px";
	}
}

export default Prop
