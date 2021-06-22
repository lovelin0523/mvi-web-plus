//全局默认样式
import "./css/mvi-default.less"
//辅助样式
import "./css/mvi-support.less"
//工具类
import util from "./util"
//JS默认设置
import "./config"
//组件
import components from "./components"

//注册组件和工具类
const install = app=> {
	if (install.installed) return
	util.install(app)
	Object.values(components).map(component => {
		component.install(app)
	})
}

let all = Object.assign({install},components)

//非import时将install暴露给window
if (typeof window !== 'undefined' && window.Vue) {
	window.mvi = all;
}

import packages from "../package.json";

console.log('%c感谢使用'+packages.name+'，当前版本：%c v'+packages.version+'\n%cMVI框架完全由个人开发和维护，如果你觉得还不错的话，欢迎前往github给个star，感谢！\ngithub地址：%c'+packages.github,'color:#808080;','color:#008a00','color:#808080;','color:#008a00');

//import时导出install
export default all