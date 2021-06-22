import $util from "../../util/util"
/**
 * 文件上传
 */
class Upload {
	constructor(element,options) {
		this.$el = element; //组件容器
		this.$selectInput = null; //文件上传元素
		this.files = []; //选择的文件值数组
		if(!$util.isObject(options)){
			options = {};
		}
		this.accept = options.accept; //接受的文件类型
		this.capture = options.capture; //是否直接使用摄像头或者麦克风，只有在accept为image或者video或者audio时有效
		this.allowedFileType = options.allowedFileType; //限定上传文件的后缀
		this.minSize = options.minSize; //上传文件的最小值
		this.maxSize = options.maxSize; //上传文件的最大值
		this.maxLength = options.maxLength; //上传文件的最大个数
		this.minLength = options.minLength; //上传文件的最小个数
		this.multiple = options.multiple; //是否多选
		this.append = options.append; //选择的文件是否追加
		this.error = options.error; //选择文件错误触发的回调函数
		this.select = options.select; //选择文件成功后触发的回调函数
		this.disabled = options.disabled; //是否禁用
		this.ready = options.ready; //加载完毕触发的回调函数
		this.extra = options.extra;//额外的参数
		this.hasInit = false;//是否初始化
	}
	
	
	//初始化
	init(){
		if(this.hasInit){
			return;
		}
		this.hasInit = true;
		if (!$util.isElement(this.$el)) {
			throw new TypeError("The upload element is not specified");
		}
		if (!(this.allowedFileType instanceof Array)) {
			this.allowedFileType = [];
		}
		if (!$util.isNumber(this.minSize) || this.minSize <= 0) {
			this.minSize = -1;
		}
		if (!$util.isNumber(this.maxSize) || this.maxSize <= 0) {
			this.maxSize = -1;
		}
		if (!$util.isNumber(this.maxLength) || this.maxLength <= 0) {
			this.maxLength = -1;
		}
		if (!$util.isNumber(this.minLength) || this.minLength <= 0) {
			this.minLength = -1;
		}
		if (typeof(this.multiple) != "boolean") {
			this.multiple = false;
		}
		if (typeof(this.capture) != "boolean") {
			this.capture = false;
		}
		if (typeof(this.append) != "boolean") {
			this.append = false;
		}
		if (typeof(this.disabled) != "boolean") {
			this.disabled = false;
		}
		if (typeof(this.error) != "function") {
			this.error = function() {};
		}
		if (typeof(this.select) != "function") {
			this.select = function() {};
		}
		if (typeof(this.ready) != "function") {
			this.ready = function() {};
		}
		if( typeof(this.extra) != "object"){
			this.extra = {};
		}
		//生成input[type='file']元素
		this.$selectInput = $util.string2dom("<input type='file' />");
		if (this.accept === "rar") {
			this.$selectInput.setAttribute('accept', 'application/x-rar-compressed');
		} else if (this.accept === "zip") {
			this.$selectInput.setAttribute('accept', 'application/x-zip-compressed');
		} else if (this.accept === "txt") {
			this.$selectInput.setAttribute('accept', 'text/plain');
		} else if (this.accept === "image") {
			this.$selectInput.setAttribute('accept', 'image/*');
			if (this.capture) {
				this.$selectInput.setAttribute('capture', 'camera');
			}
		} else if (this.accept === "video") {
			this.$selectInput.setAttribute('accept', 'video/*');
			if (this.capture) {
				this.$selectInput.setAttribute('capture', 'camcorder');
			}
		} else if (this.accept === "audio") {
			this.$selectInput.setAttribute('accept', 'aduio/*');
		} else if (this.accept === "html") {
			this.$selectInput.setAttribute('accept', 'text/html');
		} else if (this.accept === "doc") {
			this.$selectInput.setAttribute('accept', 'application/msword');
		} else if (this.accept === "xml") {
			this.$selectInput.setAttribute('accept', 'text/xml');
		} else if (this.accept === "js") {
			this.$selectInput.setAttribute('accept', 'text/javascript');
		} else if (this.accept === "json") {
			this.$selectInput.setAttribute('accept', 'application/json');
		} else if (this.accept === "ppt") {
			this.$selectInput.setAttribute('accept', 'application/vnd.ms-powerpoint');
		} else if (this.accept === "pdf") {
			this.$selectInput.setAttribute('accept', 'application/pdf');
		}
		
		if (this.multiple) {
			this.$selectInput.setAttribute('multiple', 'multiple');
		}
		if (this.disabled) {
			this.$el.setAttribute("disabled", "disabled");
		}
		this.$el.onclick = (e)=>{
			if (this.disabled) {
				return;
			}
			this.$selectInput.click();
		}
		
		this.$selectInput.onchange = (e)=> {
			if (this.disabled) {
				return;
			}
			let files = this.$selectInput.files;
			if (!this.append) { //选择的文件不追加，则清空文件数组
				this.files = [];
			}
			let length = files.length;
			for (let i = 0; i < length; i++) {
				//如果append判断文件重复
				if (this.append && this.files.length > 0) {
					let flag = false;
					this.files.forEach((f, index)=> {
						if (f.name == files[i].name && f.size == files[i].size) {
							flag = true;
						}
					})
					if (!flag) {
						this.files.push(files[i]);
					}
				} else {
					this.files.push(files[i]);
				}
				//判断后缀
				if (!this._judgeSuffix(files[i].name)) {
					this.files = [];
					this.error(101, '文件' + files[i].name + "不符合规定的文件后缀类型", files[i]);
					return;
				}
				//判断文件大小
				if (files[i].size / 1024 > this.maxSize && this.maxSize > 0) {
					this.files = [];
					this.error(102, '文件' + files[i].name + "超出文件最大值限定", files[i]);
					return;
				}
				if (files[i].size / 1024 < this.minSize && this.minSize > 0) {
					this.files = [];
					this.error(103, '文件' + files[i].name + "没有达到文件最小值限定", files[i]);
					return;
				}
			}
			//已过滤的文件数量判断
			if (this.files.length > this.maxLength && this.maxLength > 0) {
				this.files = [];
				this.error(104, "文件数量超出限定的最大值");
				return;
			}
			if (this.files.length < this.minLength && this.minLength > 0) {
				this.files = [];
				this.error(105, "文件数量没有达到限定的最小值");
				return;
			}
			this.select(this.files,this.extra);
		}
		
		//ready
		this.ready(this);
	}
	
	//判断选择的文件是否符合规定的后缀格式
	_judgeSuffix(fileName){
		let suffix = fileName.substr(fileName.lastIndexOf(".") + 1); //获取文件后缀
		if (this.allowedFileType.length == 0) {
			return true;
		} else {
			suffix = suffix.toLowerCase(); //转为小写
			for (let i = 0; i < this.allowedFileType.length; i++) {
				this.allowedFileType[i] = this.allowedFileType[i].toLowerCase();
			}
			return this.allowedFileType.includes(suffix);
		}
	}
	
	//获取已经选择的文件
	getFiles(){
		return {
			files:this.files,
			extra:this.extra
		};
	}
	
	//清空选择的文件
	clear(){
		this.files = [];
		this.select(this.files,this.extra);
	}
	
	//禁用
	setDisabled(){
		this.disabled = true;
		this.$el.setAttribute("disabled", "disabled");
	}
	
	//启用
	setEnabled(){
		this.disabled = false;
		this.$el.removeAttribute("disabled");
	}
}

export default Upload