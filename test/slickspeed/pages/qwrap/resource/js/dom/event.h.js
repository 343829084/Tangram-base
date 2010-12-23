/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: wangchen
*/

/**
 * @class EventH Event����չ
 * @namespace QW
 * @helper
 */
 
 (function(){
var EventH={
	/**
	* @final KEY_X һЩ���õľ�̬����
	*/
	KEY_BACKSPACE: 8,
	KEY_TAB: 9,
	KEY_ENTER: 13,
	KEY_ESC: 27,
	KEY_LEFT: 37,
	KEY_UP: 38,
	KEY_RIGHT: 39,
	KEY_DOWN: 40,
	KEY_DELETE: 46,
	/**
	* ��ȡ�¼�ʵ��
	* @method getEvent
	* @param {Event} e (Optional) �¼�ʵ��
	* @return {window|document|Element} target ��
	* @return {HTMLElement} �����¼���target��
	*/
	getEvent: function(e,target) {
		if(e) return e;
		if ('object' == typeof Event) {//Firefox�ȣ����ݲ���
			var f = arguments.callee;
			do {
				if (f.arguments[0] instanceof Event) return f.arguments[0];
			} while (f = f.caller);
			return null;
		} 
		//IE����Ҫ�ҵ���Ӧ��window
		if(target){
			var doc,win;
			if (target.window == target) return target.event;//window;
			if (doc = target.ownerDocument) return doc.parentWindow.event;//element etc.
			if (win = target.parentWindow) return win.event;
		}
		return window.event;
	},
	/**
	* ��ȡ�������¼��Ķ���
	* @method target
	* @param {Event} e �¼�����
	* @return {HTMLElement} �����¼���target��
	*/
	target: function(e) {
		e=e||EventH.getEvent();
		return e.target || e.srcElement;
	},

	/**
	* ��ȡ�������¼���relatedTarget
	* @method relatedTarget
	* @param {Event} e �¼�����
	* @return {HTMLElement} �����¼���relatedTarget��
	*/
	relatedTarget : function (e) {
		e=e||EventH.getEvent();
		if ('relatedTarget' in e) return e.relatedTarget;
		return (e.type == 'mouseover') && e.fromElement 
			|| (e.type == 'mouseout') && e.toElement 
			|| null;
	},

	/** 
	* �¼�����ʱ�Ƿ������סctrl��
	* @method	ctrlKey
	* @param {Event} e �¼�����
	* @return	{boolean}	�жϽ��
	*/
	ctrlKey : function (e) {
		e=e||EventH.getEvent();
		return e.ctrlKey;
	},
	
	/** 
	* �¼�����ʱ�Ƿ������סshift��
	* @method	shiftKey
	* @param {Event} e �¼�����
	* @return	{boolean}	�жϽ��
	*/
	shiftKey : function (e) {
		e=e||EventH.getEvent();
		return e.shiftKey;
	},
	
	/** 
	* �¼�����ʱ�Ƿ������סalt��
	* @method	altKey
	* @param {Event} e �¼�����
	* @return	{boolean}	�жϽ��
	*/
	altKey : function (e) {
		e=e||EventH.getEvent();
		return e.altKey;
	},

	/** 
	* ��ȡ�����ַ���
	* @method	detail
	* @optional {event}		event	event���� Ĭ��Ϊ����λ������������event
	* @optional {element}	element ����element���� element��������������event
	* @return	{int}		>0 ���� <0 ����
	*/
	detail : function (e) {
		e = e || window.event;
		return e.detail || -(e.wheelDelta || 0);
	},

	/**
	* ��ȡkeyCode
	* @method keyCode
	* @param {Event} e �¼�����
	* @return {int} �����¼���keyCode
	*/
	keyCode: function(e) {
		e=e||EventH.getEvent();
		return e.which || e.keyCode || e.charCode;
	},

	/**
	* �ж��Ƿ񵥻�������
	* @method isLeftClick
	* @param {Event} e �¼�����
	* @return {boolean} �Ƿ񵥻����
	*/
	isLeftClick: function(e) {
		e=e||EventH.getEvent();
		return (((e.which) && (e.which == 1)) || ((e.button) && (e.button == 1)));
	},

	/**
	* ��ȡ�¼�����ʱ�������ĵ����Ͻǵ�x���꣬������ڵ�ǰ�ĵ���λ�ã���������Ļ
	* @method pageX
	* @param {Event} e �¼�����
	* @return {int} ��ȡ�¼�����ʱ�������ĵ����Ͻǵ�x����
	*/
	pageX: function(e) {
		e=e||EventH.getEvent();
		if(e.pageX!=null) return e.pageX;
		else return (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)-2);
	},

	/**
	* ��ȡ�¼�����ʱ�������ĵ����Ͻǵ�y����
	* @method pageY
	* @param {Event} e �¼�����
	* @return {int} ��ȡ�¼�����ʱ�������ĵ����Ͻǵ�y����
	*/
	pageY: function(e) {
		e=e||EventH.getEvent();
		if(e.pageY!=null) return e.pageY;
		else return (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop)-2);
	},

	/**
	* ��ȡ�¼�����ʱ������ͼ��Ԫ�����Ͻǵ�x����
	* @method layerX
	* @param {Event} e �¼�����
	* @type {int} ��ȡ�¼�����ʱ������ͼ��Ԫ�����Ͻǵ�x����
	*/
	layerX: function(e) {
		e=e||EventH.getEvent();
		return e.layerX || e.offsetX;
	},

	/**
	* ��ȡ�¼�����ʱ������ͼ��Ԫ�����Ͻǵ�y����
	* @method layerY
	* @param {Event} e �¼�����
	* @type {int} ��ȡ�¼�����ʱ������ͼ��Ԫ�����Ͻǵ�y����
	*/
	layerY: function(e) {
		e=e||EventH.getEvent();
		return e.layerY || e.offsetY;
	},

	/**
	* ȡ��Ĭ�ϵ��¼�
	* @method preventDefault
	* @param {Event} e �¼�����
	* @return {void} 
	*/
	preventDefault: function(e) {
		e=e||EventH.getEvent();
		if (e.preventDefault) { 
			e.preventDefault(); 
		} else {
			e.returnValue = false;
		}
	},

	/**
	* ֹͣ�¼�������
	* @method stopPropagation
	* @param {Event} e �¼�����
	* @return {void} 
	*/
	stopPropagation: function(e) {
		e=e||EventH.getEvent();
		if (e.stopPropagation) { 
			e.stopPropagation(); 
		} else {
			e.cancelBubble = true;
		}
	}
};
QW.EventH=EventH;
})();


