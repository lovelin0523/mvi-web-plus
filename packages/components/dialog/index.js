import {
	createApp
} from "vue"
import Icon from "../icon"
import Modal from "../modal"
import Overlay from "../overlay"
import Button from "../button"
import $util from "../../util/util"
import dialogComponent from "./dialog"
import dialogForPCComponent from "./dialogForPC"

const Dialog = {
	//初始化参数
	initParams: (type, options) => {
		let opts = {}
		if ($util.isObject(options)) {
			opts.title = options.title;
			opts.message = options.message;
			opts.width = options.width;
			opts.zIndex = options.zIndex;
			opts.usePadding = options.usePadding;
			opts.animation = options.animation;
			opts.radius = options.radius;
			opts.timeout = options.timeout;
			opts.overlayColor = options.overlayColor;
			opts.mountEl = options.mountEl;
			if (type == 'alert' || type == 'confirm' || type == 'prompt') {
				opts.btnText = options.btnText;
				opts.btnColor = options.btnColor;
				opts.ios = options.ios;
				opts.input = {
					placeholder: options.placeholder,
					type: options.type,
					autofocus: options.autofocus,
					maxlength: options.maxlength,
					clearable: options.clearable,
					mode: options.mode,
					align: options.align,
					value: options.value
				}
			} else if (type == 'Alert' || type == 'Confirm' || type == 'Prompt') {
				opts.btns = options.btns;
				opts.showTimes = options.showTimes;
				opts.input = {
					placeholder: options.placeholder,
					type: options.type,
					autofocus: options.autofocus,
					maxlength: options.maxlength,
					clearable: options.clearable,
					align: options.align,
					value: options.value
				}
			}
		} else if (typeof options == "string") {
			opts.message = options;
		}
		opts.type = type;
		return opts;
	},

	//提示框
	alert: options => {
		return new Promise((resolve, reject) => {
			let opts = Dialog.initParams('alert', options);
			let mountNode = $util.string2dom('<div></div>');
			document.body.appendChild(mountNode);
			const instance = createApp(dialogComponent, {
				...opts,
				remove: () => {
					instance.unmount();
					mountNode.remove();
					resolve();
				}
			})
			instance.use(Overlay).use(Modal).use(Icon).mount(mountNode)
		})
	},

	//确认框
	confirm: options => {
		return new Promise((resolve, reject) => {
			let opts = Dialog.initParams('confirm', options);
			let mountNode = $util.string2dom('<div></div>');
			document.body.appendChild(mountNode);
			const instance = createApp(dialogComponent, {
				...opts,
				remove: ok => {
					instance.unmount();
					mountNode.remove();
					resolve(ok);
				}
			})
			instance.use(Overlay).use(Modal).use(Icon).mount(mountNode)
		})
	},

	//信息输入框
	prompt: options => {
		return new Promise((resolve, reject) => {
			let opts = Dialog.initParams('prompt', options);
			console.log(opts)
			let mountNode = $util.string2dom('<div></div>');
			document.body.appendChild(mountNode);
			const instance = createApp(dialogComponent, {
				...opts,
				remove: (ok, value) => {
					instance.unmount();
					mountNode.remove();
					resolve({
						ok,
						value
					});
				}
			})
			instance.use(Overlay).use(Modal).use(Icon).mount(mountNode)
		})
	},

	//pc端提示框
	Alert: options => {
		return new Promise((resolve, reject) => {
			let opts = Dialog.initParams('Alert', options);
			let mountNode = $util.string2dom('<div></div>');
			document.body.appendChild(mountNode);
			const instance = createApp(dialogForPCComponent, {
				...opts,
				remove: () => {
					instance.unmount();
					mountNode.remove();
					resolve();
				}
			})
			instance.use(Icon).use(Overlay).use(Modal).use(Button).mount(mountNode)
		})
	},

	//pc端确认框
	Confirm: options => {
		return new Promise((resolve, reject) => {
			let opts = Dialog.initParams('Confirm', options);
			let mountNode = $util.string2dom('<div></div>');
			document.body.appendChild(mountNode);
			const instance = createApp(dialogForPCComponent, {
				...opts,
				remove: ok => {
					instance.unmount();
					mountNode.remove();
					resolve(ok);
				}
			})
			instance.use(Icon).use(Overlay).use(Modal).use(Button).mount(mountNode)
		})
	},

	//pc端信息输入框
	Prompt: options => {
		return new Promise((resolve, reject) => {
			let opts = Dialog.initParams('Prompt', options);
			let mountNode = $util.string2dom('<div></div>');
			document.body.appendChild(mountNode);
			const instance = createApp(dialogForPCComponent, {
				...opts,
				remove: (ok, value) => {
					instance.unmount();
					mountNode.remove();
					resolve({
						ok,
						value
					});
				}
			})
			instance.use(Icon).use(Overlay).use(Modal).use(Button).mount(mountNode)
		})
	},

	//注册函数
	install: app => {
		//将提示框挂载到全局
		app.config.globalProperties.$alert = Dialog.alert;
		app.provide('$alert', Dialog.alert);

		//将确认框挂载到全局
		app.config.globalProperties.$confirm = Dialog.confirm;
		app.provide('$confirm', Dialog.confirm);

		//将信息输入框挂载到全局
		app.config.globalProperties.$prompt = Dialog.prompt;
		app.provide('$prompt', Dialog.prompt);

		//将PC端提示框挂载到全局
		app.config.globalProperties.$Alert = Dialog.Alert;
		app.provide('$Alert', Dialog.Alert);

		//将PC端确认框挂载到全局
		app.config.globalProperties.$Confirm = Dialog.Confirm;
		app.provide('$Confirm', Dialog.Confirm);

		//将PC端信息输入框挂载到全局
		app.config.globalProperties.$Prompt = Dialog.Prompt;
		app.provide('$Prompt', Dialog.Prompt);
	}
}

export default Dialog
