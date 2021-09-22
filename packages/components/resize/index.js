import $dap from "dap-util"
import Resize from "./resize"

Resize.install = app => {
	//拖拽改变大小
	app.directive('resize', {
		mounted(el, binding) {
			let options = {}
			if ($dap.common.isObject(binding.value)) {
				Object.assign(options, binding.value)
			}
			if ($dap.common.isObject(binding.modifiers)) {
				Object.assign(options, binding.modifiers)
			}
			let resize = new Resize(el, options)
			resize.init()
			//将对象记录在元素里
			$dap.data.set(el, 'directive:resize', resize)
		},
		beforeUnmount(el, binding) {
			//获取对象
			let resize = $dap.data.get(el, 'directive:resize')
			if (resize) {
				//移除绑定在body上的事件
				resize._setOff()
			}
		}
	})
}


export default Resize
