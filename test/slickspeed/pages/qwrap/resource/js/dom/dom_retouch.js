/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: wangchen
	author: JK
*/


/*
	Dom_Retouch
*/


(function(){
var ObjectH=QW.ObjectH,
	HelperH=QW.HelperH,
	NodeC=QW.NodeC,
	NodeW=QW.NodeW,
	EventW=QW.EventW,
	EventTargetH=QW.EventTargetH;

/*
 * EventTarget Helper onfire ������չ
 * @class EventTargetH
 * usehelper BB.EventTargetH
*/
EventTargetH.fireHandler = function (element, e, handler, name) {
	var we = new EventW(e);
	return handler.call(element, we);
};

/*
NodeH2 = EventTargetH+NodeH
*/

var NodeH2=ObjectH.mix({},[QW.EventTargetH,QW.NodeH]);
var NodeH2=HelperH.mul(NodeH2,true);

/**
*@class Dom ��DomU�ķ������Լ�NodeH�ķ������е�һ���һ�������ռ�
*@namespace QW
*/
QW.Dom={};
ObjectH.mix(QW.Dom,[QW.DomU,NodeH2]);
HelperH.gsetter(QW.Dom,NodeC.gsetterMethods);//����gsetters


/**
*@class NodeW ��NodeH��EventTargetH���Լ�ArrayH����ȾNodeW
*@namespace QW
*/
var wh=HelperH.rwrap(NodeH2,NodeW,NodeC.wrapMethods);
HelperH.gsetter(wh,NodeC.gsetterMethods);//����gsetters
ObjectH.dump(QW.ArrayH,NodeC.arrayMethods,wh);//ArrayH�Ĳ��ַ���Ҳ�ƹ���


HelperH.applyTo(wh,NodeW);	//NodeW�ľ�̬����
HelperH.methodizeTo(wh,NodeW.prototype,"core");	//NodeW��ԭ�ͷ���

})();


