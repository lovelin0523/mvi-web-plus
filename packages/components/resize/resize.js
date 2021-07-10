import $util from "../../util/util"
/**
 * 拖拽改变元素大小
 */
class Resize {
	constructor(element, options) {
		this.$el = element;
		if(!$util.isObject(options)){
			options = {};
		}
		this.draggableX = options.draggableX;
		this.draggableY = options.draggableY;
		this.mode = options.mode; //拖拽模式
		this.beforeResize = options.beforeResize; //元素大小改变之前触发
		this.resize = options.resize; //元素大小改变时触发
		this.trigger = options.trigger; //按下触发时触发
		this.end = options.end; //大小改变之后
		this.ready = options.ready; //初始化完成回调
		this.range = options.range;//可拖动的范围直径
		this.draggable = false; //是否可拖动的标识
		this.leftRange = {}; //左侧可拖动范围
		this.rightRange = {}; //右侧可拖动范围
		this.topRange = {}; //顶部可拖动范围
		this.bottomRange = {}; //底部可拖动范围
		this.leftTopRange = {}; //左上可拖动范围
		this.rightTopRange = {}; //右上可拖动范围
		this.leftBottomRange = {}; //左下可拖动范围
		this.rightBottomRange = {}; //右下可拖动范围
		this.startX = 0; //水平开始的位置
		this.satrtY = 0; //垂直开始的位置
		this._width = 0; //元素宽度
		this._height = 0; //元素高度
		this._left = 0; //元素left
		this._right = 0; //元素right
		this.hasInit = false; //是否初始化
		this.cursor = '';//记录原先的鼠标样式
	}

	//初始化
	init() {
		if (this.hasInit) {
			return;
		}
		this.hasInit = true;
		if (typeof this.draggableX != "boolean") {
			this.draggableX = true;
		}
		if (typeof this.draggableY != "boolean") {
			this.draggableY = true;
		}
		if (!$util.isObject(this.mode)) {
			this.mode = {
				left: Resize.MODE.LEFT,
				top: Resize.MODE.TOP,
				bottom: Resize.MODE.BOTTOM,
				right: Resize.MODE.RIGHT
			}
		} else {
			if (typeof this.mode.left != "boolean") {
				this.mode.left = Resize.MODE.LEFT;
			}
			if (typeof this.mode.top != "boolean") {
				this.mode.top = Resize.MODE.TOP;
			}
			if (typeof this.mode.bottom != "boolean") {
				this.mode.bottom = Resize.MODE.BOTTOM;
			}
			if (typeof this.mode.right != "boolean") {
				this.mode.right = Resize.MODE.RIGHT;
			}
		}
		if (typeof this.beforeResize != "function") {
			this.beforeResize = function() {};
		}

		if (typeof this.resize != "function") {
			this.resize = function() {};
		}

		if (typeof this.trigger != "function") {
			this.trigger = function() {};
		}

		if (typeof this.end != "function") {
			this.end = function() {};
		}

		if (typeof this.ready != "function") {
			this.ready = function() {};
		}
		
		if(!$util.isNumber(this.range)){
			this.range = 1;
		}
		
		//添加在body上的鼠标移动事件
		this._bodyMouseMove = e=>{
			let endX = e.pageX;
			let endY = e.pageY;
			this._move(e,endX,endY);
		}
		
		//添加在body上的鼠标离开事件
		this._bodyMouseLeave = e=>{
			this._leave(e);
		}

		//设置可拖动的范围
		this._setRange();

		//设置拖动事件
		this._setOn();

		//初始化完成回调
		this.ready(this);
	}

