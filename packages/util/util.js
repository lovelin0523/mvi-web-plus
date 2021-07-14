const util = {
	
	/**
	 * 文字复制方法
	 */
	copyText(text){
		let el = this.string2dom('<div>'+text+'</div>');
		document.body.appendChild(el);
		const range = document.createRange();
		range.selectNode(el);
		const selection = window.getSelection();
		if(selection.rangeCount > 0) selection.removeAllRanges();
		selection.addRange(range);
		document.execCommand('copy');
		document.body.removeChild(el);
	},
	
	/**
	 * 获取元素距离可视窗口的位置
	 */
	getElementBounding(element){
		if (!this.isElement(element)) {
			element = document.body;
		}
		let point = element.getBoundingClientRect();
		let top = point.top;//元素顶部距离可视窗口上边的距离
		let bottom = (document.documentElement.clientHeight || window.innerHeight) - point.bottom;//元素底部距离可视窗口底部的距离
		let left = point.left;//元素左侧距离可视窗口左边的距离
		let right = (document.documentElement.clientWidth || window.innerWidth) - point.right;//元素右侧距离可视窗口右边的距离
		return {
			top,bottom,left,right
		}
	},
	
	/**
	 * 判断是否数值
	 */
	isNumber(param) {
		if (typeof param == 'number' && !isNaN(param)) {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 判断两个参数是否相等
	 */
	equal(a, b) {
		if (!a || !b) {
			return false;
		}
		if (typeof a !== typeof b) {
			return false;
		}
		if (this.isObject(a) && this.isObject(b)) {
			let aProps = Object.getOwnPropertyNames(a);
			let bProps = Object.getOwnPropertyNames(b);
			if (aProps.length != bProps.length) {
				return false;
			}
			let length = aProps.length;
			for (let i = 0; i < length; i++) {
				let propName = aProps[i];
				let propA = a[propName];
				let propB = b[propName];
				if (this.isObject(propA)) {
					if (this.equal(propA, propB)) {
						return true;
					} else {
						return false;
					}
				} else if (propA !== propB) {
					return false;
				}
			}
			return true;
		} else {
			return a === b;
		}
	},

	/**
	 * 判断是否空对象
	 */
	isEmptyObject(obj) {
		if (this.isObject(obj)) {
			if (Object.keys(obj).length == 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	/**
	 * rgb值转16进制
	 */
	rgb2hex(rgb) {
		let r = rgb[0];
		let g = rgb[1];
		let b = rgb[2];
		let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		return hex;
	},

	/**
	 * 16进制颜色转rgb
	 */
	hex2rgb(hex) {
		let color = hex.toLowerCase();
		//十六进制颜色值的正则表达式
		let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
		// 如果是16进制颜色
		if (color && reg.test(color)) {
			if (color.length === 4) {
				let colorNew = "#";
				for (let i = 1; i < 4; i += 1) {
					colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
				}
				color = colorNew;
			}
			//处理六位的颜色值
			let colorChange = [];
			for (let i = 1; i < 7; i += 2) {
				colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
			}
			return colorChange;
		}
		return color;
	},

	/**
	 * hsv格式值转rgb值
	 * hsv:[30,40,20]第一个为deg
	 */
	hsv2rgb(hsv) {
		let h = (hsv[0] >= 360 || hsv[0] <= 0) ? 0 : hsv[0];
		let s = hsv[1] >= 100 ? 100 : hsv[1];
		s = s <= 0 ? 0 : s;
		let v = hsv[2] >= 100 ? 100 : hsv[2];
		v = v <= 0 ? 0 : v;
		s = s / 100;
		v = v / 100;
		let r = 0;
		let g = 0;
		let b = 0;
		let i = parseInt((h / 60) % 6);
		let f = h / 60 - i;
		let p = v * (1 - s);
		let q = v * (1 - f * s);
		let t = v * (1 - (1 - f) * s);
		switch (i) {
			case 0:
				r = v;
				g = t;
				b = p;
				break;
			case 1:
				r = q;
				g = v;
				b = p;
				break;
			case 2:
				r = p;
				g = v;
				b = t;
				break;
			case 3:
				r = p;
				g = q;
				b = v;
				break;
			case 4:
				r = t;
				g = p;
				b = v;
				break;
			case 5:
				r = v;
				g = p;
				b = q;
				break;
			default:
				break;
		}
		r = parseInt(r * 255.0)
		g = parseInt(g * 255.0)
		b = parseInt(b * 255.0)
		return [r, g, b];
	},

	/**
	 * rgb转hsv值
	 * rgb:[20,20,20]：三个值都是0-255的值
	 */
	rgb2hsv(rgb) {
		let h = 0;
		let s = 0;
		let v = 0;
		let r = rgb[0] >= 255 ? 255 : rgb[0];
		let g = rgb[1] >= 255 ? 255 : rgb[1];
		let b = rgb[2] >= 255 ? 255 : rgb[2];
		r = r <= 0 ? 0 : r;
		g = g <= 0 ? 0 : g;
		b = b <= 0 ? 0 : b;
		let max = Math.max(r, g, b);
		let min = Math.min(r, g, b);
		v = max / 255;
		if (max === 0) {
			s = 0;
		} else {
			s = 1 - (min / max);
		}
		if (max === min) {
			h = 0; //事实上，max===min的时候，h无论为多少都无所谓
		} else if (max === r && g >= b) {
			h = 60 * ((g - b) / (max - min)) + 0;
		} else if (max === r && g < b) {
			h = 60 * ((g - b) / (max - min)) + 360
		} else if (max === g) {
			h = 60 * ((b - r) / (max - min)) + 120
		} else if (max === b) {
			h = 60 * ((r - g) / (max - min)) + 240
		}
		h = parseInt(h);
		s = parseInt(s * 100);
		v = parseInt(v * 100);
		return [h, s, v];
	},

	/**
	 * 判断字符串属于哪种选择器
	 */
	getCssSelector(selectorName) {
		let type = 0;
		let value = "";
		//id选择器，以#开头的字符串
		if (/^#{1}/.test(selectorName)) {
			type = "id";
			value = selectorName.substr(1);
			return {
				type: type,
				value: value
			}
		}
		//类名选择器，以.开头的字符串
		if (/^\./.test(selectorName)) {
			type = "class";
			value = selectorName.substr(1);
			return {
				type: type,
				value: value
			}
		}
		//属性选择器，以[]包裹的字符串
		if (/^\[(.+)\]$/.test(selectorName)) {
			type = "attribute";
			let attribute = this.trim(selectorName, true).substring(1, this.trim(selectorName, true).length - 1);
			let arry = attribute.split("=");
			if (arry.length == 1) {
				value = arry[0];
			}
			if (arry.length == 2) {
				value = {
					attributeName: arry[0],
					attributeValue: arry[1].replace(/\'/g, "").replace(/\"/g, "") //去除属性值的单引号或者双引号
				}
			}
			return {
				type: type,
				value: value
			}
		}

		//默认为标签名选择器
		return {
			type: "tag",
			value: selectorName
		}

	},

	/**
	 * 判断是否是对象
	 */
	isObject(param) {
		if (typeof param === "object" && param) {
			return true;
		}
		return false;
	},

	/**
	 * 监听元素滚动条滚动到顶部和滚动到底部
	 */
	scrollTopBottomTrigger(element, callback) {
		let scrollEle = window;
		if (this.isElement(element) && element != document.body && element != document.documentElement) {
			scrollEle = element;
		}
		if (typeof element == "function") {
			callback = element;
		}
		//滑动到底部时是否触发回调函数的标识，解决ios系统下多次触发回调的bug
		let flag = true;
		scrollEle.on('scroll.topBottom', e => {
			if (this.getScrollTop(scrollEle) <= 0) { //滑动到顶部
				let options = {
					state: "top",
					target: scrollEle
				}
				if (!flag) {
					return;
				}
				if (typeof callback == "function") {
					flag = false;
					callback(options);
				}

			} else { //滑动到底部
				let options = {
					state: "bottom",
					target: scrollEle
				}
				let height = 0;
				if (scrollEle == window) {
					height = window.innerHeight;
				} else {
					let borderTop = parseFloat(this.getCssStyle(scrollEle, 'border-top-width'))
					let borderBottom = parseFloat(this.getCssStyle(scrollEle, 'border-bottom-width'))
					height = scrollEle.offsetHeight - borderTop - borderBottom;
				}
				if ((this.getScrollTop(scrollEle) + height >= this.getScrollHeight(scrollEle)) && (height != this.getScrollHeight(
						scrollEle))) {
					if (!flag) {
						return;
					}
					if (typeof callback == "function") {
						flag = false;
						callback(options);
					}
				} else {
					flag = true;
				}
			}
		})
	},

	/**
	 * 向指定位置插入字符串
	 * original:原字符串
	 * str:插入的字符串
	 * index:插入的位置
	 */
	insertStr(original, str, index) {
		return original.substr(0, index) + str + original.substring(index, original.length);
	},

	/**
	 * 删除指定位置的字符串
	 * original:原字符串
	 * index:删除的位置序列
	 * num:删除的字符串长度
	 */
	deleteStr(original, index, num) {
		return original.substr(0, index) + original.substring(index + num, original.length);
	},

	/**
	 * 替换指定位置的字符串
	 * original:原始字符串
	 * start:开始位置
	 * end：结束位置
	 * str:改变后的字
	 */
	replaceStr(original, start, end, str) {
		return original.substring(0, start) + str + original.substring(end, original.length);
	},

	/**
	 * 去除字符串空格
	 * is_global：为true时去除所有空格，否则只去除两边空格
	 */
	trim(str, is_global) {
		if (typeof str != "string") {
			return "";
		}
		let result = str.replace(/(^\s+)|(\s+$)/g, "");
		if (is_global) {
			result = result.replace(/\s/g, "");
		}
		return result;
	},

	/**
	 * 获取元素距离指定祖先元素左侧/顶部/底部/右侧的距离
	 * element:指定的元素,未指定则为document.body
	 * root:祖先元素,未指定则为document.body
	 */
	getElementPoint(element, root) {
		if (!this.isElement(element)) {
			element = document.body;
		}
		let flag = false;
		if (!this.isElement(root)) {
			root = document.body;
		} else {
			let position = this.getCssStyle(root, "position");
			if (position === "static") {
				root.style.position = "relative";
				flag = true;
			}
		}

		if (!this.isContains(root, element)) {
			throw new Error('root与element无层级关系');
		}

		let obj = element;
		let offsetTop = 0;
		let offsetLeft = 0;
		//判断是否有定位父容器，如果存在则累加其边距
		while (this.isElement(element) && this.isContains(root, element) && root !== element) {
			offsetTop += element.offsetTop; //叠加父容器的上边距
			offsetLeft += element.offsetLeft; //叠加父容器的左边距
			element = element.offsetParent;
		}
		let offsetRight = root.offsetWidth - offsetLeft - obj.offsetWidth;
		let offsetBottom = root.offsetHeight - offsetTop - obj.offsetHeight;
		if (flag) {
			root.style.position = "static";
		}
		return {
			top: offsetTop,
			left: offsetLeft,
			right: offsetRight,
			bottom: offsetBottom,
		}
	},

	/**
	 * 判断是否是元素节点
	 */
	isElement(element) {
		if (element && element.nodeType === 1 && element instanceof Node) {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 获取滚动条在Y轴上滚动的距离
	 * element未指定则表示document.body
	 */
	getScrollTop(element) {
		let scrollTop = 0;
		//如果是元素节点
		if (this.isElement(element) && element != document.body && element != document.documentElement && element != window) {
			scrollTop = element.scrollTop;
		} else {
			if (document.documentElement.scrollTop == 0 || document.body.scrollTop == 0) {
				scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			} else {
				scrollTop = document.documentElement.scrollTop > document.body.scrollTop ? document.documentElement.scrollTop :
					document.body.scrollTop;
			}
		}
		return scrollTop;
	},

	/**
	 * 设置滚动条在Y轴上的距离
	 * options:el(滚动条所在元素,未指定则为document.documentElement),number(距离值),time(动画时间间隔)
	 */
	setScrollTop(options) {
		let isWindow = false;
		let element = options.el;
		if (typeof element == 'string' && element) {
			element = document.body.querySelector(element);
		}
		let number = options.number || 0;
		let time = options.time || 0;
		if (!this.isElement(element) || element == document.body || element == document.documentElement || element ==
			window) {
			isWindow = true;
		}
		return new Promise((reslove, reject) => {
			if (time <= 0) {
				if (isWindow) {
					document.documentElement.scrollTop = document.body.scrollTop = number;
				} else {
					element.scrollTop = number;
				}
				reslove();
			} else {
				let spacingTime = 10; // 设置循环的间隔时间  值越小消耗性能越高
				let spacingIndex = time / spacingTime; // 计算循环的次数
				// 获取当前滚动条位置
				let nowTop = this.getScrollTop(element);
				let everTop = (number - nowTop) / spacingIndex; // 计算每次滑动的距离
				let scrollTimer = setInterval(() => {
					if (spacingIndex > 0) {
						spacingIndex--;
						if (isWindow) {
							document.documentElement.scrollTop = document.body.scrollTop = (nowTop += everTop);
						} else {
							element.scrollTop = (nowTop += everTop);
						}
					} else {
						clearInterval(scrollTimer); // 清除计时器
						reslove();
					}
				}, spacingTime);
			}
		})
	},

	/**
	 * 获取滚动条在X轴上滚动的距离
	 * element未指定则表示document.body
	 */
	getScrollLeft(element) {
		let scrollLeft = 0;
		//如果是元素节点
		if (this.isElement(element) && element != document.body && element != document.documentElement && element != window) {
			scrollLeft = element.scrollLeft;
		} else {
			if (document.documentElement.scrollLeft == 0 || document.body.scrollLeft == 0) {
				scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
			} else {
				scrollLeft = document.documentElement.scrollLeft > document.body.scrollLeft ? document.documentElement.scrollLeft :
					document.body.scrollLeft;
			}
		}
		return scrollLeft;
	},

	/**
	 * 设置滚动条在X轴上的距离
	 * options:el(滚动条所在元素,未指定则为document.documentElement),number(距离值),time(动画时间间隔)
	 */
	setScrollLeft(options) {
		let isWindow = false;
		let element = options.el;
		if (typeof element == 'string' && element) {
			element = document.body.querySelector(element);
		}
		let number = options.number || 0;
		let time = options.time || 0;
		if (!this.isElement(element) || element == document.body || element == document.documentElement || element ==
			window) {
			isWindow = true;
		}
		return new Promise((reslove, reject) => {
			if (time <= 0) {
				if (isWindow) {
					document.documentElement.scrollLeft = document.body.scrollLeft = number;
				} else {
					element.scrollLeft = number;
				}
				reslove();
			} else {
				let spacingTime = 10; // 设置循环的间隔时间  值越小消耗性能越高
				let spacingIndex = time / spacingTime; // 计算循环的次数
				// 获取当前滚动条位置
				let nowLeft = this.getScrollLeft(element);
				let everLeft = (number - nowLeft) / spacingIndex; // 计算每次滑动的距离
				let scrollTimer = setInterval(() => {
					if (spacingIndex > 0) {
						spacingIndex--;
						if (isWindow) {
							document.documentElement.scrollLeft = document.body.scrollLeft = (nowLeft += everLeft);
						} else {
							element.scrollLeft = (nowLeft += everLeft);
						}
					} else {
						clearInterval(scrollTimer); // 清除计时器
						reslove();
					}
				}, spacingTime);
			}
		})
	},

	/**
	 * 获取文档或者元素的总高度
	 * element未指定则表示document.body
	 */
	getScrollHeight(element) {
		let scrollHeight = 0;
		if (this.isElement(element) && element != document.documentElement && element != document.body && element != window) {
			scrollHeight = element.scrollHeight;
		} else {
			if (document.documentElement.scrollHeight == 0 || document.body.scrollHeight == 0) {
				scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			} else {
				scrollHeight = document.documentElement.scrollHeight > document.body.scrollHeight ? document.documentElement.scrollHeight :
					document.body.scrollHeight;
			}
		}
		return scrollHeight;
	},

	/**
	 * 获取文档或元素的总宽度
	 */
	getScrollWidth(element) {
		let scrollWidth = 0;
		if (this.isElement(element) && element != document.documentElement && element != document.body && element != window) {
			scrollWidth = element.scrollWidth;
		} else {
			if (document.documentElement.scrollWidth == 0 || document.body.scrollWidth == 0) {
				scrollWidth = document.documentElement.scrollWidth || document.body.scrollWidth;
			} else {
				scrollWidth = document.documentElement.scrollWidth > document.body.scrollWidth ? document.documentElement.scrollWidth :
					document.body.scrollWidth;
			}
		}
		return scrollWidth;
	},

	/**
	 * 获取元素指定样式
	 * element未指定则为document.body,
	 * cssName:样式名称,css名称
	 */
	getCssStyle(element, cssName) {
		//元素不是节点
		if (!this.isElement(element)) {
			element = document.body;
		}
		if (element) {
			if (typeof cssName == "string") {
				let cssText = "";
				if (document.defaultView && document.defaultView.getComputedStyle) { //兼容IE9-IE11、chrome、firefox、safari、opera；不兼容IE7-IE8
					cssText = document.defaultView.getComputedStyle(element)[cssName];
				} else { //兼容IE7-IE11；不兼容chrome、firefox、safari、opera
					cssText = element.currentStyle[cssName];
				}
				return cssText;
			}
		}
	},

	/**
	 * 判断指定元素是否含有指定类名
	 * element未指定则为document.body
	 * className支持多类,以空格划分
	 */
	hasClass(element, className) {
		//元素不是节点
		if (!this.isElement(element)) {
			element = document.body;
		}
		let classList = element.classList;
		let classArray = this.trim(className).split(/\s+/); //按照空格划分
		let flag = true;
		classArray.forEach((item, index) => {
			if (!classList.contains(item)) {
				flag = false;
			}
		});
		return flag;
	},

	/**
	 * 添加class
	 * element未指定则为document.body
	 * className支持多类,以空格划分
	 */
	addClass(element, className) {
		//元素不是节点
		if (!this.isElement(element)) {
			element = document.body;
		}
		let classList = element.classList;
		let classArray = this.trim(className).split(/\s+/); //按照空格划分
		classArray.forEach((item, index) => {
			classList.add(item);
		});
	},

	/**
	 * 移除class
	 * element未指定则为document.body
	 * className支持多类,以空格划分
	 */
	removeClass(element, className) {
		//元素不是节点
		if (!this.isElement(element)) {
			element = document.body;
		}
		let classList = element.classList;
		let classArray = this.trim(className).split(/\s+/); //按照空格划分
		classArray.forEach((item, index) => {
			classList.remove(item);
		});
	},

	/**
	 * 判断某个节点是否包含指定节点
	 * 包含相等关系和父子关系
	 * parentNode和childNode如果未指定,则表示document.body
	 */
	isContains(parentNode, childNode) {
		if (!this.isElement(parentNode)) {
			parentNode = document.body;
		}
		if (!this.isElement(childNode)) {
			childNode = document.body;
		}
		if (parentNode === childNode) {
			return true;
		}
		//如果浏览器支持contains
		if (parentNode.contains) {
			return parentNode.contains(childNode)
		}
		//火狐支持
		if (parentNode.compareDocumentPosition) {
			return !!(parentNode.compareDocumentPosition(childNode) & 16);
		}

	},

	/**
	 * 判断某个节点是否是指定节点的父节点
	 * 不包含相等关系
	 * parentNode和childNode如果为指定,则表示document.body
	 */
	isParentNode(parentNode, childNode) {
		if (!this.isElement(parentNode)) {
			parentNode = document.body;
		}
		if (!this.isElement(childNode)) {
			childNode = document.body;
		}
		if (parentNode === childNode) {
			return false;
		}
		if (childNode.parentNode == parentNode) {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 查找某个节点下指定类名/id/标签名的子元素
	 * selector支持多选择器,以空格划分
	 * 如果element未指定则为document.body
	 */
	children(element, selector) {
		//元素不是节点
		if (!this.isElement(element)) {
			element = document.body;
		}
		let result = new Array(); //存放结果的数组
		let childNodes = element.children; //子元素数组
		//selector参数不存在时，查找他的所有子元素
		if (selector == "" || selector == undefined || selector == null || typeof selector != "string") {
			for (let i = 0; i < childNodes.length; i++) {
				result.push(childNodes[i]);
			}
			return result;
		}
		//selector参数存在时，根据空格划分选择器
		let selectors = this.trim(selector).split(/\s+/);
		selectors.forEach(sc=>{
			//判断选择器类型
			let selector_type = this.getCssSelector(sc).type;
			let selector_value = this.getCssSelector(sc).value;
			switch (selector_type) {
				case "id": //ID
					for (let i = 0; i < childNodes.length; i++) {
						if (this.trim(childNodes[i].getAttribute("id"), false) == selector_value) {
							result.push(childNodes[i]);
						}
					}
					break;
				case "class": //类名
					for (let i = 0; i < childNodes.length; i++) {
						if (this.hasClass(childNodes[i], selector_value)) {
							result.push(childNodes[i]);
						}
					}
					break;
				case "attribute": //属性
					for (let i = 0; i < childNodes.length; i++) {
						if (typeof selector_value == 'object') {
							if (childNodes[i].hasAttribute(selector_value.attributeName)) {
								if (childNodes[i].getAttribute(selector_value.attributeName) == selector_value.attributeValue) {
									result.push(childNodes[i]);
								}
							}
						} else {
							if (childNodes[i].hasAttribute(selector_value)) {
								result.push(childNodes[i]);
							}
						}

					}
					break;
				default: //标签名
					for (let i = 0; i < childNodes.length; i++) {
						if (childNodes[i].tagName.toLocaleUpperCase() == selector_value.toLocaleUpperCase()) {
							result.push(childNodes[i]);
						}
					}
			}
		});
		//删除重复的元素
		for (let i = 0; i < result.length; i++) {
			for (let j = i + 1; j < result.length; j++) {
				if (result[i] == result[j]) {
					result.splice(i, 1);
					break;
				}
			}
		}
		return result;
	},

	/**
	 * string类型的dom元素转为dom节点
	 */
	string2dom(str) {
		if (typeof str != "string") {
			str = "";
		}
		let parentEle = document.createElement("div");
		parentEle.innerHTML = str;
		if (parentEle.children.length == 1) {
			return parentEle.children[0];
		} else {
			return parentEle.children;
		}
	},

	/**
	 * 查找某个节点下指定类名/id/标签名的兄弟节点
	 * selector支持多选择器,以空格划分
	 * 如果element未指定则为document.body
	 */
	siblings(element, selector) {
		//元素不是节点
		if (!this.isElement(element)) {
			element = document.body;
		}
		let siblingsArray = [];
		let childNodes = element.parentNode.children; //获取父节点的所有子节点
		for (let i = 0; i < childNodes.length; i++) {
			if (childNodes[i] !== element) {
				siblingsArray.push(childNodes[i]);
			}
		}

		//selector参数不存在时，返回所有的兄弟节点
		if (selector == "" || selector == undefined || selector == null || typeof selector != "string") {
			return siblingsArray;
		}
		let selectors = selector.split(/\s+/);
		let result = new Array();
		selectors.forEach(sc=> {
			//判断选择器类型
			let selector_type = this.getCssSelector(sc).type;
			let selector_value = this.getCssSelector(sc).value;
			switch (selector_type) {
				case "id": //ID
					for (let i = 0; i < siblingsArray.length; i++) {
						if (this.trim(siblingsArray[i].getAttribute("id"), false) == selector_value) {
							result.push(siblingsArray[i]);
						}
					}
					break;
				case "class": //类名
					for (let i = 0; i < siblingsArray.length; i++) {
						if (this.hasClass(siblingsArray[i], selector_value)) {
							result.push(siblingsArray[i]);
						}
					}
					break;
				case "attribute": //属性
					for (let i = 0; i < siblingsArray.length; i++) {
						if (typeof selector_value == 'object') {
							if (siblingsArray[i].hasAttribute(selector_value.attributeName)) {
								if (siblingsArray[i].getAttribute(selector_value.attributeName) == selector_value.attributeValue) {
									result.push(siblingsArray[i]);
								}
							}
						} else {
							if (siblingsArray[i].hasAttribute(selector_value)) {
								result.push(siblingsArray[i]);
							}
						}
					}
					break;
				default: //标签名
					for (let i = 0; i < siblingsArray.length; i++) {
						if (siblingsArray[i].tagName.toLocaleUpperCase() == selector_value.toLocaleUpperCase()) {
							result.push(siblingsArray[i]);
						}
					}
					break;
			}
		});
		//删除重复的元素
		for (let i = 0; i < result.length; i++) {
			for (let j = i + 1; j < result.length; j++) {
				if (result[i] == result[j]) {
					result.splice(i, 1);
					break;
				}
			}
		}
		return result;
	},

	/**
	 * rem与px单位转换
	 * 参数number:rem数值
	 */
	rem2px(number) {
		let fs = this.getCssStyle(document.documentElement, "font-size");
		let num = number * parseFloat(fs); //获得px单位的值
		return num;
	},

	/**
	 * rem与px单位转换
	 * 参数number:px数值
	 */
	px2rem(number) {
		let fs = this.getCssStyle(document.documentElement, "font-size");
		let num = number / parseFloat(fs);
		return num;
	},

	/**
	 * 判断访问终端
	 * params:访问终端名称
	 */
	judgeAccessTerminalBrowser(params) {
		let browser = {
			versions: function(){
				let u = navigator.userAgent;
				let app = navigator.appVersion;
				return {
					trident: u.indexOf('Trident') > -1, //IE内核
					presto: u.indexOf('Presto') > -1, //opera内核
					webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
					gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
					edge: !!u.match(/edge\/([\d.]+)/), //是否为edge内核
					qqbrowser: u.indexOf("MQQBrowser") > -1, //是否为QQ浏览器
					qq: u.indexOf('QQ') > -1, //是否QQ
					weixin: u.indexOf('MicroMessenger') > -1, //是否微信
					uc: u.indexOf("UCBrowser") > -1, //是否uc浏览器
					chrome: u.indexOf("Chrome") > -1, //是否谷歌浏览器
					firefox: u.indexOf("Firefox") > -1, //是否火狐浏览器
					sougou: u.toLowerCase().indexOf('se 2.x') > -1, //是否搜狗浏览器
					iebrowser: window.ActiveXObject || "ActiveXObject" in window, //是否是ie浏览器
					mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端，包含手机和平板
					ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
					android: u.indexOf('Android') > -1, //android终端
					windows: u.indexOf("Windows") > -1, //是否windows系统
					iPhone: u.indexOf('iPhone') > -1, //是否为iPhone手机
					windowsPhone: /(?:Windows Phone)/.test(u), //是否是windows手机
					iPad: u.indexOf('iPad') > -1, //是否iPad平板
					webApp: u.indexOf('Safari') == -1, //是否web应用程序，没有头部与底部
					phone: (u.indexOf('Android') > -1 && /(?:Mobile)/.test(u)) || (u.indexOf('iPhone') > -1) || (
						/(?:Windows Phone)/.test(u)), //判断是否是手机
					tablet: (u.indexOf('iPad') > -1) || (u.indexOf('Android') > -1 && !/(?:Mobile)/.test(u)) || (u.indexOf(
						"Firefox") > -1 && /(?:Tablet)/.test(u)), //平板
					mac: /macintosh|mac os x/i.test(u), //判断是否mac
					win32: u.toLowerCase().indexOf("win32") > -1 || u.toLowerCase().indexOf("wow32") > -1,
					win64: u.toLowerCase().indexOf("win64") > -1 || u.toLowerCase().indexOf("wow64") > -1,
				};
			}(),
			language: (navigator.browserLanguage || navigator.language).toLowerCase()
		}
		let flag = false;
		if (params != null && params != undefined && typeof params == "string") {
			if (params.toLowerCase() == "ie") { //IE内核
				flag = browser.versions.trident;
			} else if (params.toLowerCase() == "opera") { //opera内核
				flag = browser.versions.presto;
			} else if (params.toLowerCase() == "webkit") { //webkit内核
				flag = browser.versions.webKit;
			} else if (params.toLowerCase() == "gecko") { //火狐内核
				flag = browser.versions.gecko;
			} else if (params.toLowerCase() == "mobile") { //移动终端
				flag = browser.versions.mobile;
			} else if (params.toLowerCase() == "ios") { //ios系统
				flag = browser.versions.ios;
			} else if (params.toLowerCase() == "android") { //安卓系统
				flag = browser.versions.android;
			} else if (params.toLowerCase() == "iphone") { //苹果手机
				flag = browser.versions.iPhone;
			} else if (params.toLowerCase() == "ipad") { //ipad
				flag = browser.versions.iPad;
			} else if (params.toLowerCase() == "webapp") { //web应用程序
				flag = browser.versions.webApp;
			} else if (params.toLowerCase() == "weixin") { //微信内置浏览器
				flag = browser.versions.weixin;
			} else if (params.toLowerCase() == "qq") { //QQ内置浏览器
				flag = browser.versions.qq;
			} else if (params.toLowerCase() == "qqbrowser") { //qq浏览器
				flag = browser.versions.qqbrowser;
			} else if (params.toLowerCase() == "language") { //语言类型
				flag = browser.language;
			} else if (params.toLowerCase() == "uc") { //uc浏览器
				flag = browser.versions.uc;
			} else if (params.toLowerCase() == "chrome") { //谷歌浏览器
				flag = browser.versions.chrome;
			} else if (params.toLowerCase() == "firefox") { //火狐浏览器
				flag = browser.versions.firefox;
			} else if (params.toLowerCase() == "sougou") { //搜狗浏览器
				flag = browser.versions.sougou;
			} else if (params.toLowerCase() == "iebrowser") { //ie浏览器
				flag = browser.versions.iebrowser;
			} else if (params.toLowerCase() == "windows") { //windows系统
				flag = browser.versions.windows;
			} else if (params.toLowerCase() == "tablet") { //平板电脑
				flag = browser.versions.tablet;
			} else if (params.toLowerCase() == "phone") { //手机
				flag = browser.versions.phone;
			} else if (params.toLowerCase() == "windowsphone") { //windows手机
				flag = browser.versions.windowsPhone;
			} else if (params.toLowerCase() == "mac") {
				flag = browser.versions.mac;
			} else if (params.toLowerCase() == "win32") {
				flag = browser.versions.win32;
			} else if (params.toLowerCase() == "win64") {
				flag = browser.versions.win64;
			} else {
				flag = null;
			}
		}
		return flag;
	},

	/**
	 * 常用判断
	 * 参数:text为要判断的字符串,params为判断的类型字符串
	 */
	matchingText(text, params) {
		let reg = null;
		//判断text是否为中文
		if (params == "Chinese") {
			reg = /^[\u4e00-\u9fa5]+$/;
		}
		//判断text是否含有中文
		if (params == "chinese") {
			reg = /[\u4e00-\u9fa5]/;
		}
		//判断text是否为邮箱
		if (params == "email") {
			reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		}
		//判断text是否为4-16位的用户名(字母数字下划线)
		if (params == "userName") {
			reg = /^[a-zA-Z0-9_]{4,16}$/;
		}
		//判断text是否为正整数
		if (params == "int+") {
			reg = /^\d+$/;
		}
		//判断text是否为负整数
		if (params == "int-") {
			reg = /^-\d+$/;
		}
		//判断text是否为整数
		if (params == "int") {
			reg = /^-?\d+$/;
		}
		//判断text是否为正数
		if (params == "pos") {
			reg = /^\d*\.?\d+$/;
		}
		//判断text是否为负数
		if (params == "neg") {
			reg = /^-\d*\.?\d+$/;
		}
		//判断text是否为数字
		if (params == "number") {
			reg = /^-?\d*\.?\d+$/;
		}
		//判断text是否为手机号
		if (params == "phone") {
			reg = /^1[0-9]\d{9}$/;
		}
		//判断text是否为身份证号
		if (params == "idCard") {
			reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
		}
		//判断text是否为网址
		if (params == "url") {
			reg = /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
		}
		//判断是否为ip地址
		if (params == "IPv4") {
			reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		}
		//判断是否为十六进制颜色
		if (params == "hex") {
			reg = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
		}
		//判断text是否为日期(./-以及年月日)
		if (params == "date") {
			let reg1 = /^((\d{4})(-)(\d{2})(-)(\d{2}))$/;
			let reg2 = /^(\d{4})(\/)(\d{2})(\/)(\d{2})$/;
			let reg3 = /^(\d{4})(\.)(\d{2})(\.)(\d{2})$/;
			let reg4 = /^(\d{4})(年)(\d{2})(月)(\d{2})(日)$/;
			return reg1.test(text) || reg2.test(text) || reg3.test(text) || reg4.test(text)
		}
		//判断text是否为时间
		if (params == "time") { //如22:22:22
			reg =
				/^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
		}
		//判断text是否为QQ号码
		if (params == "QQ") {
			reg = /^[1-9][0-9]{4,10}$/;
		}
		//判断text是否为微信号,6至20位，以字母开头，字母，数字，减号，下划线
		if (params == "weixin") {
			reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
		}
		//判断text是否为车牌
		if (params == "plate") {
			reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
		}

		return reg.test(text);
	},

	/**
	 * 将base64位格式文件转换为file对象
	 * 参数 base64String  base64位格式字符串
	 * 参数 filename   转换后的文件名字,包含后缀
	 * 返回值为File类型数据
	 */
	dataBase64toFile(base64String, filename) {
		let arr = base64String.split(',');
		let mime = arr[0].match(/:(.*?);/)[1];
		let bstr = atob(arr[1]);
		let n = bstr.length;
		let u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, {
			type: mime,
		});
	},

	/**
	 * @param {Object} file
	 * 将JS file对象转为BASE64位字符串
	 * 通过then方法回调,参数为base64字符串
	 */
	dataFileToBase64(file) {
		return new Promise((reslove, reject)=>{
			let reader = new FileReader();
			reader.readAsDataURL(file); // 读出 base64
			reader.onloadend = ()=> {
				// 图片的 base64 格式, 可以直接当成 img 的 src 属性值        
				let dataURL = reader.result;
				// 下面逻辑处理
				reslove(dataURL);
			};
		})
	},

	/**
	 * 根据参数名获取地址栏参数值
	 */
	getUrlParams(name) {
		let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		let search = window.location.search.substr(1);
		if (!search) {
			let arr = window.location.hash.split("?");
			if (arr.length == 2) {
				search = arr[1]
			}
		}
		let r = search.match(reg);
		if (r) {
			return unescape(r[2])
		}
		return null;
	},

	/**
	 * 获取元素的内容宽度
	 * 内容宽度不包括border和padding
	 * element未指定则表示document.body
	 */
	width(element) {
		if (!this.isElement(element)) {
			element = document.body;
		}
		let clientWidth = element.clientWidth; //获取元素包括内边距在内的宽度
		let paddingLeft_width = parseFloat(this.getCssStyle(element, "padding-left")); //左内边距
		let paddingRight_width = parseFloat(this.getCssStyle(element, "padding-right")); //右内边距宽度
		return clientWidth - paddingLeft_width - paddingRight_width;
	},

	/**
	 * 获取元素的内容高度
	 * 内容高度不包括border和padding
	 * element未指定则表示document.body
	 */
	height(element) {
		if (!this.isElement(element)) {
			element = document.body;
		}
		let clientHeight = element.clientHeight; //获取元素包括内边距在内的高度
		let paddingTop_height = parseFloat(this.getCssStyle(element, "padding-top")); //上内边距
		let paddingBottom_height = parseFloat(this.getCssStyle(element, "padding-bottom")); //下内边距宽度
		return clientHeight - paddingTop_height - paddingBottom_height;
	},

	/**
	 * 根据file文件获取可预览的图片路径
	 */
	getImageUrl(file) {
		return window.URL.createObjectURL(file);
	},

	/**
	 * 获取前N个月的日期
	 */
	getPrevMonths(n, date) {
		let dateArray = new Array(); //日期数组
		let dd = date;
		dateArray.push(dd); //存放指定日期
		for (let i = 0; i < n - 1; i++) {
			let y = dd.getFullYear(); //获取年份
			let m = dd.getMonth(); //获取月份
			if (m == 0) {
				m = 12;
				y--;
			}
			let d = new Date();
			d.setMonth(m - 1);
			d.setFullYear(y);
			dateArray.push(d);
			dd = d;
		}
		return dateArray;
	},

	/**
	 * 获取后N个月的日期
	 */
	getNextMonths(n, date) {
		let dd = date;
		let dateArray = new Array(); //日期数组
		dateArray.push(dd);
		for (let i = 0; i < n - 1; i++) {
			let y = dd.getFullYear(); //获取年份
			let m = dd.getMonth(); //获取月份
			if (m == 11) {
				m = -1;
				y++;
			}
			let d = new Date();
			d.setMonth(m + 1);
			d.setFullYear(y);
			dateArray.push(d);
			dd = d;
		}
		return dateArray;
	},

	/**
	 * 显示当前日期的前一天日期以及后一天日期
	 */
	showTime(date, param) {
		let trans_day = null;
		let cur_date = date;
		let cur_year = cur_date.getFullYear();
		let cur_month = cur_date.getMonth() + 1;
		let real_date = cur_date.getDate();
		cur_month = cur_month > 9 ? cur_month : ("0" + cur_month);
		real_date = real_date > 9 ? real_date : ("0" + real_date);
		let eT = cur_year + "-" + cur_month + "-" + real_date;
		if (param == 1) {
			trans_day = addByTransDate(eT, 1);
		} else if (param == -1) {
			trans_day = reduceByTransDate(eT, 1);
		}

		function addByTransDate(dateParameter, num) {
			let translateDate = "",
				dateString = "",
				monthString = "",
				dayString = "";
			translateDate = dateParameter.replace("-", "/").replace("-", "/");
			let newDate = new Date(translateDate);
			newDate = newDate.valueOf();
			newDate = newDate + num * 24 * 60 * 60 * 1000;
			newDate = new Date(newDate);
			//如果月份长度少于2，则前加 0 补位   
			if ((newDate.getMonth() + 1).toString().length == 1) {
				monthString = 0 + "" + (newDate.getMonth() + 1).toString();
			} else {
				monthString = (newDate.getMonth() + 1).toString();
			}
			//如果天数长度少于2，则前加 0 补位   
			if (newDate.getDate().toString().length == 1) {
				dayString = 0 + "" + newDate.getDate().toString();
			} else {
				dayString = newDate.getDate().toString();
			}
			dateString = new Date(newDate.getFullYear() + "-" + monthString + "-" + dayString);
			return dateString;
		}

		function reduceByTransDate(dateParameter, num) {
			let translateDate = "",
				dateString = "",
				monthString = "",
				dayString = "";
			translateDate = dateParameter.replace("-", "/").replace("-", "/");
			let newDate = new Date(translateDate);
			newDate = newDate.valueOf();
			newDate = newDate - num * 24 * 60 * 60 * 1000;
			newDate = new Date(newDate);
			//如果月份长度少于2，则前加 0 补位   
			if ((newDate.getMonth() + 1).toString().length == 1) {
				monthString = 0 + "" + (newDate.getMonth() + 1).toString();
			} else {
				monthString = (newDate.getMonth() + 1).toString();
			}
			//如果天数长度少于2，则前加 0 补位   
			if (newDate.getDate().toString().length == 1) {
				dayString = 0 + "" + newDate.getDate().toString();
			} else {
				dayString = newDate.getDate().toString();
			}
			dateString = new Date(newDate.getFullYear() + "-" + monthString + "-" + dayString);
			return dateString;
		}

		//处理
		return trans_day;
	},

	/**
	 * 获取某个月的天数
	 * @param {Object} years
	 * @param {Object} month
	 */
	getDays(year, month) {
		year = parseInt(year);
		month = parseInt(month);
		let d = new Date(year, month, 0);
		return d.getDate();
	}

}

export default util
