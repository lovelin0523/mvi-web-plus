//解决ios下伪类无效
(function() {
	//解决ios系统下css伪类无效的问题
	window.addEventListener("touchstart", function() {})
})(window);

//原生Number对象加减乘除修改
(function() {
	/**
	 * @param {Object} num
	 * 乘法
	 */
	Number.prototype.multiplication = function(num) {
		let m = 0;
		let s1 = this.toString();
		let s2 = num.toString();
		try {
			m += s1.split(".")[1].length
		} catch (e) {}
		try {
			m += s2.split(".")[1].length
		} catch (e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
	}
	/**
	 * @param {Object} num
	 * 除法
	 */
	Number.prototype.division = function(num) {
		let t1 = 0;
		let t2 = 0;
		let s1 = this.toString();
		let s2 = num.toString();
		try {
			t1 = s1.split(".")[1].length
		} catch (e) {}
		try {
			t2 = s2.split(".")[1].length
		} catch (e) {}
		s1 = Number(s1.replace(".", ""))
		s2 = Number(s2.replace(".", ""))
		return (s1 / s2) * Math.pow(10, t2 - t1);
	}
	/**
	 * @param {Object} num
	 * 加法
	 */
	Number.prototype.add = function(num) {
		let r1 = 0;
		let r2 = 0;
		let m = 0;
		try {
			r1 = this.toString().split(".")[1].length
		} catch (e) {}
		try {
			r2 = num.toString().split(".")[1].length
		} catch (e) {}
		m = Math.pow(10, Math.max(r1, r2))
		return (this * m + num * m) / m
	}
	
	/**
	 * @param {Object} num
	 * 减法
	 */
	Number.prototype.subtraction = function(num){
		let r1 = 0;
		let r2 = 0;
		let m = 0;
		try {
			r1 = this.toString().split(".")[1].length
		} catch (e) {}
		try {
			r2 = num.toString().split(".")[1].length
		} catch (e) {}
		m = Math.pow(10, Math.max(r1, r2))
		return (this * m - num * m) / m
	}
})(window);

//原生对象原型拓展data方法
(function() {
	"use strict"
	/**
	 * Element原型添加data方法
	 * 该方法绑定在元素对象身上，适用于与该方法相关的数据绑定
	 */
	Element.prototype.data = function(key, value) {
		let _this = this,
			_dataName = "vi", // 存储至DOM上的对象标记为框架名称
			_data = {};
		// 未指定参数,返回全部
		if (typeof key === 'undefined' && typeof value === 'undefined') {
			return _this[_dataName];
		}
		// setter
		if (typeof(value) !== 'undefined') {
			_data = _this[_dataName] || {};
			_data[key] = value;
			_this[_dataName] = _data;
			return this;
		}
		// getter
		else {
			_data = _this[_dataName] || {};
			return _data[key];
		}
	};
	/**
	 * NodeList原型添加data方法
	 */
	NodeList.prototype.data = function(key, value) {
		// setter
		if (typeof(value) !== 'undefined') {
			[].forEach.call(this, function(element, index) {
				element.data(key, value);
			});
			return this;
		}
		// getter
		else {
			return this[0].data(key, value); // getter 将返回第一个
		}
	};
	/**
	 * HTMLConllection原型添加data方法
	 */
	HTMLCollection.prototype.data = function(key, value) {
		// setter
		if (typeof(value) !== 'undefined') {
			[].forEach.call(this, function(element, index) {
				element.data(key, value);
			});
			return this;
		}
		// getter
		else {
			return this[0].data(key, value); // getter 将返回第一个
		}
	}
})(window)