	//设置可拖动的范围
	_setRange() {
		let range = this.$el.getBoundingClientRect();
		if (this.draggableX && this.draggableY) {
			this.leftRange = {
				x: [range.left, range.left + $util.rem2px(this.range)],
				y: [range.top + $util.rem2px(this.range), range.bottom - $util.rem2px(this.range)]
			}
			this.rightRange = {
				x: [range.right - $util.rem2px(this.range), range.right],
				y: [range.top + $util.rem2px(this.range), range.bottom - $util.rem2px(this.range)]
			}
			this.topRange = {
				x: [range.left + $util.rem2px(this.range), range.right - $util.rem2px(this.range)],
				y: [range.top, range.top + $util.rem2px(this.range)]
			}
			this.bottomRange = {
				x: [range.left + $util.rem2px(this.range), range.right - $util.rem2px(this.range)],
				y: [range.bottom - $util.rem2px(this.range), range.bottom]
			}
			this.leftTopRange = {
				x: [range.left, range.left + $util.rem2px(this.range)],
				y: [range.top, range.top + $util.rem2px(this.range)]
			}
			this.leftBottomRange = {
				x: [range.left, range.left + $util.rem2px(this.range)],
				y: [range.bottom - $util.rem2px(this.range), range.bottom]
			}
			this.rightTopRange = {
				x: [range.right - $util.rem2px(this.range), range.right],
				y: [range.top, range.top + $util.rem2px(this.range)]
			}
			this.rightBottomRange = {
				x: [range.right - $util.rem2px(this.range), range.right],
				y: [range.bottom - $util.rem2px(this.range), range.bottom]
			}
		} else if (this.draggableX) {
			this.leftRange = {
				x: [range.left, range.left + $util.rem2px(this.range)],
				y: [range.top, range.bottom]
			}
			this.rightRange = {
				x: [range.right - $util.rem2px(this.range), range.right],
				y: [range.top, range.bottom]
			}
		} else if (this.draggableY) {
			this.topRange = {
				x: [range.left, range.right],
				y: [range.top, range.top + $util.rem2px(this.range)]
			}
			this.bottomRange = {
				x: [range.left, range.right],
				y: [range.bottom - $util.rem2px(this.range), range.bottom]
			}
		}
	}

	///判断点击的点是否在指定区域范围内
	_getIsInRange(x, y, range) {
		let conditions1 = (x >= range.x[0] && x <= range.x[1]);
		let conditions2 = (y >= range.y[0] && y <= range.y[1]);
		if (conditions1 && conditions2) {
			return true;
		} else {
			return false;
		}
	}

