/**
 * @description 包含事件监听、移除和模拟事件触发的事件机制，支持链式调用
 * @author Kayo Lee(kayosite.com)
 * @create 2014-07-24
 *
 */
 
(function( window, undefined ){
 
    var Ev = window.Ev = window.$ = function(element){

	return new Ev.fn.init(element);
    };

    // Ev 对象构建

    Ev.fn = Ev.prototype = {

	init: function(element){

	    this.element = (element && element.nodeType == 1)? element: document;
	},

	/**
	* 添加事件监听
	* 
	* @param {String} type 监听的事件类型
	* @param {Function} callback 回调函数
	*/

	add: function(type, callback){

	    var _that = this;

	    if(_that.element.addEventListener){

		/**
		* @supported For Modern Browers and IE9+
		*/

		_that.element.addEventListener(type, callback, false);

	    } else if(_that.element.attachEvent){

		/**
		* @supported For IE5+
		*/

		// 自定义事件处理
		if( type.indexOf('custom') != -1 ){

		    if( isNaN( _that.element[type] ) ){

			_that.element[type] = 0;

		    } 

		    var fnEv = function(event){

			event = event ? event : window.event

			if( event.propertyName == type ){
			    callback.call(_that.element);
			}
		    };

		    _that.element.attachEvent('onpropertychange', fnEv);

		    // 在元素上存储绑定的 propertychange 的回调，方便移除事件绑定
		    if( !_that.element['callback' + callback] ){

			_that.element['callback' + callback] = fnEv;

		    }

		// 标准事件处理
		} else {

		    _that.element.attachEvent('on' + type, callback);
		}

	    } else {

		/**
		* @supported For Others
		*/

		_that.element['on' + type] = callback;

	    }

	    return _that;
	},

	/**
	* 移除事件监听
	* 
	* @param {String} type 监听的事件类型
	* @param {Function} callback 回调函数
	*/

	remove: function(type, callback){

	    var _that = this;

	    if(_that.element.removeEventListener){

		/**
		* @supported For Modern Browers and IE9+
		*/

		_that.element.removeEventListener(type, callback, false);

	    } else if(_that.element.detachEvent){

		/**
		* @supported For IE5+
		*/

		// 自定义事件处理
		if( type.indexOf('custom') != -1 ){

		    // 移除对相应的自定义属性的监听
		    _that.element.detachEvent('onpropertychange', _that.element['callback' + callback]);

		    // 删除储存在 DOM 上的自定义事件的回调
		    _that.element['callback' + callback] = null;

		// 标准事件的处理
		} else {

		    _that.element.detachEvent('on' + type, callback);

		}

	    } else {

		/**
		* @supported For Others
		*/

		_that.element['on' + type] = null;

	    }

	    return _that;

	},

	/**
	* 模拟触发事件
	* @param {String} type 模拟触发事件的事件类型
	* @return {Object} 返回当前的 Kjs 对象
	*/

	trigger: function(type){

	    var _that = this;

	    try {
		    // 现代浏览器
		if(_that.element.dispatchEvent){
		    // 创建事件
		    var evt = document.createEvent('Event');
		    // 定义事件的类型
		    evt.initEvent(type, true, true);
		    // 触发事件
		    _that.element.dispatchEvent(evt);
		// IE
		} else if(_that.element.fireEvent){

		    if( type.indexOf('custom') != -1 ){

			_that.element[type]++;

		    } else {

			_that.element.fireEvent('on' + type);
		    }

		}

	    } catch(e){

	    };

	    return _that;

	}
    };

    Ev.fn.init.prototype = Ev.fn;
 
})( window );
