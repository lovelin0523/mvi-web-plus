import $util from "../../util/util"
import Resize from "./resize"

Resize.install = app=> {
	//拖拽改变大小
	app.directive('resize', {
		mounted(el, binding, vnode) {
			let options = {};
			if ($util.isObject(binding.value)) {
				Object.assign(options, binding.value);
			}
			if ($util.isObject(binding.modifiers)) {
				Object.assign(options, binding.modifiers);
			}
			let resize = new Resize(el, options);
			resize.init();
		}
	})
}


export default Resize