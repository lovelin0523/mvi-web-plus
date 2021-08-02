import $util from "../../util/util"
import Px from './px'

Px.install = app => {
	//1px适配指令
	app.directive('px', {
		mounted(el, binding) {
			let options = {};
			if ($util.isObject(binding.value)) {
				Object.assign(options, binding.value);
			}
			if ($util.isObject(binding.modifiers)) {
				Object.assign(options, binding.modifiers);
			}
			if(binding.arg){
				options.attrName = binding.arg;
			}
			let px = new Px(el,options)
			px.init()
		}
	})
}

export default Px