	//移动端触摸按下或者PC端鼠标按下
	_down(e) {
		this._width = this.$el.offsetWidth;
		this._height = this.$el.offsetHeight;
		this._left = this.$el.offsetLeft;
		this._top = this.$el.offsetTop;
		this.cursor = $util.getCssStyle(this.$el,'cursor');
		//宽高都可以改
		if (this.draggableX && this.draggableY) {
			if (this._getIsInRange(this.startX, this.startY, this.leftTopRange)) { //左上区域内
				if (this.mode.left || this.mode.top) {
					this.draggable = true;
					this.$el.style.cursor = 'nw-resize';
					this.trigger({
						event: e,
						area: Resize.AREA.LEFTTOP
					});
				}
			} else if (this._getIsInRange(this.startX, this.startY, this.leftBottomRange)) { //左下区域内
				if (this.mode.left || this.mode.bottom) {
					this.draggable = true;
					this.$el.style.cursor = 'sw-resize';
					this.trigger({
						event: e,
						area: Resize.AREA.LEFTBOTTOM
					});
				}
			} else if (this._getIsInRange(this.startX, this.startY, this.rightTopRange)) { //右上区域内
				if (this.mode.right || this.mode.top) {
					this.draggable = true;
					this.$el.style.cursor = 'ne-resize';
					this.trigger({
						event: e,
						area: Resize.AREA.RIGHTTOP
					});
				}
			} else if (this._getIsInRange(this.startX, this.startY, this.rightBottomRange)) { //右下区域内
				if (this.mode.right || this.mode.bottom) {
					this.draggable = true;
					this.$el.style.cursor = 'se-resize';
					this.trigger({
						event: e,
						area: Resize.AREA.RIGHTBOTTOM
					});
				}
			} else if (this._getIsInRange(this.startX, this.startY, this.leftRange)) { //左侧区域内
				if (this.mode.left) {
					this.draggable = true;
					this.$el.style.cursor = 'w-resize';
					this.trigger({
						event: e,
						area: Resize.AREA.LEFT
					});
				}
			} else if (this._getIsInRange(this.startX, this.startY, this.rightRange)) { //右侧区域内
				if (this.mode.right) {
					this.draggable = true;
					this.$el.style.cursor = 'e-resize';
					this.trigger({
						event: e,
						area: Resize.AREA.RIGHT
					});
				}
			} else if (this._getIsInRange(this.startX, this.startY, this.topRange)) { //顶部区域内
				if (this.mode.top) {
					this.draggable = true;
					this.$el.style.cursor = 'n-resize';
					this.trigger({
						event: e,
						area: Resize.AREA.TOP
					});
				}
			} else if (this._getIsInRange(this.startX, this.startY, this.bottomRange)) { //底部区域内
				if (this.mode.bottom) {
					this.draggable = true;
					this.$el.style.cursor = 's-resize';
					this.trigger({
						event: e,
						area: Resize.AREA.BOTTOM
					});
				}
			}
		} else if (this.draggableX) { //只可以改变元素宽度
			if (this._getIsInRange(this.startX, this.startY, this.leftRange)) { //左侧区域内
				if (this.mode.left) {
					this.draggable = true;
					this.$el.style.cursor = 'w-resize';
					this.trigger({
						event: e,
						area: Resize.AREA.LEFT
					});
				}
			} else if (this._getIsInRange(this.startX, this.startY, this.rightRange)) { //右侧区域内
				if (this.mode.right) {
					this.draggable = true;
					this.$el.style.cursor = 'e-resize';
					this.trigger({
						event: e,
						area: Resize.AREA.RIGHT
					});
				}
			}
		} else if (this.draggableY) { //只可以改变元素高度
			if (this._getIsInRange(this.startX, this.startY, this.topRange)) { //顶部区域内
				if (this.mode.top) {
					this.draggable = true;
					this.$el.style.cursor = 'n-resize';
					this.trigger({
						event: e,
						area: Resize.AREA.TOP
					});
				}
			} else if (this._getIsInRange(this.startX, this.startY, this.bottomRange)) { //底部区域内
				if (this.mode.bottom) {
					this.draggable = true;
					this.$el.style.cursor = 's-resize';
					this.trigger({
						event: e,
						area: Resize.AREA.BOTTOM
					});
				}
			}
		}
	}

