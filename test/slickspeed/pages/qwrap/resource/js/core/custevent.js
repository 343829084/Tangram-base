/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK
*/



(function(){
var mix=QW.ObjectH.mix,
	indexOf=QW.ArrayH.indexOf;

//----------QW.CustEvent----------

/**
* @class CustEvent �Զ����¼�
* @namespace QW
* @param {object} target �¼��������󣬼������ĸ�������¼���
* @param {string} type �¼����͡����á�
* @returns {CustEvent} �Զ����¼�
*/
var CustEvent=QW.CustEvent=function(target,type){
	this.target=target;
	this.type=type;
};

mix(CustEvent.prototype,{
	/**
	* @property {Object} target CustEvent��target
	*/
	target: null,
	/**
	* @property {Object} currentTarget CustEvent��currentTarget�����¼��ɷ���
	*/
	currentTarget: null,
	/**
	* @property {String} type CustEvent������
	*/
	type: null,
	/**
	* @property {boolean} returnValue fire����ִ�к���������(�������:����onbeforexxxx�¼������returnValue===false����ִ�и��¼�)��
	*/
	returnValue: undefined,
	/**
	* ����event�ķ���ֵΪfalse��
	* @method preventDefault
	* @returns {void} �޷���ֵ
	*/
	preventDefault: function(){
		this.returnValue=false;
	}
});
	/**
	* Ϊһ���������һϵ���¼��������on/un/fire�����������μ���QW.CustEventTarget.createEvents
	* @static
	* @method createEvents
	* @param {Object} obj �¼��������󣬼������ĸ�������¼���
	* @param {String|Array} types �¼����ơ�
	* @returns {void} �޷���ֵ
	*/



/**
 * @class CustEventTarget  �Զ����¼�Target
 * @namespace QW
 */

var CustEventTarget=QW.CustEventTarget=function(){
	this.__custListeners={};
};
mix(CustEventTarget.prototype,{
	/**
	* ��Ӽ��
	* @method on 
	* @param {string} sEvent �¼����ơ�
	* @param {Function} fn ��غ�������CustEvent fireʱ��this����ָ��oScope������һ��������������һ��CustEvent����
	* @return {boolean} �Ƿ�ɹ���Ӽ�ء����磺�ظ���Ӽ�أ��ᵼ�·���false.
	* @throw {Error} ���û�ж��¼����г�ʼ��������״�
	*/
	on: function(sEvent,fn) {
		var cbs=this.__custListeners[sEvent];
		if(indexOf(cbs,fn)>-1) return false;
		cbs.push(fn);
		return true;
	},
	/**
	* ȡ�����
	* @method un
	* @param {string} sEvent �¼����ơ�
	* @param {Function} fn ��غ���
	* @return {boolean} �Ƿ���Чִ��un.
	* @throw {Error} ���û�ж��¼����г�ʼ��������״�
	*/
	un: function(sEvent, fn){
		var cbs=this.__custListeners[sEvent];
		if(fn) {
			var idx=indexOf(cbs,fn);
			if(idx<0) return false;
			cbs.splice(idx,1);
		}
		else cbs.length=0;
		return true;

	},
	/**
	* �¼������������¼�ʱ���ڼ�غ����this����ָ��oScope������һ��������������һ��CustEvent������Dom3��listener�Ĳ������ơ�<br/>
	  ���this.target['on'+this.type],��Ҳ��ִ�и÷���,��HTMLElement�Ķ�ռģʽ���¼�(��el.onclick=function(){alert(1)})����.
	* @method fire 
	* @param {string | CustEvent} custEvent �Զ����¼������¼����ơ� ������¼����ƣ��൱�ڴ�new CustEvent(this,sEvent).
	* @return {boolean} ���������������false����������·���true.
			1. ����callback(������ռģʽ��onxxx)ִ�����custEvent.returnValue===false
			2. ����callback(������ռģʽ��onxxx)ִ�����custEvent.returnValue===undefined�����Ҷ�ռģʽ��onxxx()�ķ���ֵΪfalse.
	*/
	fire: function(custEvent)
	{
		if(typeof custEvent == 'string') custEvent=new CustEvent(this,custEvent);
		var sEvent=custEvent.type;
		if(! custEvent instanceof CustEvent || !sEvent) throw new TypeError();
		custEvent.returnValue=undefined; //ȥ�����䣬�ᵼ�¾�̬CustEvent��returnValue�����Ⱦ
		custEvent.currentTarget=this;
		var obj=custEvent.currentTarget;
		if(obj && obj['on'+custEvent.type]) {
			var retDef=obj['on'+custEvent.type].call(obj,custEvent);//���ڶ�ռģʽ�ķ���ֵ������Ӱ��event.returnValue
		}
		var cbs=this.__custListeners[sEvent];
		for(var i=0;i<cbs.length;i++){
			cbs[i].call(obj,custEvent);
		}
		return (custEvent.returnValue!==false || retDef===false && custEvent.returnValue===undefined);
	}
});

CustEvent.createEvents=CustEventTarget.createEvents=function(obj,types){
	/**
	* Ϊһ���������һϵ���¼��������on/un/fire��������
	* @static
	* @method createEvents
	* @param {Object} obj �¼��������󣬼������ĸ�������¼���
	* @param {String|Array} types �¼����ơ�
	* @returns {void} �޷���ֵ
	*/
	if(typeof types =="string") types=types.split(",");
	var listeners=obj.__custListeners;
	if(!listeners) listeners=obj.__custListeners={};
	for(var i=0;i<types.length;i++){
		listeners[types[i]]=listeners[types[i]] || [];//�����ظ�create������Ӱ��֮ǰ��listerners.
	}
	mix(obj,CustEventTarget.prototype);//���ض������on��
};



})();


