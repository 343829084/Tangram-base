/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: wuliang
	author: JK
*/

/**
 * @class FunctionH ���Ķ���Function����չ
 * @singleton 
 * @namespace QW
 * @helper
 */
(function(){

var FunctionH = {
	/**
	* ������װ�� methodize���Ժ�������methodize����ʹ��ĵ�һ������Ϊthis����this[attr]��
	* @method methodize
	* @static
	* @param {func} Ҫ�������ĺ���
	* @optional {string} attr ����
	* @return {function} �ѷ������ĺ���
	*/
	methodize: function(func,attr){
		if(attr) return function(){
			return func.apply(null,[this[attr]].concat([].slice.call(arguments)));
		};
		return function(){
			return func.apply(null,[this].concat([].slice.call(arguments)));
		};
	},
	/**
	* methodize�ķ������
	* @method unmethodize
	* @static
	* @param {func} Ҫ���������ĺ���
	* @optional {string} attr ����
	* @return {function} �ѷ��������ĺ���
	*/
	unmethodize: function(func, attr){
		if(attr) return function(owner){
			return func.apply(owner[attr],[].slice.call(arguments, 1));
		};
		return function(owner){
			return func.apply(owner,[].slice.call(arguments, 1));
		};
	},
	/**
	* �Ժ������м�����ʹ���ڵ�һ������Ϊarrayʱ�����Ҳ����һ������
	* @method mul
	* @static
	* @param {func} 
	* @return {Object} �Ѽ����ĺ���
	*/
	mul: function(func, recursive){
		var newFunc = function(){
			var list = arguments[0], fn = recursive ? newFunc : func;

			if(list instanceof Array){
				var ret = [];
				var moreArgs = [].slice.call(arguments,0);
				for(var i = 0, len = list.length; i < len; i++){
					moreArgs[0]=list[i];
					var r = fn.apply(this, moreArgs);
					ret.push(r); 	
				}
				return ret;
			}else{
				return func.apply(this, arguments);
			}
		}
		return newFunc;
	},
	/**
	* ������װ�任
	* @method rwrap
	* @static
	* @param {func} 
	* @return {Function}
	*/
	rwrap: function(func,wrapper,idx){
		idx = idx | 0;
		return function(){ 
			var ret = func.apply(this,arguments); 
			if(idx >= 0)
				return new wrapper(arguments[idx]);
			else if(ret != null)
				return new wrapper(ret);
			return ret;
		}
	},
	/**
	* ��
	* @method bind
	* @static
	* @param {func} 
	* @return {Function}
	*/
	bind: function(func, thisObj){
		return function(){
			return func.apply(thisObj, arguments);
		}
	},
	/** 
	* ����ִ��ĳ������һֱ�����ò�ִ�е�ʱ���ִ�С�
	* @method lazyApply
	* @static
	* @param {Function} fun  ���ú���
	* @param {Object} thisObj  �൱��apply������thisObj����
	* @param {Array} argArray  �൱��apply������argArray����
	* @param {int} ims  interval����������window.setInterval�ĵڶ�������.
	* @param {Function} checker  �������е��жϺ������������Ĳ���Ϊ��checker.call(thisObj,argArray,ims,checker)��<br/>
		���ڲ�ͬ�ķ���ֵ���õ���ͬ�Ľ����<br/>
			����true��1����ʾ��Ҫ����ִ��<br/>
			����-1����ʾ�ɹ�͵����������ִ��<br/>
			��������ֵ����ʾ��ʱ��ִ��<br/>
	@return {int}  ����interval��timerId
	*/
	lazyApply:function(fun,thisObj,argArray,ims,checker){
		var timer=function(){
			var verdict=checker.call(thisObj,argArray,ims,timerId);
			if(verdict==1){
				fun.apply(thisObj,argArray||[]);
			}
			if(verdict==1 || verdict==-1){
				clearInterval(timerId);
			}
		};
		var timerId=setInterval(timer,ims);
		return timerId;
	}
};

QW.FunctionH=FunctionH;

})();



