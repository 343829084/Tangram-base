/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: wuliang
*/

/**
 * @class ClassH Ϊfunction�ṩǿ����ԭ�ͼ̳�������(��ļ̳У���JS��һ�������js����������ǣ�Ҳû�������Ľ����������ϯ�С�)
 * @singleton 
 * @namespace QW
 * @helper
 */

(function(){

var ClassH = {
	/**
	 * ������װ�� extend
	 * <p>�Ľ��Ķ���ԭ�ͼ̳У��ӳ�ִ�в������죬���������ʵ���������$super��$class����</p>
	 * @method extend
	 * @static
	 * @param {function} cls ���������ԭʼ����
	 * @param {function} p ������
	 * @optional {boolean} runCon �Ƿ��Զ����и��๹������Ĭ��Ϊtrue���Զ������˸��๹���������Ϊfalse���ڹ������ڿ���ͨ��arguments.callee.$super�ֹ����� 
	 * @return {function} ����������Ϊ�������̳���p������
	 * @throw {Error} ���ܶԼ̳з��ص�������ʹ��extend
	 */
	extend : function(cls,p,runCon){
		if(runCon == null) runCon = true;
		var wrapped = function()	//�������캯��
		{   
			if(runCon)
				p.apply(this, arguments);
			
			var ret = cls.apply(this, arguments);

			return ret;
		}
		wrapped.toString = function(){
			return cls.toString();
		}
		
		var T = function(){};			//����prototype-chain
		T.prototype = p.prototype;
		wrapped.prototype = new T();

		wrapped.$class = cls;
		wrapped.$super = cls.$super = p;
		
		wrapped.prototype.constructor = wrapped;

		for(var i in cls.prototype){		//���ԭʼ���͵�prototype���з�������copy
			if(cls.prototype.hasOwnProperty(i))
				wrapped.prototype[i] = cls.prototype[i];
		}

		wrapped.extend = function(){
			throw new Error("you maynot apply the same wrapper twice.");
		}

		return wrapped;
	}	
};

QW.ClassH =ClassH;

})();