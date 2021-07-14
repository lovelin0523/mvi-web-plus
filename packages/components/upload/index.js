import $util from "../../util/util"
import Upload from "./upload"

Upload.install = app=> {
	//文件上传
	app.directive('upload', {
		mounted(el, binding) {
			let options = {};
			if ($util.isObject(binding.value)) {
				Object.assign(options, binding.value);
			}
			if ($util.isObject(binding.modifiers)) {
				Object.assign(options, binding.modifiers);
			}
			let upload = new Upload(el, options);
			upload.init();
		}
	})
}

export default Upload
