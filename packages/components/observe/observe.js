import $util from "../../util/util"
/**
 * 实现监听元素的属性变更
 */
class Observe {
	constructor(el, options) {
		this.$el = el; //监听的元素
		if(!$util.isObject(options)){
			options = {};
		}
		this.attributes = options.attributes; //是否监听元素属性变更
		this.childList = options.childList;//是否监听子节点变更
		this.subtree = options.subtree;//监听子节点变动时是否监听其子孙后代节点变更
		this.attributeNames = options.attributeNames;//监听元素属性变更时定义监听的属性名称数组
		this.attributesChange = options.attributesChange; //属性变化触发的方法
		this.childNodesChange = options.childNodesChange;//子孙节点变化触发的方法
		this.hasInit = false; //是否已经初始化
	}

	//初始化方法
	init() {
		if (this.hasInit) {
			return;
		}
		this.hasInit = true;
		try{
			if(typeof this.attributes != 'boolean'){
				this.attributes = false;
			}
			if(typeof this.childList != 'boolean'){
				this.childList = false;
			}
			if(typeof this.subtree != 'boolean'){
				this.subtree = false;
			}
			if(!(this.attributeNames instanceof Array)){
				this.attributeNames = [];
			}
			if(typeof this.attributesChange != 'function'){
				this.attributesChange = function(){};
			}
			if(typeof this.childNodesChange != 'function'){
				this.childNodesChange = function(){};
			}
			
			let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
			let observer = new MutationObserver(mutationList=>{
				let length = mutationList.length;
				for(let i = 0;i<length;i++){
					//监听属性
					if(this.attributes){
						this.attributesChange(mutationList[i].attributeName,mutationList[i].oldValue,this.$el.getAttribute(mutationList[i].attributeName));
					}
					//监听子节点变动
					if(this.childList){
						this.childNodesChange(mutationList[i].addedNodes,mutationList[i].removedNodes);
					}
				}
			});
			if(this.attributes){
				if(this.attributeNames.length>0){
					observer.observe(this.$el, { attributes: this.attributes, attributeFilter: this.attributeNames, attributeOldValue: true, childList:this.childList,
					subtree:this.subtree})
				}else{
					observer.observe(this.$el, { attributes: this.attributes, attributeOldValue: true, childList:this.childList, subtree:this.subtree})
				}
			}else{
				observer.observe(this.$el, { attributes: this.attributes, childList:this.childList, subtree:this.subtree})
			}
		}catch(e){
			throw new Error('Listening failed. Your browser may not support it, or childList and attributes are false, meaning there are no objects to listen on');
		}
	}
}


export default Observe