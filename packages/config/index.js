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
	/**
	 * Element原型添加data方法
	 * 该方法绑定在元素对象身上，适用于与该方法相关的数据绑定
	 */
	Element.prototype.data = function(key, value) {
		let _dataName = "mvi_data"; // 存储至DOM上的对象标记
		let _data = {};
		// 未指定参数,返回全部
		if (typeof key === 'undefined' && typeof value === 'undefined') {
			return this[_dataName];
		}
		// setter
		if (typeof value !== 'undefined') {
			_data = this[_dataName] || {};
			_data[key] = value;
			this[_dataName] = _data;
			return this;
		}
		// getter
		else {
			_data = this[_dataName] || {};
			return _data[key];
		}
	};
	/**
	 * NodeList原型添加data方法
	 */
	NodeList.prototype.data = function(key, value) {
		// setter
		if (typeof value !== 'undefined') {
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
		if (typeof value !== 'undefined') {
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
	 * window对象添加data方法
	 */
	Window.prototype.data = Element.prototype.data;
	
})(window);

//原生DOM事件绑定机制
(function(){
	/**
	 * 解析绑定事件名称字符串
	 * @param {Object} eventName
	 */
	const parseEventName = function(eventName){
		//先以空格划分
		let eventNames = eventName.split(/[\s]+/g);
		let result = [];
		eventNames.forEach(name=>{
			let arr = name.split('.');
			let obj = {
				eventName:arr[0]
			}
			if(arr.length > 1){
				obj.guid = arr[1];
			}
			result.push(obj)
		})
		return result;
	}
	
	/**
	 * 更新事件对象，移除空的元素
	 * @param {Object} events 事件对象
	 */
	const updateEvents = function(events){
		let obj = {};
		let keys = Object.keys(events);
		keys.forEach(key=>{
			if(events[key]){
				obj[key] = events[key];
			}
		})
		return obj;
	}
	
	/**
	 * 给元素添加单个事件
	 * this指向元素
	 * @param {Object} eventName 事件名称
	 * @param {Object} guid 修饰符，可能没有
	 * @param {Object} fn 执行函数
	 */
	const bindSingleListener = function(eventName,guid,fn){
		//获取该元素上的事件对象events:{click_0:{type:'click',fn:fn}}
		let events = this.data('mvi-defined-events');
		if(!events){
			events = {};
		}
		//如果没有设定guid
		if(!guid){
			guid = this.data('mvi-event-guid') || 0;//从该元素上拿到记录的guid值
			//更新guid
			this.data('mvi-event-guid',guid+1)
		}
		//更改guid，结合事件名称作为存储的key值
		guid = eventName + '_' + guid;
		//先判断是否已经含有同guid且同类型事件，有则移除
		if(events[guid] && events[guid].type == eventName){
			this.removeEventListener(eventName,events[guid].fn,false);
		}
		//添加事件
		this.addEventListener(eventName,fn,false);
		//添加到events对象里，并更新到节点上
		events[guid] = {
			type:eventName,
			fn:fn
		}
		this.data('mvi-defined-events',events);
	}
	
	/**
	 * 移除元素的单个事件
	 * this指向元素
	 * @param {Object} eventName 事件名称
	 * @param {Object} guid 修饰符，可能没有
	 */
	const unbindSingleListener = function(eventName,guid){
		let events = this.data('mvi-defined-events');
		let keys = Object.keys(events);
		let length = keys.length;
		for(let i = 0;i<length;i++){
			let key = keys[i];
			if(events[key].type == eventName){
				//如果guid存在则移除该修饰符指定的事件，否则移除全部该类型事件
				if(guid){
					if(key ==  eventName + '_' + guid){
						this.removeEventListener(events[key].type,events[key].fn,false);
						events[key] = undefined;
					}
				}else {
					this.removeEventListener(events[key].type,events[key].fn,false);
					events[key] = undefined;
				}
			}
		}
		//更新events
		events = updateEvents(events)
		this.data('mvi-defined-events',events)
	}
	
	/**
	 * 绑定事件
	 * @param {Object} eventName 事件名称，可加后缀，多个事件名称以空格分开
	 * @param {Object} fn 执行函数
	 */
	Element.prototype.on = function(eventName,fn){
		//参数eventName校验
		if(!eventName || typeof eventName != 'string'){
			throw new TypeError('The first argument must be a string');
		}
		//参数fn校验
		if(!fn || typeof fn != 'function'){
			throw new TypeError('The second argument must be a function');
		}
		//解析eventName，获取事件数组以及guid标志
		const result = parseEventName(eventName);
		//批量添加事件
		result.forEach(res=>{
			bindSingleListener.apply(this,[res.eventName,res.guid,fn.bind(this)])
		})
	}

	/**
	 * 移除事件
	 * @param {Object} eventName 事件名称，可加后缀，多个事件名称以空格分开
	 */
	Element.prototype.off = function(eventName){
		let events = this.data('mvi-defined-events');
		if(!events){
			return;
		}
		//事件名称不存在，则移除该元素的全部事件
		if(!eventName){
			let keys = Object.keys(events);
			let length = keys.length;
			for(let i = 0;i<length;i++){
				let key = keys[i];
				this.removeEventListener(events[key].type,events[key].fn,false);
			}
			//重置数据
			this.data('mvi-defined-events',{});
			this.data('mvi-event-guid',0);
			return;
		}
		//解析eventName，获取事件数组以及guid标志
		const result = parseEventName(eventName);
		result.forEach(res=>{
			unbindSingleListener.apply(this,[res.eventName,res.guid]);
		})
	}

	/**
	 * window对象绑定事件
	 */
	Window.prototype.on = Element.prototype.on;
	
	/**
	 * window对象移除事件
	 */
	Window.prototype.off = Element.prototype.off;

})(window);

//解决ios下伪类无效
(function() {
	//解决ios系统下css伪类无效的问题
	window.on("touchstart.mvi", function() {})
})(window);