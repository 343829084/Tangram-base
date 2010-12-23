/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK
*/


/**
 * @class Browser js�����л�����������Լ��汾��Ϣ
 * @singleton 
 * @namespace QW 
 */
QW.Browser=function(){
	var na=window.navigator,ua = na.userAgent.toLowerCase();
	// �ж�������Ĵ���,��������JQuery,��л!
	var b= {
		platform: na.platform,
		//mozilla: /mozilla/.test( ua ) && !/(compatible|webkit|firefox)/.test( ua ),//����
		msie: /msie/.test( ua ) && !/opera/.test( ua ),
		opera: /opera/.test( ua ),
		//gecko: /gecko/.test( ua ) && /khtml/.test( ua ),//����
		safari: /webkit/.test( ua ) && !/chrome/.test( ua ),
		firefox: /firefox/.test( ua ) ,
		chrome: /chrome/.test( ua )
	};
	var vMark="";
	for(var i in b){
		if(b[i]) vMark=i;
	}
	if(b.safari) vMark="version";
	b.version=(ua.match( new RegExp("(?:"+vMark+")[\\/: ]([\\d.]+)") ) || [])[1];
	b.ie=b.msie;
	b.ie6=b.msie && parseInt(b.version)==6;
	try{b.maxthon=b.msie && !!external.max_version;} catch(ex){}
	return b;
}();
