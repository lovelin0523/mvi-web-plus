import util from "./util"

util.install = app => {
	app.config.globalProperties.$util = util;
	app.provide('$util',util);
}

export default util