	//移动端触摸滑动或者PC端鼠标拖动
	_move(e,endX,endY) {
		if (this.draggable) {
			let moveX = endX - this.startX;
			let moveY = endY - this.startY;
			//宽高都可以改
			if (this.draggableX && this.draggableY) {
				if (this._getIsInRange(this.startX, this.startY, this.leftTopRange)) { //左上区域内
					if (this.mode.left || this.mode.top) {
						if (this.beforeResize({
								event: e,
								area: Resize.AREA.LEFTTOP,
								width: this.$el.offsetWidth,
								height: this.$el.offsetHeight
							}) == false) {
							return;
						}
					}
					if (this.mode.left) {
						this.$el.style.width = this._width - moveX + "px";
						this.$el.style.left = this._left + moveX + "px";
					}
					if (this.mode.top) {
						this.$el.style.height = this._height - moveY + "px";
						this.$el.style.top = this._top + moveY + "px";
					}
					if (this.mode.left || this.mode.top) {
						this.resize({
							area: Resize.AREA.LEFTTOP,
							event: e,
							width: this.$el.offsetWidth,
							height: this.$el.offsetHeight
						});
					}
				} else if (this._getIsInRange(this.startX, this.startY, this.leftBottomRange)) { //左下区域内
					if (this.mode.left || this.mode.bottom) {
						if (this.beforeResize({
								area: Resize.AREA.LEFTBOTTOM,
								event: e,
								width: this.$el.offsetWidth,
								height: this.$el.offsetHeight
							}) == false) {
							return;
						}
					}
					if (this.mode.left) {
						this.$el.style.width = this._width - moveX + "px";
						this.$el.style.left = this._left + moveX + "px";
					}
					if (this.mode.bottom) {
						this.$el.style.height = this._height + moveY + "px";
					}
					if (this.mode.left || this.mode.bottom) {
						this.resize({
							area: Resize.AREA.LEFTBOTTOM,
							event: e,
							width: this.$el.offsetWidth,
							height: this.$el.offsetHeight
						});
					}
				} else if (this._getIsInRange(this.startX, this.startY, this.rightTopRange)) { //右上区域内
					if (this.mode.right || this.mode.top) {
						if (this.beforeResize({
								area: Resize.AREA.RIGHTTOP,
								event: e,
								width: this.$el.offsetWidth,
								height: this.$el.offsetHeight
							}) == false) {
							return;
						}
					}
					if (this.mode.right) {
						this.$el.style.width = this._width + moveX + "px";
					}
					if (this.mode.top) {
						this.$el.style.height = this._height - moveY + "px";
						this.$el.style.top = this._top + moveY + "px";
					}
					if (this.mode.top || this.mode.right) {
						this.resize({
							area: Resize.AREA.RIGHTTOP,
							event: e,
							width: this.$el.offsetWidth,
							height: this.$el.offsetHeight
						});
					}
				} else if (this._getIsInRange(this.startX, this.startY, this.rightBottomRange)) { //右下区域内
					if (this.mode.right || this.mode.bottom) {
						if (this.beforeResize({
								area: Resize.AREA.RIGHTBOTTOM,
								event: e,
								width: this.$el.offsetWidth,
								height: this.$el.offsetHeight
							}) == false) {
							return;
						}
					}
					if (this.mode.right) {
						this.$el.style.width = this._width + moveX + "px";
					}
					if (this.mode.bottom) {
						this.$el.style.height = this._height + moveY + "px";
					}
					if (this.mode.right || this.mode.bottom) {
						this.resize({
							area: Resize.AREA.RIGHTBOTTOM,
							event: e,
							width: this.$el.offsetWidth,
							height: this.$el.offsetHeight
						});
					}
				} else if (this._getIsInRange(this.startX, this.startY, this.leftRange)) { //左侧区域内
					if (this.mode.left) {
						if (this.beforeResize({
								area: Resize.AREA.LEFT,
								event: e,
								width: this.$el.offsetWidth,
								height: this.$el.offsetHeight
							}) == false) {
							return;
						}
						this.$el.style.width = this._width - moveX + "px";
						this.$el.style.left = this._left + moveX + "px";
						this.resize({
							area: Resize.AREA.LEFT,
							event: e,
							width: this.$el.offsetWidth,
							height: this.$el.offsetHeight
						});
					}
				} else if (this._getIsInRange(this.startX, this.startY, this.rightRange)) { //右侧区域内
					if (this.mode.right) {
						if (this.beforeResize({
								area: Resize.AREA.RIGHT,
								event: e,
								width: this.$el.offsetWidth,
								height: this.$el.offsetHeight
							}) == false) {
							return;
						}
						this.$el.style.width = this._width + moveX + "px";
						this.resize({
							area: Resize.AREA.RIGHT,
							event: e,
							width: this.$el.offsetWidth,
							height: this.$el.offsetHeight
						});
					}
				} else if (this._getIsInRange(this.startX, this.startY, this.topRange)) { //顶部区域内
					if (this.mode.top) {
						if (this.beforeResize({
								area: Resize.AREA.TOP,
								event: e,
								width: this.$el.offsetWidth,
								height: this.$el.offsetHeight
							}) == false) {
							return;
						}
						this.$el.style.height = this._height - moveY + "px";
						this.$el.style.top = this._top + moveY + "px";
						this.resize({
							area: Resize.AREA.TOP,
							event: e,
							width: this.$el.offsetWidth,
							height: this.$el.offsetHeight
						});
					}
				} else if (this._getIsInRange(this.startX, this.startY, this.bottomRange)) { //底部区域内
					if (this.mode.bottom) {
						if (this.beforeResize({
								area: Resize.AREA.BOTTOM,
								event: e,
								width: this.$el.offsetWidth,
								height: this.$el.offsetHeight
							}) == false) {
							return;
						}
						this.$el.style.height = this._height + moveY + "px";
						this.resize({
							area: Resize.AREA.BOTTOM,
							event: e,
							width: this.$el.offsetWidth,
							height: this.$el.offsetHeight
						});
					}
				}
			} else if (this.draggableX) { //可以改变宽度
				if (this._getIsInRange(this.startX, this.startY, this.leftRange)) { //左侧区域内
					if (this.mode.left) {
						if (this.beforeResize({
								area: Resize.AREA.LEFT,
								event: e,
								width: this.$el.offsetWidth,
								height: this.$el.offsetHeight
							}) == false) {
							return;
						}
						this.$el.style.width = this._width - moveX + "px";
						this.$el.style.left = this._left + moveX + "px";
						this.resize({
							area: Resize.AREA.LEFT,
							event: e,
							width: this.$el.offsetWidth,
							height: this.$el.offsetHeight
						});
					}
				} else if (this._getIsInRange(this.startX, this.startY, this.rightRange)) { //右侧区域内
					if (this.mode.right) {
						if (this.beforeResize({
								area: Resize.AREA.RIGHT,
								event: e,
								width: this.$el.offsetWidth,
								height: this.$el.offsetHeight
							}) == false) {
							return;
						}
						this.$el.style.width = this._width + moveX + "px";
						this.resize({
							area: Resize.AREA.RIGHT,
							event: e,
							width: this.$el.offsetWidth,
							height: this.$el.offsetHeight
						});
					}
				}
			} else if (this.draggableY) { //可以改变元素高度
				if (this._getIsInRange(this.startX, this.startY, this.topRange)) { //顶部区域内
					if (this.mode.top) {
						if (this.beforeResize({
								area: Resize.AREA.TOP,
								event: e,
								width: this.$el.offsetWidth,
								height: this.$el.offsetHeight
							}) == false) {
							return;
						}
						this.$el.style.height = this._height - moveY + "px";
						this.$el.style.top = this._top + moveY + "px";
						this.resize({
							area: Resize.AREA.TOP,
							event: e,
							width: this.$el.offsetWidth,
							height: this.$el.offsetHeight
						});
					}
				} else if (this._getIsInRange(this.startX, this.startY, this.bottomRange)) { //底部区域内
					if (this.mode.bottom) {
						if (this.beforeResize({
								area: Resize.AREA.BOTTOM,
								event: e,
								width: this.$el.offsetWidth,
								height: this.$el.offsetHeight
							}) == false) {
							return;
						}
						this.$el.style.height = this._height + moveY + "px";
						this.resize({
							area: Resize.AREA.BOTTOM,
							event: e,
							width: this.$el.offsetWidth,
							height: this.$el.offsetHeight
						});
					}
				}
			}
		}
	}

