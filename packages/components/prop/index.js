import Prop from "./prop"

Prop.install = app=>{
	//高度比例系数指令
	app.directive('prop', {
		mounted(el, binding) {
			let prop = new Prop(el,binding.value);
			prop.init();
		}
	})
}

export default Prop