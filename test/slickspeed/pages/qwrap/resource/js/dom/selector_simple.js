/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK
*/

/**
 * @class Selector CssSelector��صļ�������
 * @singleton
 * @namespace QW
 */
(function(){
var Selector={
	/*
	 * CSS selector���������
	 */
	_operators:{	//���±��ʽ��aa��ʾattrֵ��vv��ʾ�Ƚϵ�ֵ
		'': 'aa',//isTrue|hasValue
		'=': 'aa=="vv"',//equal
		'!=': 'aa!="vv"', //unequal
		'~=': 'aa&&(" "+aa+" ").indexOf(" vv ")>-1',//onePart
		'|=': 'aa&&(aa+"-").indexOf("vv-")==0', //firstPart
		'^=': 'aa&&aa.indexOf("vv")==0', // beginWith
		'$=': 'aa&&aa.lastIndexOf("vv")==aa.length-"vv".length', // endWith
		'*=': 'aa&&aa.indexOf(v)>-1' //contains
	},
	/*
	 * CSS ����д��
	 */
    _shorthands: [
		[/\#([\w\-]+)/g,'[id="$1"]'],//id����д��
		[/^([\w\-]+)/g, function(a,b){return '[tagName="'+b.toUpperCase()+'"]';}],//tagName����д��
		[/\.([\w\-]+)/g, '[className~="$1"]'],//className����д��
		[/^\*/g, '[tagName]']//����tagName����д��
	],
	/*
	 * CSS α���߼������selector����֧��
	 */
	//_pseudos:{},
	/*
	 * CSS selector��ϵ����������selector����֧��
	 */
	//_relations:{},���selector����֧��
	/*
	 * ���õ�Element����
	 */
	_attrGetters:function(){ 
		var o={'class': 'el.className',
			'for': 'el.htmlFor',
			'href':'el.getAttribute("href",2)'};
		var attrs='name,id,className,value,selected,checked,disabled,type,tagName,readOnly'.split(',');
		for(var i=0,a;a=attrs[i];i++) o[a]="el."+a;
		return o;
	}(),
	selector2Filter:function(sSelector){
		/* 
		 * ��һ��selector�ַ���ת����һ�����˺���.
		 * @method selector2Filter
		 * @param {string} sSelector: ����selector�����selector��û�й�ϵ�������", >+~"��
		 * @returns {function} : ���ع��˺�����
		 * @example: 
			var fun=selector2Filter("input.aaa");alert(fun);
		 */
		return s2f(sSelector);
	},
	test:function(el,sSelector){
		/*
		 * �ж�һ��Ԫ���Ƿ����ĳselector.
		 * @method test 
		 * @param {HTMLElement} el: ���������
		 * @param {string} sSelector: ����selector�����selector��û�й�ϵ�������", >+~"��
		 * @returns {function} : ���ع��˺�����
		 */
		return s2f(sSelector)(el);
	},
	query:function(refEl,sSelector){
		/*
		 * ��refElΪ�ο����õ����Ϲ���������HTML Elements. refEl������element������document
		 * @method query
		 * @param {HTMLElement} refEl: �ο�����
		 * @param {string} sSelector: ����selector,
		 * @returns {array} : ����elements���顣
		 * @example: 
			var els=query(document,"input.aaa");
			for(var i=0;i<els.length;i++ )els[i].style.backgroundColor='red';
		 */
		return querySimple(refEl||document,sSelector);
	}
};

/*
 * s2f(sSelector): ��һ��selector�õ�һ�����˺���filter�����selector��û�й�ϵ�������", >+~"��
 */
function s2f(sSelector){
	var s=sSelector,
		attrs=[];//�������飬ÿһ��Ԫ�ض������飬����Ϊ�������������ԱȽϷ����Ƚ�ֵ
	for(var i=0,shorthands=Selector._shorthands,sh;sh=shorthands[i];i++)
		s=s.replace(sh[0],sh[1]);
	var reg=/\[\s*([\w\-]+)\s*([!~|^$*]?\=)?\s*(?:"([^\]]*)")?\s*\]/g; //����ѡ����ʽ����
	s=s.replace(reg,function(a,b,c,d){attrs.push([b,c||"",d||""]);return "";});//��ͨд��[foo][foo=""][foo~=""]��
	if(s.length) {throw "Unsupported Selector:\n"+sSelector+"\n"+s;}
	if(attrs.length){
		var sFun=[];
		for(var i=0,attr;attr=attrs[i];i++){//���Թ���
			var attrGetter=Selector._attrGetters[attr[0]] || 'el.getAttribute("'+attr[0]+'")';
			sFun.push(Selector._operators[attr[1]].replace(/aa/g,attrGetter).replace(/vv/g,attr[2]));
		}
		sFun='return ('+sFun.join(")&&(")+');';
		return new Function("el",sFun);
	}
	return function(el){return true;};
};
/*
���ô��룬�����s2f
function s2f(sSelector){
	var attrs=[];//�������飬ÿһ��Ԫ�ض������飬����Ϊ�������������ԱȽϷ����Ƚ�ֵ
	var s=sSelector;
    var shorthands=[
		[/\#([\w\-]+)/g,function(a,b){attrs.push('el.id=="'+b+'"');return '';}],//id����
		[/^\*+/g,function(a,b){attrs.push('el.tagName');return '';}],//Element����
		[/^([\w\-]+)/g,function(a,b){attrs.push('el.tagName=="'+b.toUpperCase()+'"');return '';}],//tagName����
		[/\.([\w\-]+)/g,function(a,b){attrs.push('el.className && (" "+el.className+" ").indexOf(" '+b+' ")>-1');return '';}]//className����
	];
	for(var i=0,sh;sh=shorthands[i];i++){
		s=s.replace(sh[0],sh[1]);
	}
	if(s) throw ("Unsupported Selector:\n"+sSelector+"\n"+s);
	if(attrs.length){
		return new Function('el','return '+attrs.join('&&'));
	}
	return function(el){return true;};
};
*/

/* 
* querySimple(pEl,sSelector): �õ�pEl�µķ��Ϲ���������HTML Elements. 
* sSelector��û��","�����
* pEl��Ĭ����document.body 
* @see: query��
*/
function querySimple(pEl,sSelector){
	//if(pEl.querySelectorAll) return pEl.querySelectorAll(sSelector);//JK��������ϱ��䣬���ܻ���ϰ����ff����bug��ͬѧ����ie�������©���ˡ�
	var tagName="*";
	sSelector=sSelector.replace(/^[\w\-]+/,function(a){tagName=a;return ""});
	var filter=s2f(sSelector);
	var els=pEl.getElementsByTagName(tagName),els2=[];
	for(var i=0,el;el=els[i];i++){
		if(filter(el)) els2.push(el);
	}
	return els2;
};

QW.Selector=Selector;

})();