	//移动端触摸松开或者PC端鼠标松开
	_leave(e){
		if (this.draggable) {
			this.$el.style.cursor = this.cursor;
			this.draggable = false;
			if (this.draggableX && this.draggableY) {
				if (this._getIsInRange(this.startX, this.startY, this.leftTopRange)) { //左上区域
					this.end({
						event: e,
						area: Resize.AREA.LEFTTOP
					})
				} else if (this._getIsInRange(this.startX, this.startY, this.leftBottomRange)) { //左下区域
					this.end({
						event: e,
						area: Resize.AREA.LEFTBOTTOM
					})
				} else if (this._getIsInRange(this.startX, this.startY, this.rightTopRange)) { //右上区域
					this.end({
						event: e,
						area: Resize.AREA.RIGHTTOP
					})
				} else if (this._getIsInRange(this.startX, this.startY, this.rightBottomRange)) { //右下区域
					this.end({
						event: e,
						area: Resize.AREA.RIGHTBOTTOM
					})
				} else if (this._getIsInRange(this.startX, this.startY, this.leftRange)) { //左侧区域
					this.end({
						event: e,
						area: Resize.AREA.LEFT
					})
				} else if (this._getIsInRange(this.startX, this.startY, this.rightRange)) { //右侧区域
					this.end({
						event: e,
						area: Resize.AREA.RIGHT
					})
				} else if (this._getIsInRange(this.startX, this.startY, this.topRange)) { //上侧区域
					this.end({
						event: e,
						area: Resize.AREA.TOP
					})
				} else if (this._getIsInRange(this.startX, this.startY, this.bottomRange)) { //下侧区域
					this.end({
						event: e,
						area: Resize.AREA.BOTTOM
					})
				}
			} else if (this.draggableX) {
				if (this._getIsInRange(this.startX, this.startY, this.leftRange)) { //左侧区域
					this.end({
						event: e,
						area: Resize.AREA.LEFT
					})
				} else if (this._getIsInRange(this.startX, this.startY, this.rightRange)) { //右侧区域
					this.end({
						event: e,
						area: Resize.AREA.RIGHT
					})
				}
			} else if (this.draggableY) {
				if (this._getIsInRange(this.startX, this.startY, this.topRange)) { //上侧区域
					this.end({
						event: e,
						area: Resize.AREA.TOP
					})
				} else if (this._getIsInRange(this.startX, this.startY, this.bottomRange)) { //下侧区域
					this.end({
						event: e,
						area: Resize.AREA.BOTTOM
					})
				}
			}
			this._setRange();
		}
	}

	//设置拖动事件
	_setOn(){
		this.$el.addEventListener('touchstart', e=>{
			this.startX = e.targetTouches[0].pageX;
			this.startY = e.targetTouches[0].pageY;
			this._down(e);
		})
		this.$el.addEventListener('touchmove',e=>{
			if (e.cancelable) {
				e.preventDefault();
			}
			let endX = e.targetTouches[0].pageX;
			let endY = e.targetTouches[0].pageY;
			this._move(e,endX,endY);
		})
		this.$el.addEventListener('touchend',e=>{
			this._leave(e);
		})
		this.$el.addEventListener('mousedown',e=>{
			this.startX = e.pageX;
			this.startY = e.pageY;
			this._down(e);
		})
		document.body.addEventListener('mousemove',this._bodyMouseMove);
		document.body.addEventListener('mouseup',this._bodyMouseLeave);
	}
	
	//移除body上的拖动事件
	_setOff(){
		document.body.removeEventListener('mousemove',this._bodyMouseMove);
		document.body.removeEventListener('mouseup',this._bodyMouseLeave);
	}
	
	//设置水平方向不可拖拽改变大小
	disabledDragX(){
		this.draggableX = false;
		this._setRange();
	}
	
	//设置垂直方向不可拖拽改变大小
	disabledDragY(){
		this.draggableY = false;
		this._setRange();
	}
	
	//设置水平方向可拖拽改变大小
	enabledDragX(){
		this.draggableX = true;
		this._setRange();
	}
	
	//设置垂直方向可拖拽改变大小
	enabledDragY(){
		this.draggableY = true;
		this._setRange();
	}
}

//拖动的区域范围
Resize.AREA = {
	LEFT: 0,
	TOP: 1,
	RIGHT: 2,
	BOTTOM: 3,
	LEFTTOP: 4,
	LEFTBOTTOM: 5,
	RIGHTTOP: 6,
	RIGHTBOTTOM: 7
}

//模式默认值
Resize.MODE = {
	LEFT: true,
	TOP: true,
	BOTTOM: true,
	RIGHT: true
}

export default Resize
