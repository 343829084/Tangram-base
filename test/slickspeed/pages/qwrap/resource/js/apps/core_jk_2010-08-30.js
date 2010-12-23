

/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK
*/

(function(){
/**
* @singleton 
* @class QW QW��ܵĸ������ռ�
*/

var QW = {
	/**
	* ��ǰ��ܰ汾
	* @porperty CORE_VERSION
	* @type string
	*/
	CORE_VERSION: "0.0.1",
	/**
	* coreĿ¼����·������������һ��"/"
	* @property JSPATH
	* @type string
	*/
	JSPATH: function(){
		var els=document.getElementsByTagName('script');
		for (var i = 0; i < els.length; i++) {
			var src = els[i].src.split(/(apps|core)[\\\/]/g);
			if (src[1]) {
				return src[0];
			}
		}
		return '';}(),
	/**
	 * ��QW��������ռ��������
	 * @method provide
	 * @static
	 * @param {string|Json} key �������Ϊstring����Ϊkey������ΪJson����ʾ����Json���ֵdump��QW�����ռ�
	 * @param {any} value (Optional)ֵ
	 * @return {void} 
	 */		
	provide: function(key, value){
		if(arguments.length==1 && typeof key=='object'){
			for(var i in key){
				QW.provide(i,key[i]);
			}
			return;
		}
		var domains=QW.provideDomains;
		for(var i=0;i<domains.length;i++){
			if(!domains[i][key]) domains[i][key]=value;
		}
	},
	/**
	* �첽���ؽű�
	* @method getScript
	* @static
	* @param { String } url Javascript�ļ�·��
	* @param { Function } onsuccess (Optional) Javascript���غ�Ļص�����
	* @param { Json } options (Optional) ����ѡ�����charset
	*/
	getScript: function(url,onsuccess,options){
		options = options || {};
		var head = document.getElementsByTagName('head')[0],
			script = document.createElement('script'),
			done = false;
		script.src = url;
		if( options.charset )
			script.charset = options.charset;
		script.onerror = script.onload = script.onreadystatechange = function(){
			if ( !done && (!this.readyState ||
					this.readyState == "loaded" || this.readyState == "complete") ) {
				done = true;
				onsuccess && onsuccess();
				script.onerror = script.onload = script.onreadystatechange = null;
				head.removeChild( script );
			}
		};
		head.appendChild(script);

	}
};

/**
 * @property {Array} provideDomains provide������Ե������ռ�
 * @type string
 */
QW.provideDomains=[QW];

window.QW=QW;
})();
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


/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK
*/


/**
 * @class StringH ���Ķ���String����չ
 * @singleton
 * @namespace QW
 * @helper
 */

(function(){

var StringH = {
	/** 
	* ��ȥ�ַ������ߵĿհ��ַ�
	* @method trim
	* @static
	* @param {String} s ��Ҫ������ַ���
	* @return {String}  ��ȥ���˿հ��ַ�����ַ���
	* @remark ����ַ����м��кܶ�����tab,����������Ч������,��Ӧ�����������һ�仰�����.
		return s.replace(/^[\s\xa0\u3000]+/g,"").replace(/([^\u3000\xa0\s])[\u3000\xa0\s]+$/g,"$1");
	*/
	trim:function(s){
		return s.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, "");
	},
	/** 
	* ��һ���ַ������ж��replace
	* @method mulReplace
	* @static
	* @param {String} s  ��Ҫ������ַ���
	* @param {array} arr  ���飬ÿһ��Ԫ�ض�����replace����������ɵ�����
	* @return {String} ���ش������ַ���
	* @example alert(mulReplace("I like aa and bb. JK likes aa.",[[/aa/g,"ɽ"],[/bb/g,"ˮ"]]));
	*/
	mulReplace:function (s,arr){
		for(var i=0;i<arr.length;i++) s=s.replace(arr[i][0],arr[i][1]);
		return s;
	},
	/** 
	* �ַ�������ģ��
	* @method format
	* @static
	* @param {String} s �ַ���ģ�壬���б�����{0} {1}��ʾ
	* @param {String} arg0 (Optional) �滻�Ĳ���
	* @return {String}  ģ��������滻����ַ���
	* @example alert(tmpl("{0} love {1}.",'I','You'))
	*/
	format:function(s,arg0){
		var args=arguments;
		return s.replace(/\{(\d+)\}/ig,function(a,b){return args[b*1+1]||''});
	},
	/** 
	* �ַ�������ģ��
	* @method tmpl
	* @static
	* @param {String} sTmpl �ַ���ģ�壬���б����ԣ�$aaa����ʾ
	* @param {Object} opts ģ�����
	* @return {String}  ģ��������滻����ַ���
	* @example alert(tmpl("{$a} love {$b}.",{a:"I",b:"you"}))
	*/
	tmpl:function(sTmpl,opts){
		return sTmpl.replace(/\{\$(\w+)\}/g,function(a,b){return opts[b]});
	},

	/** 
	* �ж�һ���ַ����Ƿ������һ���ַ���
	* @method contains
	* @static
	* @param {String} s �ַ���
	* @param {String} opts ���ַ���
	* @return {String} ģ��������滻����ַ���
	* @example alert(contains("aaabbbccc","ab"))
	*/
	contains:function(s,subStr){
		return s.indexOf(subStr)>-1;
	},

	/** 
	* ȫ���ַ�ת����ַ�
		ȫ�ǿո�Ϊ12288��ת����" "��
		ȫ�Ǿ��Ϊ12290��ת����"."��
		�����ַ����(33-126)��ȫ��(65281-65374)�Ķ�Ӧ��ϵ�ǣ������65248 
	* @method dbc2sbc
	* @static
	* @param {String} s ��Ҫ������ַ���
	* @return {String}  ����ת������ַ���
	* @example 
		var s="��Ʊ���ǣ££ã���������������Ʊ����ǣ���.����Ԫ";
		alert(dbc2sbc(s));
	*/
	dbc2sbc:function(s)
	{
		return StringH.mulReplace(s,[
			[/[\uff01-\uff5e]/g,function(a){return String.fromCharCode(a.charCodeAt(0)-65248);}],
			[/\u3000/g,' '],
			[/\u3002/g,'.']
		]);
	},

	/** 
	* �õ��ֽڳ���
	* @method byteLen
	* @static
	* @param {String} s �ַ���
	* @return {number}  �����ֽڳ���
	*/
	byteLen:function(s)
	{
		return s.replace(/[^\x00-\xff]/g,"--").length;
	},

	/** 
	* �õ�ָ���ֽڳ��ȵ����ַ���
	* @method subByte
	* @static
	* @param {String} s �ַ���
	* @param {number} len �ֽڳ���
	* @optional {string} tail ��β�ַ���
	* @return {string}  ����ָ���ֽڳ��ȵ����ַ���
	*/
	subByte:function(s, len, tail)
	{
		if(StringH.byteLen(s)<=len) return s;
		tail = tail||'';
		len -= StringH.byteLen(tail);
		return s=s.substr(0,len).replace(/([^\x00-\xff])/g,"$1 ")//˫�ֽ��ַ��滻������
			.substr(0,len)//��ȡ����
			.replace(/[^\x00-\xff]$/,"")//ȥ���ٽ�˫�ֽ��ַ�
			.replace(/([^\x00-\xff]) /g,"$1") + tail;//��ԭ
	},

	/** 
	* �շ廯�ַ���������ab-cd��ת��Ϊ��abCd��
	* @method camelize
	* @static
	* @param {String} s �ַ���
	* @return {String}  ����ת������ַ���
	*/
	camelize:function(s) {
		return s.replace(/\-(\w)/ig,function(a,b){return b.toUpperCase();});
	},

	/** 
	* ���շ廯�ַ���������abCd��ת��Ϊ��ab-cd����
	* @method decamelize
	* @static
	* @param {String} s �ַ���
	* @return {String} ����ת������ַ���
	*/
	decamelize:function(s) {
		return s.replace(/[A-Z]/g,function(a){return "-"+a.toLowerCase();});
	},

	/** 
	* �ַ���Ϊjavascriptת��
	* @method encode4Js
	* @static
	* @param {String} s �ַ���
	* @return {String} ����ת������ַ���
	* @example 
		var s="my name is \"JK\",\nnot 'Jack'.";
		window.setTimeout("alert('"+encode4Js(s)+"')",10);
	*/
	encode4Js:function(s){
		return StringH.mulReplace(s,[
			[/\\/g,"\\u005C"],
			[/"/g,"\\u0022"],
			[/'/g,"\\u0027"],
			[/\//g,"\\u002F"],
			[/\r/g,"\\u000A"],
			[/\n/g,"\\u000D"],
			[/\t/g,"\\u0009"]
		]);
	},

	/** 
	* Ϊhttp�Ĳ��ɼ��ַ�������ȫ�ַ��������ַ���ת��
	* @method encode4Http
	* @static
	* @param {String} s �ַ���
	* @return {String} ���ش������ַ���
	*/
	encode4Http:function(s){
		return s.replace(/[\u0000-\u0020\u0080-\u00ff\s"'#\/\|\\%<>\[\]\{\}\^~;\?\:@=&]/,function(a){return encodeURIComponent(a)});
	},

	/** 
	* �ַ���ΪHtmlת��
	* @method encode4Html
	* @static
	* @param {String} s �ַ���
	* @return {String} ���ش������ַ���
	* @example 
		var s="<div>dd";
		alert(encode4Html(s));
	*/
	encode4Html:function(s){
		var el = document.createElement('pre');//����Ҫ��pre����div��ʱ�ᶪʧ���У����磺'a\r\n\r\nb'
		var text = document.createTextNode(s);
		el.appendChild(text);
		return el.innerHTML;
	},

	/** 
	* �ַ���ΪHtml��valueֵת��
	* @method encode4HtmlValue
	* @static
	* @param {String} s �ַ���
	* @return {String} ���ش������ַ���
	* @example:
		var s="<div>\"\'ddd";
		alert("<input value='"+encode4HtmlValue(s)+"'>");
	*/
	encode4HtmlValue:function(s){
		return StringH.encode4Html(s).replace(/"/g,"&quot;").replace(/'/g,"&#039;");
	},

	/** 
	* ��encode4Html�����෴�����з�����
	* @method decode4Html
	* @static
	* @param {String} s �ַ���
	* @return {String} ���ش������ַ���
	*/
	decode4Html:function(s){
		var div = document.createElement('div');
		div.innerHTML = s.stripTags();
		return div.childNodes[0] ? div.childNodes[0].nodeValue+'' : '';
	},
	/** 
	* ������tag��ǩ��������ȥ��<tag>���Լ�</tag>
	* @method stripTags
	* @static
	* @param {String} s �ַ���
	* @return {String} ���ش������ַ���
	*/
	stripTags:function(s) {
		return s.replace(/<[^>]*>/gi, '');
	},
	/** 
	* evalĳ�ַ����������"eval"����������Ҫ�����ţ����ܲ�Ӱ��YUIѹ�������������ط�����Ҳ�������⣬���Ը���evalJs��
	* @method evalJs
	* @static
	* @param {String} s �ַ���
	* @param {any} opts ����ʱ��Ҫ�Ĳ�����
	* @return {any} �����ַ�������з��ء�
	*/
	evalJs:function(s,opts) { //�����eval����������Ҫ�����ţ����ܲ�Ӱ��YUIѹ�������������ط�����Ҳ�������⣬���Ըĳ�evalJs��
		return new Function("opts",s)(opts);
	},
	/** 
	* evalĳ�ַ���������ַ�����һ��js���ʽ�������ر��ʽ���еĽ��
	* @method evalExp
	* @static
	* @param {String} s �ַ���
	* @param {any} opts evalʱ��Ҫ�Ĳ�����
	* @return {any} �����ַ�������з��ء�
	*/
	evalExp:function(s,opts) {
		return new Function("opts","return "+s+";")(opts);
	}
};

QW.StringH=StringH;

})();

/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: wuliang
	author: JK
*/


/**
 * @class ObjectH ���Ķ���Object�ľ�̬��չ
 * @singleton
 * @namespace QW
 * @helper
 */

(function(){

var encode4Js=QW.StringH.encode4Js;
var ObjectH = {
	/**
	* �õ�һ������������ַ���
	* @method getType
	* @static
	* @param {any} o Ŀ������ֵ
	* @returns {string} �ö��������
	* @example
		getType(null); //null
		getType(undefined); //undefined
		getType(""); //string
		getType([]); //array
		getType(true); //boolean
		getType({}); //object
		getType(new Date()); //date
		getType(/a/); //regexp
		getType({}.constructor); //function
		getType(window); //window
		getType(document); //document
		getType(document.body); //BODY
	*/
	getType: function(o){
		var type = typeof o;
		if(type == 'object'){
			if(o==null) type='null';
			else if("__type__" in o) type=o.__type__;
			else if("core" in o) type='wrap';
			else if(o.window==o) type='window'; //window
			else if(o.nodeName) type=(o.nodeName+'').replace('#',''); //document/element
			else if(!o.constructor) type='unknown object';
			else type=Object.prototype.toString.call(o).slice(8,-1).toLowerCase();
		}
		return type;
	},

	/** 
	* ��Դ��������Բ��뵽Ŀ�����
	* @method mix
	* @static
	* @param {Object} des Ŀ�����
	* @param {Object|Array} src Դ������������飬�����β���
	* @param {boolean} override (Optional) �Ƿ񸲸���������
	* @returns {Object} des
	*/
	mix: function(des, src, override){
		if("array" == ObjectH.getType(src)){
			for(var i = 0, len = src.length; i<len; i++){
				ObjectH.mix(des, src[i], override);
			}
			return des;
		}
		for(var i in src){
			if(override || !(i in des)){
				des[i] = src[i];
			}
		}
		return des;
	},

	/**
	* ��һ��������ĳЩ���Ը��Ƴ���������һ��������Щ����ֵ����ͨ����
	* @method dump
	* @static
	* @param {Object} obj �������Ķ���
	* @param {Array} props ����Ҫ�����Ƶ��������Ƶ�����
	* @param {Object} toObj ���Ŀ�꣬���Ϊ�գ������һ���µ�Json
	* @param {boolean} override �Ƿ񸲸�ԭ�����ԡ�
	* @return {Object} toObj ���ذ�����������б��������ԵĶ���
	*/
	dump: function(obj, props, toObj,override){
		var ret = toObj || {};
		for(var i = 0; i<props.length;i++){
			var key = props[i];
			if(key in obj){
				if(override || !ret[key]) ret[key] = obj[key];
			}
		}
		return ret;
	},

	/**
	* �õ�һ�����������п��Ա�ö�ٳ������Ե��б�
	* @method keys
	* @static
	* @param {Object} obj �������Ķ���
	* @return {Array} ���ذ�������������������Ե�����
	*/
	keys : function(obj){
		var ret = [];
		for(var key in obj){
			ret.push(key);
		}
		return ret;
	},

	/** 
	* ���л�һ������(ֻ���л�String,Number,Boolean,Date,Array,Json�������toJSON�����Ķ���,�����Ķ��󶼻ᱻ���л���null)
	* @method stringify
	* @static
	* @param {Object} obj ��Ҫ���л���Json��Array�������������
	* @returns {String} : �������л����
	* @example 
		var card={cardNo:"bbbb1234",history:[{date:"2008-09-16",count:120.0,isOut:true},1]};
		alert(stringify(card));
	*/
	stringify:function (obj){
		if(obj==null) return null;
		if(obj.toJSON) {
			obj= obj.toJSON();
		}
		var type=ObjectH.getType(obj);
		switch(type){
			case 'string': return '"'+encode4Js(obj)+'"';
			case 'number': 
			case 'boolean': return obj+'';
			case 'date': return 'new Date(' + obj.getTime() + ')';
			case 'array' :
				var ar=[];
				for(var i=0;i<obj.length;i++) ar[i]=ObjectH.stringify(obj[i]);
				return '['+ar.join(',')+']';
			case 'object' :
				ar=[];
				for(i in obj){
					ar.push('"'+encode4Js(i+'')+'":'+ObjectH.stringify(obj[i]));
				}
				return '{'+ar.join(',')+'}';
		}
		return null;//�޷����л��ģ�����null;
	},

	/** 
	* Ϊһ��������������
	* @method set
	* @static
	* @param {Object} obj Ŀ�����
	* @param {string} prop ������
	* @param {any} value ����ֵ
	* @returns {void} 
	*/
	set:function (obj,prop,value){
		obj[prop]=value;
	},

	/** 
	* ��ȡһ�����������ֵ:
	* @method set
	* @static
	* @param {Object} obj Ŀ�����
	* @param {string} prop ������
	* @returns {any} 
	*/
	get:function (obj,prop){
		return obj[prop];
	},

	/** 
	* Ϊһ�������������ԣ�֧���������ֵ��÷�ʽ:
		setEx(obj, prop, value)
		setEx(obj, propJson)
		setEx(obj, props, values)
		---�ر�˵��propName����ĵ㣬�ᱻ�������ԵĲ��
	* @method setEx
	* @static
	* @param {Object} obj Ŀ�����
	* @param {string|Json|Array} prop �����string,��������(�������������������ַ���,��"style.display")�������Json����prop/value�ԡ���������飬��prop���飬�ڶ���������Ӧ��Ҳ��value����
	* @param {any | Array} value ����ֵ
	* @returns {Object} obj 
	* @example 
		var el={style:{},firstChild:{}};
		setEx(el,"id","aaaa");
		setEx(el,{className:"cn1", 
			"style.display":"block",
			"style.width":"8px"
		});
	*/
	setEx:function (obj,prop,value){
		var propType=ObjectH.getType(prop);
		if(propType == 'array') {
			//setEx(obj, props, values)
			for(var i=0;i<prop.length;i++){
				ObjectH.setEx(obj,prop[i],value[i]);
			}
		}
		else if(propType == 'object') {
			//setEx(obj, propJson)
			for(var i in prop)
				ObjectH.setEx(obj,i,prop[i]);
		}
		else {
			//setEx(obj, prop, value);
			var keys=(prop+"").split(".");
			for(var i=0, obj2=obj, len=keys.length-1;i<len;i++){
				obj2=obj2[keys[i]];
			}
			obj2[keys[i]]=value;
		}
		return obj;
	},

	/** 
	* �õ�һ�������������ԣ�֧���������ֵ��÷�ʽ:
		getEx(obj, prop) -> obj[prop]
		getEx(obj, props) -> propValues
		getEx(obj, propJson) -> propJson
	* @method getEx
	* @static
	* @param {Object} obj Ŀ�����
	* @param {string | Array} prop �����string,��������(�������������������ַ���,��"style.display")��
		�����Array����props����
	* @param {boolean} returnJson �Ƿ���Ҫ����Json����
	* @returns {any|Array|Json} ��������ֵ
	* @example 
		getEx(obj,"style"); //����obj["style"];
		getEx(obj,"style.color"); //���� obj.style.color;
		getEx(obj,"style.color",true); //���� {"style.color":obj.style.color};
		getEx(obj,["id","style.color"]); //���� [obj.id, obj.style.color];
		getEx(obj,["id","style.color"],true); //���� {id:obj.id, "style.color":obj.style.color};
	*/
	getEx:function (obj,prop,returnJson){
		var ret,propType=ObjectH.getType(prop);
		if(propType == 'array'){
			if(returnJson){
				ret={};
				for(var i =0; i<prop.length;i++){
					ret[prop[i]]=ObjectH.getEx(obj,prop[i]);
				}
			}
			else{
				//getEx(obj, props)
				ret=[];
				for(var i =0; i<prop.length;i++){
					ret[i]=ObjectH.getEx(obj,prop[i]);
				}
			}
		}
		else {
			//getEx(obj, prop)
			var keys=(prop+"").split(".");
			ret=obj;
			for(var i=0;i<keys.length;i++){
				ret=ret[keys[i]];
			}
			if(returnJson) {
				var json={};
				json[prop]=ret;
				return json;
			}
		}
		return ret;
	}

};
QW.ObjectH=ObjectH;
})()

/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK
*/

/**
 * @class ArrayH ���Ķ���Array����չ
 * @singleton 
 * @namespace QW
 * @helper
 */
(function(){

var ArrayH = {
	/** 
	* �������е�ÿ����������һ������������ȫ�������Ϊ���鷵�ء�
	* @method map
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ���.
	* @param {Object} pThis (Optional) ָ��callback��this����.
	* @return {Array} �����������������Ԫ����ɵ������� 
	* @example 
		var arr=["aa","ab","bc"];
		var arr2=map(arr,function(a,b){return a.substr(0,1)=="a"});
		alert(arr2);
	*/
	map:function(arr,callback,pThis){
		var len=arr.length;
		var rlt=new Array(len);
		for (var i =0;i<len;i++) {
			if (i in arr) rlt[i]=callback.call(pThis,arr[i],i,arr);
		}
		return rlt;
	},

	/** 
	* ��Array��ÿһ��Ԫ������һ��������
	* @method forEach
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ���.
	* @optional {Object} pThis (Optional) ָ��callback��this����.
	* @return {void}  
	* @example 
		var arr=["a","b","c"];
		var dblArr=[];
		forEach(arr,function(a,b){dblArr.push(b+":"+a+a);});
		alert(dblArr);
	*/
	forEach:function(arr,callback,pThis){
		for (var i =0,len=arr.length;i<len;i++){
			if (i in arr) callback.call(pThis,arr[i],i,arr);
		}
	},

	/** 
	* �������е�ÿ����������һ����������������������ֵ������Ϊ���鷵�ء�
	* @method filter
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ���.
	* @optional {Object} pThis (Optional) ָ��callback��this����.
	* @return {Array} �����������������Ԫ����ɵ������� 
	* @example 
		var arr=["aa","ab","bc"];
		var arr2=filter(arr,function(a,b){return a.substr(0,1)=="a"});
		alert(arr2);
	*/
	filter:function(arr,callback,pThis){
		var rlt=[];
		for (var i =0,len=arr.length;i<len;i++) {
			if((i in arr) && callback.call(pThis,arr[i],i,arr)) rlt.push(arr[i]);
		}
		return rlt;
	},

	/** 
	* �ж��������Ƿ���Ԫ������������
	* @method some
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ���.
	* @optional {Object} pThis (Optional) ָ��callback��this����.
	* @return {boolean} �������Ԫ�������������򷵻�true. 
	* @example 
		var arr=["aa","ab","bc"];
		var arr2=filter(arr,function(a,b){return a.substr(0,1)=="a"});
		alert(arr2);
	*/
	some:function(arr,callback,pThis){
		for (var i =0,len=arr.length;i<len;i++) {
			if(i in arr && callback.call(pThis,arr[i],i,arr)) return true;
		}
		return false;
	},

	/** 
	* �ж�����������Ԫ�ض�����������
	* @method every
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ���.
	* @optional {Object} pThis (Optional) ָ��callback��this����.
	* @return {boolean} ����Ԫ�������������򷵻�true. 
	* @example 
		var arr=["aa","ab","bc"];
		var arr2=filter(arr,function(a,b){return a.substr(0,1)=="a"});
		alert(arr2);
	*/
	every:function(arr,callback,pThis){
		for (var i =0,len=arr.length;i<len;i++) {
			if(i in arr && !callback.call(pThis,arr[i],i,arr)) return false;
		}
		return true;
	},

	/** 
	* ����һ��Ԫ���������е�λ�ã���ǰ�����ң������������û�и�Ԫ�أ��򷵻�-1
	* @method indexOf
	* @static
	* @param {Array} arr �����������.
	* @param {Object} obj Ԫ�أ��������κ�����
	* @optional {int} fromIdx (Optional) ���ĸ�λ�ÿ�ʼ�������Ϊ�������ʾ��length+startIdx��ʼ��
	* @return {int} �򷵻ظ�Ԫ���������е�λ��.
	* @example 
		var arr=["a","b","c"];
		alert(indexOf(arr,"c"));
	*/
	indexOf:function(arr,obj,fromIdx){
		var len=arr.length;
		fromIdx=fromIdx|0;//ȡ��
		if(fromIdx<0) fromIdx+=len;
		if(fromIdx<0) fromIdx=0;
		for(; fromIdx < len; fromIdx ++){
			if(fromIdx in arr && arr[fromIdx] === obj) return fromIdx;
		}
		return -1;
	},

	/** 
	* ����һ��Ԫ���������е�λ�ã��Ӻ���ǰ�ң������������û�и�Ԫ�أ��򷵻�-1
	* @method lastIndexOf
	* @static
	* @param {Array} arr �����������.
	* @param {Object} obj Ԫ�أ��������κ�����
	* @optional {int} fromIdx (Optional) ���ĸ�λ�ÿ�ʼ�������Ϊ�������ʾ��length+startIdx��ʼ��
	* @return {int} �򷵻ظ�Ԫ���������е�λ��.
	* @example 
		var arr=["a","b","a"];
		alert(lastIndexOf(arr,"a"));
	*/
	lastIndexOf:function(arr,obj,fromIdx){
		var len=arr.length;
		fromIdx=fromIdx|0;//ȡ��
		if(!fromIdx || fromIdx>=len) fromIdx=len-1;
		if(fromIdx<0) fromIdx+=len;
		for(; fromIdx >-1; fromIdx --){
			if(fromIdx in arr && arr[fromIdx] === obj) return fromIdx;
		}
		return -1;
	},

	/** 
	* �ж������Ƿ����ĳԪ��
	* @method contains
	* @static
	* @param {Array} arr �����������.
	* @param {Object} obj Ԫ�أ��������κ�����
	* @return {boolean} ���Ԫ�ش��������飬�򷵻�true�����򷵻�false
	* @example 
		var arr=["a","b","c"];
		alert(contains(arr,"c"));
	*/
	contains:function(arr,obj) {
		return (ArrayH.indexOf(arr,obj) >= 0);
	},

	/** 
	* ���һ������
	* @method clear
	* @static
	* @param {Array} arr �����������.
	* @return {void} 
	*/
	clear:function(arr){
		arr.length = 0;
	},

	/** 
	* ���������ĳ(Щ)Ԫ���Ƴ���
	* @method remove
	* @static
	* @param {Array} arr �����������.
	* @param {Object} obj0 ���Ƴ�Ԫ��
	* @param {Object} obj1 �� ���Ƴ�Ԫ��
	* @return {number} ���ص�һ�α��Ƴ���λ�á����û���κ�Ԫ�ر��Ƴ����򷵻�-1.
	* @example 
		var arr=["a","b","c"];
		remove(arr,"a","c");
		alert(arr);
	*/
	remove:function(arr,obj){
		var idx=-1;
		for(var i=1;i<arguments.length;i++){
			var oI=arguments[i];
			for(var j=0;j<arr.length;j++){
				if(oI === arr[j]) {
					if(idx<0) idx=j;
					arr.splice(j--,1);
				}
			}
		}
		return idx;
	},

	/** 
	* ����Ԫ�س��أ��õ�������
	* @method unique
	* @static
	* @param {Array} arr �����������.
	* @return {void} ����Ԫ�س��أ��õ�������
	* @example 
		var arr=["a","b","a"];
		alert(unique(arr));
	*/
	unique:function(arr){
		var rlt = [];
		var oI=null;
		for(var i = 0; i < arr.length; i ++){
			if(ArrayH.indexOf(rlt,oI=arr[i])<0){
				rlt.push(oI);
			}
		}
		return rlt;
	},

	/** 
	* �ϲ������Ѿ�unique�������飬�൱����������concat��������unique������Ч�ʸ���
	* @method union
	* @static
	* @param {Array} arr �����������.
	* @param {Array} arr2 �����������.
	* @return {Array} ����һ��������
	* @example 
		var arr=["a","b"];
		var arr2=["b","c"];
		alert(union(arr,arr2));
	*/
	union:function(arr,arr2){
		var ra = [];
		for(var i = 0, len = arr2.length; i < len; i ++){
			if(!ArrayH.contains(arr,arr2[i])) {
				ra.push(arr2[i]);
			}
		}
		return [].concat(arr,ra);
	},

	/** 
	* Ϊ����Ԫ�ؽ��е��Ʋ�����
	* @method reduce
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ�����
	* @param {any} initial (Optional) ��ʼֵ�����û�����ʼ����ӵ�һ����ЧԪ�ؿ�ʼ��û�г�ʼֵ������û����ЧԪ�أ������쳣
	* @return {any} ���ص��ƽ��. 
	* @example 
		var arr=[1,2,3];
		alert(reduce(arr,function(a,b){return Math.max(a,b);}));
	*/
	reduce:function(arr,callback,initial){
		var len=arr.length;
		var i=0;
		if(arguments.length<3){//�ҵ���һ����ЧԪ�ص�����ʼֵ
			var hasV=0;
			for(;i<len;i++){
				if(i in arr) {initial=arr[i++];hasV=1;break;}
			}
			if(!hasV) throw new Error("No component to reduce");
		}
		for(;i<len;i++){
			if(i in arr) initial=callback(initial,arr[i],i,arr);
		}
		return initial;
	},

	/** 
	* Ϊ����Ԫ�ؽ���������Ʋ�����
	* @method reduceRight
	* @static
	* @param {Array} arr �����������.
	* @param {Function} callback ��Ҫִ�еĺ�����
	* @param {any} initial (Optional) ��ʼֵ�����û�����ʼ����ӵ�һ����ЧԪ�ؿ�ʼ��û�г�ʼֵ������û����ЧԪ�أ������쳣
	* @return {any} ���ص��ƽ��. 
	* @example 
		var arr=[1,2,3];
		alert(reduceRight(arr,function(a,b){return Math.max(a,b);}));
	*/
	reduceRight:function(arr,callback,initial){
		var len=arr.length;
		var i=len-1;
		if(arguments.length<3){//�����ҵ���һ����ЧԪ�ص�����ʼֵ
			var hasV=0;
			for(;i>-1;i--){
				if(i in arr) {initial=arr[i--];hasV=1;break;}
			}
			if(!hasV) throw new Error("No component to reduceRight");
		}
		for(;i>-1;i--){
			if(i in arr) initial=callback(initial,arr[i],i,arr);
		}
		return initial;
	},

	/**
	* ��һ�������ƽ��
	* @method expand
	* @static
	* @param {Array} arrҪ��ƽ��������
	* @return {Array} ��ƽ���������
	*/	
	expand:function(arr){
		return [].concat.apply([], arr);
	},

	/** 
	* ��һ����Arrayת����һ��Array����
	* @method toArray
	* @static
	* @param {Array} arr �������Array�ķ��Ͷ���.
	* @return {Array}  
	*/
	toArray:function(arr){
		var ret=[];
		for(var i=0;i<arr.length;i++){
			ret[i]=arr[i];
		}
		return ret;
	}

};

QW.ArrayH=ArrayH;

})();



/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK
*/

/**
 * @class DateH ���Ķ���Date����չ
 * @singleton 
 * @namespace QW
 * @helper
 */

(function(){

var DateH = {
	/** 
	* ��ʽ������
	* @method format
	* @static
	* @param {Date} d ���ڶ���
	* @param {string} pattern ���ڸ�ʽ(y��M��d��hʱm��s��)��Ĭ��Ϊ"yyyy-MM-dd"
	* @return {string}  ����format����ַ���
	* @example
		var d=new Date();
		alert(format(d," yyyy��M��d��\n yyyy-MM-dd\n MM-dd-yy\n yyyy-MM-dd hh:mm:ss"));
	*/
	format:function(d,pattern)
	{
		pattern=pattern||"yyyy-MM-dd";
		var y=d.getFullYear();
		var o = {
			"M" : d.getMonth()+1, //month
			"d" : d.getDate(),    //day
			"h" : d.getHours(),   //hour
			"m" : d.getMinutes(), //minute
			"s" : d.getSeconds() //second
		}
		pattern=pattern.replace(/(y+)/ig,function(a,b){var len=Math.min(4,b.length);return (y+"").substr(4-len);});
		for(var i in o){
			pattern=pattern.replace(new RegExp("("+i+"+)","g"),function(a,b){return (o[i]<10 && b.length>1 )? "0"+o[i] : o[i]});
		}
		return pattern;
	}
};

QW.DateH = DateH;

})();

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

/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK
*/


/**
 * @class HelperH
 * <p>һ��Helper��ָͬʱ��������������һ������</p>
 * <ol><li>Helper��һ�������п�ö��proto���Եļ򵥶�������ζ���������for...in...ö��һ��Helper�е��������Ժͷ�����</li>
 * <li>Helper����ӵ�����Ժͷ�������Helper�Է����Ķ��������������������</li>
 * <div> 1). Helper�ķ��������Ǿ�̬���������ڲ�����ʹ��this��</div>
 * <div> 2). ͬһ��Helper�еķ����ĵ�һ��������������ͬ���ͻ���ͬ���͡�</div>
 * <li> Helper���͵����ֱ�����Helper���д��ĸH��β�� </li>
 * <li> ����ֻ�����һ����JSON��Ҳ���Ƿ�Helper��ͨ���ԡ�U����util����β�� </li>
 * <li> ����Util��HelperӦ���Ǽ̳й�ϵ������JavaScript�����ǰѼ̳й�ϵ���ˡ�</li>
 * </ol>
 * @singleton
 * @namespace QW
 * @helper
 */

(function(){

var FunctionH = QW.FunctionH,
	ObjectH = QW.ObjectH;

var HelperH = {
	/**
	* ������Ҫ����wrap�����helper���������н����װ
	* @method rwrap
	* @static
	* @param {Helper} helper Helper����
	* @param {Class} wrapper ������ֵ���а�װʱ�İ�װ��(WrapClass)
	* @param {Object} wrapConfig ��Ҫ����Wrap����ķ���������
	* @return {Object} ������rwrap����<strong>�µ�</strong>Helper
	*/
	rwrap: function(helper, wrapper, wrapConfig){
		var ret = {};
		if(null == wrapConfig) wrapConfig = {};

		for(var i in helper){
			if((typeof wrapConfig == "number" || i in wrapConfig) && typeof helper[i] == "function"){
				var wrapC = typeof wrapConfig == "number" ? wrapConfig : wrapConfig[i];
				ret[i] = FunctionH.rwrap(helper[i], wrapper, wrapC);
			}
			else ret[i] = helper[i];
		}
		return ret;
	},
	/**
	* �������ã�����gsetter�·���������駲����Ĳζ�����������getter����setter
	* @method gsetter
	* @static
	* @param {Helper} helper Helper����
	* @param {Object} gsetterConfig ��Ҫ����Wrap����ķ���������
	* @return {Object} ������rwrap����<strong>�µ�</strong>helper
	*/
	gsetter: function(helper,gsetterConfig){
		gsetterConfig=gsetterConfig||{};
		for(var i in gsetterConfig){
			helper[i]=function(config){
				return function(){return helper[config[Math.min(arguments.length,config.length)-1]].apply(null,arguments);}
			}(gsetterConfig[i]);
		}
		return helper;
	},
	/**
	* ��helper�ķ���������mul����ʹ���ڵ�һ������Ϊarrayʱ�����Ҳ����һ������
	* @method mul
	* @static
	* @param {Object} helper Helper����
	* @param {boolean} recursive (Optional) �Ƿ�ݹ�
	* @return {Object} ������mul����<strong>�µ�</strong>Helper
	*/
	mul: function (helper, recursive){ 
		var ret = {};
		for(var i in helper){
			if(typeof helper[i] == "function")
				ret[i] = FunctionH.mul(helper[i], recursive);
			else
				ret[i] = helper[i];
		}
		return ret;
	},
	/**
	* ��һ��HelperӦ�õ�ĳ��Object�ϣ�Helper�ϵķ�����Ϊ��̬����������extend(obj,helper)
	* @method applyTo
	* @static
	* @param {Object} helper Helper������DateH
	* @param {Object} obj Ŀ�����.
	* @return {Object} Ӧ��Helper��Ķ��� 
	*/
	applyTo: function(helper,obj){

		return ObjectH.mix(obj, helper);  //��������
	},
	/**
	* ��helper�ķ���������methodize����ʹ��ĵ�һ������Ϊthis����this[attr]��
	* <strong>methodize������������helper�ϵķ�function���Ա�Լ��������»��߿�ͷ�ĳ�Ա��˽�г�Ա��</strong>
	* @method methodize
	* @static
	* @param {Object} helper Helper������DateH
	* @param {string} attr (Optional)����
	* @return {Object} ������methodize����<strong>�µ�</strong>Helper
	*/
	methodize: function(helper, attr){
		var ret = {};
		for(var i in helper){
			if(typeof helper[i] == "function" && !/^_/.test(i)){
				ret[i] = FunctionH.methodize(helper[i], attr); 
			}
		}
		return ret;
	},
	/**
	* <p>��һ��HelperӦ�õ�ĳ��Object�ϣ�Helper�ϵķ�����Ϊ���󷽷�</p>
	* @method methodizeTo
	* @static
	* @param {Object} helper Helper������DateH
	* @param {Object} obj  Ŀ�����.
	* @param {string} attr (Optional) ��װ�����core�������ơ����Ϊ�գ�����this��������this[attr]������Helper�����ĵ�һ������
	* @return {Object} Ӧ��Helper��Ķ���
	*/
	methodizeTo: function(helper, obj, attr){

		helper = HelperH.methodize(helper,attr);	//������
		
		return ObjectH.mix(obj, helper);  //��������		 
	}
};

QW.HelperH = HelperH;
})();

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



/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK
*/

/**
 * @class Selector Css Selector��صļ�������
 * @singleton
 * @namespace QW
 */
(function(){
var trim=QW.StringH.trim;

var Selector={
	/**
	 * @property {int} queryStamp ���һ�β�ѯ��ʱ�������չα��ʱ���ܻ��õ���������
	 */
	queryStamp:0,
	/**
	 * @property {Json} _operators selector���������
	 */
	_operators:{	//���±��ʽ��aa��ʾattrֵ��vv��ʾ�Ƚϵ�ֵ
		'': 'aa',//isTrue|hasValue
		'=': 'aa=="vv"',//equal
		'!=': 'aa!="vv"', //unequal
		'~=': 'aa&&(" "+aa+" ").indexOf(" vv ")>-1',//onePart
		'|=': 'aa&&(aa+"-").indexOf("vv-")==0', //firstPart
		'^=': 'aa&&aa.indexOf("vv")==0', // beginWith
		'$=': 'aa&&aa.lastIndexOf("vv")==aa.length-"vv".length', // endWith
		'*=': 'aa&&aa.indexOf("vv")>-1' //contains
	},
	/**
	 * @property {Json} _shorthands ����д��
	 */
    _shorthands: [
		[/\#([\w\-]+)/g,'[id="$1"]'],//id����д��
		[/^([\w\-]+)/g, function(a,b){return '[tagName="'+b.toUpperCase()+'"]';}],//tagName����д��
		[/\.([\w\-]+)/g, '[className~="$1"]'],//className����д��
		[/^\*/g, '[tagName]']//����tagName����д��
	],
	/**
	 * @property {Json} _pseudos α���߼�
	 */
	_pseudos:{
		"first-child":function(a){return a.parentNode.getElementsByTagName("*")[0]==a;},
		"last-child":function(a){return !(a=a.nextSibling) || !a.tagName && !a.nextSibling;},
		"only-child":function(a){return getChildren(a.parentNode).length==1;},
		"nth-child":function(a,iFlt){return iFlt(getNth(a,false)); },
		"nth-last-child":function(a,iFlt){return iFlt(getNth(a,true)); },
		"first-of-type":function(a){ var tag=a.tagName; while(a=a.previousSlibling){if(a.tagName==tag) return false;} return true;},
		"last-of-type":function(a){ var tag=a.tagName; while(a=a.nextSibling){if(a.tagName==tag) return false;} return true; },
		"only-of-type":function(a){var els=a.parentNode.childNodes; for(var i=els.length-1;i>-1;i--){if(els[i].tagName==a.tagName && els[i]!=a) return false;} return true;},
		"nth-of-type":function(a,iFlt){var idx=1,tag=a.tagName;while(a=a.previousSibling) {if(a.tagName==tag) idx++;} return iFlt(idx); },//JK������Ϊ������α���������Ż�
		"nth-last-of-type":function(a,iFlt){var idx=1,tag=a.tagName;while(a=a.nextSibling) {if(a.tagName==tag) idx++;} return iFlt(idx); },//JK������Ϊ������α���������Ż�
		"empty":function(a){ return !a.firstChild; },
		"parent":function(a){ return !!a.firstChild; },
		"not":function(a,sFlt){ return !sFlt(a); },
		"enabled":function(a){ return !a.disabled; },
		"disabled":function(a){ return a.disabled; },
		"checked":function(a){ return a.checked; },
		"contains":function(a,s){return (a.textContent || a.innerText || "").indexOf(s) >= 0;}
	},
	/**
	 * @property {Json} _attrGetters ���õ�Element����
	 */
	_attrGetters:function(){ 
		var o={'class': 'el.className',
			'for': 'el.htmlFor',
			'href':'el.getAttribute("href",2)'};
		var attrs='name,id,className,value,selected,checked,disabled,type,tagName,readOnly'.split(',');
		for(var i=0,a;a=attrs[i];i++) o[a]="el."+a;
		return o;
	}(),
	/**
	 * @property {Json} _relations selector��ϵ�����
	 */
	_relations:{
		//Ѱ��
		"":function(el,filter,topEl){
			while((el=el.parentNode) && el!=topEl){
				if(filter(el)) return el;
			}
			return null;
		},
		//Ѱ��
		">":function(el,filter,topEl){
			el=el.parentNode;
			return el!=topEl&&filter(el) ? el:null;
		},
		//Ѱ��С�ĸ��
		"+":function(el,filter){
			while(el=el.previousSibling){
				if(el.tagName){
					return filter(el) && el;
				}
			}
			return null;
		},
		//Ѱ���еĸ��
		"~":function(el,filter){
			while(el=el.previousSibling){
				if(el.tagName && filter(el)){
					return el;
				}
			}
			return null;
		}
	},
	/** 
	 * ��һ��selector�ַ���ת����һ�����˺���.
	 * @method selector2Filter
	 * @static
	 * @param {string} sSelector ����selector�����selector��û�й�ϵ�������", >+~"��
	 * @returns {function} : ���ع��˺�����
	 * @example: 
		var fun=selector2Filter("input.aaa");alert(fun);
	 */
	selector2Filter:function(sSelector){
		return s2f(sSelector);
	},
	/** 
	 * �ж�һ��Ԫ���Ƿ����ĳselector.
	 * @method test 
	 * @static
	 * @param {HTMLElement} el: ���������
	 * @param {string} sSelector: ����selector�����selector��û�й�ϵ�������", >+~"��
	 * @returns {function} : ���ع��˺�����
	 */
	test:function(el,sSelector){
		return s2f(sSelector)(el);
	},
	/** 
	 * ��refElΪ�ο����õ����Ϲ���������HTML Elements. refEl������element������document
	 * @method query
	 * @static
	 * @param {HTMLElement} refEl: �ο�����
	 * @param {string} sSelector: ����selector,
	 * @returns {array} : ����elements���顣
	 * @example: 
		var els=query(document,"li input.aaa");
		for(var i=0;i<els.length;i++ )els[i].style.backgroundColor='red';
	 */
	query:function(refEl,sSelector){
		Selector.queryStamp = queryStamp++;
		refEl=refEl||document.documentElement;
		var els=nativeQuery(refEl,sSelector);
		if(els) return els;//����ʹ��ԭ����
		var groups=trim(sSelector).split(",");
		var els=querySimple(refEl,groups[0]);
		for(var i=1,gI;gI=groups[i];i++){
			var els2=querySimple(refEl,gI);
			els=els.concat(els2);
			//els=union(els,els2);//���ػ�̫���������˹���
		}
		return els;
	}

};

/*
	retTrue һ������Ϊtrue�ĺ���
*/
function retTrue(){
	return true;
}

/*
	arrFilter(arr,callback) : ��arr���Ԫ�ؽ��й���
*/
function arrFilter(arr,callback){
	if(callback==retTrue){
		if(arr instanceof Array) return arr;
		else{
			for(var rlt=[],i=0,len=arr.length;i<len;i++) {
				rlt[i]=arr[i];
			}
		}
	}
	else{
		for(var rlt=[],i=0,oI;oI=arr[i++];) {
			callback(oI) && rlt.push(oI);
		}
	}
	return rlt;
};

var elContains,//�����������֧��contains()������FF
	getChildren,//�����������֧��children������FF3.5-
	hasNativeQuery,//�����������֧��ԭ��querySelectorAll()������IE8-
	findId=function(id) {return document.getElementById(id);};

(function(){
	var div=document.createElement('div');
	div.innerHTML='<div class="aaa"></div>';
	hasNativeQuery=(div.querySelectorAll && div.querySelectorAll('.aaa').length==1);
	elContains=div.contains?
		function(pEl,el){ return pEl!=el && pEl.contains(el);}:
		function(pEl,el){ return (pEl.compareDocumentPosition(el) & 16);};
	getChildren=div.children?
		function(pEl){ return pEl.children;}:
		function(pEl){ 
			return arrFilter(pEl.children,function(el){return el.tagName;});
		};
})();



/*
 * nth(sN): ����һ���жϺ��������ж�һ�����Ƿ�����ĳ���ʽ��
 * @param { string } sN: ���ʽ���磺'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
 * @return { function } function(i){return i����sN}: �����жϺ�����
 */
function nth(sN){
	if(sN=="even") sN='2n';
	if(sN=="odd") sN='2n+1';
	sN=sN.replace(/(^|\D+)n/g,"$11n");
	if(!(/n/.test(sN))) {
		return function(i){return i==sN;}
	}
	else{
		var arr=sN.split("n");
		var a=arr[0]|0, b=arr[1]|0;
		return function(i){var d=i-b; return d>=0 && d%a==0;};
	}
}

/*
 * getNth(el,reverse): �õ�һ��Ԫ�ص�nthֵ��
 * @param { element } el: HTML Element
 * @param { boolean } : �Ƿ����㣭�����Ϊ�棬�൱��nth-last
 * @return { int } : ����nthֵ
 */
function getNth(el,reverse){
	var pEl=el.parentNode;
	if(pEl.__queryStamp!=queryStamp){
		var els=getChildren(pEl);
		for(var i=0,elI;elI=els[i++];){
			elI.__siblingIdx=i;
		};
		pEl.__queryStamp=queryStamp;
		pEl.__childrenNum=i;
	}
	if(reverse) return pEl.__childrenNum-el.__siblingIdx+1;
	else return el.__siblingIdx;
}

/*
 * s2f(sSelector): ��һ��selector�õ�һ�����˺���filter�����selector��û�й�ϵ�������", >+~"��
 */
function s2f(sSelector){
	var pseudos=[];//α������,ÿһ��Ԫ�ض������飬����Ϊ��α������α��ֵ
	var attrs=[];//�������飬ÿһ��Ԫ�ض������飬����Ϊ�������������ԱȽϷ����Ƚ�ֵ
	var s=trim(sSelector);
	s=s.replace(/\:([\w\-]+)(\(([^)]+)\))?/g,function(a,b,c,d,e){pseudos.push([b,d]);return "";});//α��
	for(var i=0,shorthands=Selector._shorthands,sh;sh=shorthands[i];i++)
		s=s.replace(sh[0],sh[1]);
	var reg=/\[\s*([\w\-]+)\s*([!~|^$*]?\=)?\s*(?:(["']?)([^\]'"]*)\3)?\s*\]/g; //����ѡ����ʽ����
	s=s.replace(reg,function(a,b,c,d,e){attrs.push([b,c||"",e||""]);return "";});//��ͨд��[foo][foo=""][foo~=""]��
	if(!(/^\s*$/).test(s)) {
		var ex="Unsupported Selector:\n"+sSelector+"\n-"+s; 
		throw ex;
	}

	//�����Ͻ��������ת���ɹ��˺���
	var flts=[];
	if(attrs.length){
		var sFun=[];
		for(var i=0,attr;attr=attrs[i];i++){//���Թ���
			var attrGetter=Selector._attrGetters[attr[0]] || 'el.getAttribute("'+attr[0]+'")';
			sFun.push(Selector._operators[attr[1]].replace(/aa/g,attrGetter).replace(/vv(?=\W)/g,attr[2]));
		}
		sFun='return '+sFun.join("&&");
		flts.push(new Function("el",sFun));
	}
	for(var i=0,pI;pI=pseudos[i];i++) {//α�����
		var fun=Selector._pseudos[pI[0]];
		if(!fun) {
			var ex="Unsupported Selector:\n"+pI[0]+"\n"+s;
			throw ex;
		}
		if(pI[0].indexOf("nth-")==0){ //��α�������ת���ɹ��˺�����
			flts.push(function(fun,arg){return function(el){return fun(el,arg);}}(fun,nth(pI[1])));
		}
		else if(pI[0]=="not"){ //��α�������ת���ɹ��˺�����
			flts.push(function(fun,arg){return function(el){return fun(el,arg);}}(fun,s2f(pI[1])));
		}
		else if(pI[0]=="contains"){ //��α�������ת���ɹ��˺�����
			flts.push(function(fun,arg){return function(el){return fun(el,arg);}}(fun,pI[1]));
		}
		else flts.push(fun);
	}
	//�����ռ�filter function
	var fltsLen=flts.length;
	switch(fltsLen){//����Խ��Խ��
		case 0: return retTrue;
		case 1: return flts[0];
		case 2: return function(el){return flts[0](el)&&flts[1](el);};
	}
	return function(el){
		for (var i=0;i<fltsLen;i++){
			if(!flts[i](el)) return false;
		}
		return true;
	};
};

/* 
	* {int} xxxStamp: ȫ�ֱ�����ѯ���
 */
var queryStamp=0,
	relationStamp=0,
	querySimpleStamp=0;

/*
* nativeQuery(refEl,sSelector): �����ԭ����querySelectorAll������ֻ�Ǽ򵥲�ѯ�������ԭ����query�����򷵻�null. 
* @param {Element} refEl �ο�Ԫ��
* @param {string} sSelector selector�ַ���
* @returns 
*/
function nativeQuery(refEl,sSelector){
		if(hasNativeQuery && /((^|,)\s*[^>+~][.\w\s\->,+~]*)+$/.test(sSelector)) {
			//���������Դ���querySelectorAll�����ұ���query���Ǽ�selector����ֱ�ӵ���selector�Լ���
			//�����������֧����">~+"��ʼ�Ĺ�ϵ�����
			var arr=[],els=refEl.querySelectorAll(sSelector);
			for(var i=0,elI;elI=els[i++];) arr.push(elI);
			return arr;
		}
		return null;
};

/* 
* querySimple(pEl,sSelector): �õ�pEl�µķ��Ϲ���������HTML Elements. 
* sSelector��û��","�����
* pEl��Ĭ����document.body 
* @see: query��
*/
function querySimple(pEl,sSelector){
	querySimpleStamp++;
	/*
		Ϊ����߲�ѯ�ٶȣ�����������ԭ��
		�����ȣ�ԭ����ѯ
		�����ȣ���' '��'>'��ϵ������ǰ���������򣨴��浽���ѯ
		�����ȣ�id��ѯ
		�����ȣ�ֻ��һ����ϵ������ֱ�Ӳ�ѯ
		��ԭʼ���ԣ����ù�ϵ�жϣ���������ײ������ϲ����ߣ������óɹ�������������
	*/

	//�����ȣ�ԭ����ѯ
	var els=nativeQuery(pEl,sSelector);
	if(els) return els;//����ʹ��ԭ����


	var sltors=[];
	var reg=/(^|\s*[>+~ ]\s*)(([\w\-\:.#*]+|\([^\)]*\)|\[[^\]]*\])+)(?=($|\s*[>+~ ]\s*))/g;
	var s=trim(sSelector).replace(reg,function(a,b,c,d){sltors.push([trim(b),c]);return "";});
	if(!(/^\s*$/).test(s)) {
		var ex="Unsupported Selector:\n"+sSelector+"\n--"+s; 
		throw ex;
	}

	//�����ȣ���' '��'>'��ϵ������ǰ���������򣨴��ϵ��£���ѯ
	var pEls=[pEl];
	var sltor0;
	while(sltor0=sltors[0]){
		if(!pEls.length) return [];
		var relation=sltor0[0];
		els=[];
		if(relation=='+'){//��һ���ܵ�
			filter=s2f(sltor0[1]);
			for(var i=0,pElI;pElI=pEls[i++];){
				var elI=pElI;
				while(elI=elI.nextSibling){
					if(elI.tagName){
						if(filter(elI)) els.push(elI);
						break;
					}
				}
			}
			pEls=els;
			sltors.splice(0,1);
		}
		else if(relation=='~'){//���еĵܵ�
			filter=s2f(sltor0[1]);
			for(var i=0,pElI;pElI=pEls[i++];){
				var elI=pElI;
				if(i>1 && pElI.parentNode==pEls[i-2].parentNode) continue;//���أ�����Ѿ�query���ֳ����򲻱�query�ܵ�
				while(elI=elI.nextSibling){
					if(elI.tagName){
						if(filter(elI)) els.push(elI);
					}
				}
			}
			pEls=els;
			sltors.splice(0,1);
		}
		else{
			break;
		}
	}
	if(!sltors.length || !pEls.length) return pEls;
	
	//�����ȣ�idIdx��ѯ
	for(var idIdx=0;sltor=sltors[idIdx];idIdx++){
		if((/^[.\w-]*#([\w-]+)/i).test(sltor[1])) break;
	}
	if(idIdx<sltors.length){//����id
		var idEl=findId(RegExp.$1);
		if(!idEl) return [];
		for(var i=0,pElI;pElI=pEls[i++];){
			if(elContains(pElI,idEl)) {
				els=filterByRelation(pEl,[idEl],sltors.slice(0,idIdx+1));
				if(!els.length || idIdx==sltors.length-1) return els;
				return querySimple(idEl,sltors.slice(idIdx+1).join(',').replace(/,/g,' '));
			}
		}
		return [];
	}

	//---------------
	var getChildrenFun=function(pEl){return pEl.getElementsByTagName(tagName);},
		tagName='*',
		className='';
	sSelector=sltors[sltors.length-1][1];
	sSelector=sSelector.replace(/^[\w\-]+/,function(a){tagName=a;return ""});
	if(hasNativeQuery){
		sSelector=sSelector.replace(/^[\w\*]*\.([\w\-]+)/,function(a,b){className=b;return ""});
	}
	if(className){
		getChildrenFun=function(pEl){return pEl.querySelectorAll(tagName+'.'+className);};
	}

	//�����ȣ�ֻʣһ��'>'��' '��ϵ��(���ǰ��Ĵ��룬��ʱ�����ܳ��ֻ�ֻʣ'+'��'~'��ϵ��)
	if(sltors.length==1){
		if(sltors[0][0]=='>') {
			getChildrenFun=getChildren;
			var filter=s2f(sltors[0][1]);
		}
		else{
			filter=s2f(sSelector);
		}
		els=[];
		for(var i=0,pElI;pElI=pEls[i++];){
			els=els.concat(arrFilter(getChildrenFun(pElI),filter));
		}
		return els;
	}

	//�ߵ�һ����ϵ����'>'��' '�����ܷ���
	sltors[sltors.length-1][1] = sSelector;
	els=[];
	for(var i=0,pElI;pElI=pEls[i++];){
		els=els.concat(filterByRelation(pElI,getChildrenFun(pElI),sltors));
	}
	return els;
};

/*
�ж�һ������������ڵ��Ƿ������ϵҪ��----�ر�˵��������ĵ�һ����ϵֻ���Ǹ��ӹ�ϵ���������ϵ;
*/

function filterByRelation(pEl,els,sltors){
	relationStamp++;
	var sltor=sltors[0],
		len=sltors.length,
		relationJudge=sltor[0]?	//
			function(el){return el.parentNode==pEl;}:
			retTrue;
	var filters=[],
		reations=[],
		needNext=[];
		
	for(var i=0;i<len;i++){
		sltor=sltors[i];
		filters[i]=s2f(sltor[1]);//����
		reations[i]=Selector._relations[sltor[0]];//Ѱ�׺���
		if(sltor[0]=='' || sltor[0]=='~') needNext[i]=true;//�Ƿ�ݹ�Ѱ��
	}
	els=arrFilter(els,filters[len-1]);//�������
	if(len==1) return arrFilter(els,relationJudge);

	function chkRelation(el){//��ϵ�˹���
		var parties=[],//�м��ϵ��
			j=len-1,
			party=parties[j]=reations[j](el,filters[j-1],pEl);
		if(!party) {
			return false;
		}
		for(j--;j>-1;j--){
			if(party){
				if(j==0){
					if(relationJudge(party)) return true;//ͨ�����ļ��
					else party=null;//�����һ�ر����
				}
				//else if(sltors[j][5] && !elContains(pEl,party)) party=null;//�ҹ�ͷ��
				else{
					party=parties[j]=reations[j](parties[j+1],filters[j-1],pEl);
					if(party) continue;
				}
			}
			while (!party){//����
				j++;//����һ��
				if(j==len) return false;//�˵�����
				if(needNext[j]) party=parties[j]=reations[j](parties[j],filters[j-1],pEl);
			}
			party=parties[j]=reations[j](parties[j+1],filters[j-1],pEl);

		}
	};
	return arrFilter(els,chkRelation);
}

QW.Selector=Selector;
})();

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



/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: wangchen
*/
/** 
* @class EventW Event Wrap��event�����װ��
* @namespace QW
*/
QW.EventW = function () {
	this.chromeHack; //chrome bug hack

	/** 
	* @property core ԭ��Eventʵ��
	* @type {Event}
	*/
	this.core = QW.EventH.getEvent.apply(null, arguments);

	/** 
	* @property target �¼�������Ԫ��
	* @type {HTMLElement}
	*/
	this.target = this.target();

	/** 
	* @property relatedTarget mouseover/mouseout �¼�ʱ��Ч overʱΪ��ԴԪ��,outʱΪ�ƶ�����Ԫ��.
	* @type {HTMLElement}
	*/
	this.relatedTarget = this.relatedTarget();

	/** 
	* @property pageX ���λ������ҳ���X����
	* @type {int}
	*/
	this.pageX = this.pageX();

	/** 
	* @property pageX ���λ������ҳ���Y����
	* @type {int}
	*/
	this.pageY = this.pageY();
	//this.layerX = this.layerX();
	//this.layerY = this.layerY();

	/** 
	* @property detail �����ַ��� ����0����,С��0����.
	* @type {int}
	*/
	this.detail = this.detail();

	/** 
	* @property keyCode �¼������İ�����Ӧ��ascii��
	* @type {int}
	*/
	this.keyCode = this.keyCode();

	/** 
	* @property ctrlKey �¼�����ʱ�Ƿ������סctrl��
	* @type {boolean}
	*/
	this.ctrlKey = this.ctrlKey();

	/** 
	* @property shiftKey �¼�����ʱ�Ƿ������סshift��
	* @type {boolean}
	*/
	this.shiftKey = this.shiftKey();

	/** 
	* @property altKey �¼�����ʱ�Ƿ������סalt��
	* @type {boolean}
	*/
	this.altKey = this.altKey();

	/** 
	* @property button �¼�����������λ(������) ����ie��������������Ժܲ���ͬ������û�������ݴ������ﷵ�ص���ԭ�����
	* @type {boolean}
	*/
	this.button = this.core.button;
};

QW.HelperH.methodizeTo(QW.EventH, QW.EventW.prototype, 'core');

/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: wangchen
*/

/**
 * @class DomU DomU�����ռ䣬�ռ�һЩ���õ�Dom��ط���
 * @singleton
 * @namespace QW
*/

(function(){
var Browser=QW.Browser,
	mix=QW.ObjectH.mix,
	Selector=QW.Selector;
function $F(s) { return parseInt(s)||0;};

var DomU={
	/** 
	* ��cssselector��ȡԪ�ؼ� 
	* @method	query
	* @param	{String} sSelector cssselector�ַ���
	* @param	{Element} refEl (Optional) �ο�Ԫ�أ�Ĭ��Ϊdocument.documentElement
	* @return	{Array}
	*/
	query: function (sSelector,refEl) {
		return Selector.query(refEl || document.documentElement,sSelector);
	},
	/** 
	* ͨ��html�ַ�������DOM���� 
	* @method	create
	* @param	{string}	html html�ַ���
	* @param	{boolean}	rfrag (Optional) �Ƿ񷵻�documentFragment����
	* @param	{document}	doc (Optional)��IE���ͬdocument�µ�element���ܽ���append����������£���Ҫ����document����
	* @return	{HTMLElement | Fragment}	���ش�����element�����documentFragment����
	*/
	create : function () {
		var temp = document.createElement('div');
		return function (html, rfrag, doc) {
			var temp2=doc && doc.createElement('div') || temp;
			temp2.innerHTML = html;
			var el=temp2.firstChild;
			if (!el || !rfrag) {
				return el;
			} else {
				var frag = (doc || document).createDocumentFragment();
				while (el=temp2.firstChild) frag.appendChild(el);
				return frag;
			}
		};
	}(),
	/** 
	* ����htmlԪ�� 
	* @method	createElement
	* @param	{string}	tagName tagName
	* @param	{Json}	opts (Optional) �ζ����
	* @return	{HTMLElement}	���ش�����element
	*/
	createElement : function (tagName, opts) {
		var el=document.createElement(tagName);
		if(opts){
			for(var i in opts) el[i]=opts[i];
		}
		return el;
	},
	/** 
	* ��NodeCollectionתΪElementCollection
	* @method	pluckWhiteNode
	* @param	{NodeCollection|array} list Node�ļ���
	* @return	{array}						Element�ļ���
	*/
	pluckWhiteNode : function (list) {
		for (var result = [], i = 0,el; el=list[i++] ;)
			if (el.nodeType==1) result.push(el);
		return result;
	},
	/** 
	* �ж�Nodeʵ���Ƿ�̳���Element�ӿ�
	* @method	isElement
	* @param	{object} el Node��ʵ��
	* @return	{boolean}		 �жϽ��
	*/
	isElement : function (el) {
		return !!(el && el.nodeType == 1);
	},
	/**
	* ����rect1�Ƿ���������rect2
	* @method	rectContains
	* @param	{Region} rect1 �ο�����1
	* @param	{Region} rect2 �ο�����2
	* @return	{boolean} ���rect1��������rect2������true�����򷵻�false��
	*/
	rectContains: function (rect1, rect2) {
		return ( rect1.left   <= rect2.left   && 
			rect1.right  >= rect2.right  && 
			rect1.top    <= rect2.top    && 
			rect1.bottom >= rect2.bottom  );
	},
	/**
	* rectIntersect(rect1, rect2): �õ�����������ص�����
	* @method	rectIntersect
	* @param	{rect} rect1 �ο�����1
	* @param	{rect} rect2 �ο�����2
	* @return	{rect} ��������������ص����򷵻��ص����򣬷��򷵻�null��
	*/
	rectIntersect: function (rect1, rect2) {
		var t = Math.max( rect1.top,    rect2.top    ),
			r = Math.min( rect1.right,  rect2.right  ),
			b = Math.min( rect1.bottom, rect2.bottom ),
			l = Math.max( rect1.left,   rect2.left   );
		if (b >= t && r >= l) {
			return {left:l, top:t, width:r-l, height:b-t, right:r, bottom:b};
		} else {
			return null;
		}
	},
	/**
	* �õ�ҳ������������Ϣ
	* @method	getDocRect
	* @param	{window} win ���봰�ڶ���Ĭ��Ϊ��ǰwindow����
	* @return	{Json} ������������:		
		{'scrollLeft': 1,  'scrollTop':1,
		'width'  : 1, 'height':1,
		'scrollWidth' : 1, 'scrollHeight': 1}
	*/
	getDocRect: function (win) {
		win=win||window;
		var doc = win.document,
			docEl=doc.documentElement,
			bd=doc.body,
			left = win.pageXOffset || Math.max($F(docEl.scrollLeft),$F(bd.scrollLeft)),
			top = win.pageYOffset || Math.max($F(docEl.scrollTop),$F(bd.scrollTop)),
			width = $F(docEl.clientWidth),
			height = $F(docEl.clientHeight),
			scrollHeight = Math.max ($F(docEl.scrollHeight), $F(bd.offsetHeight)),
			scrollWidth = Math.max ($F(docEl.scrollWidth),  $F(bd.offsetWidth));

		if((!doc.compatMode || doc.compatMode == 'CSS1Compat') 
			&& !Browser.opera	&& docEl.clientWidth) {
			//just as default;
		} else if (bd.clientWidth) {
			height = bd.clientHeight;
			width  = bd.clientWidth;
		} else if(win.innerWidth) {
			height = win.innerHeight;
			width  = win.innerWidth;
		} 

		if(Browser.safari) {
			scrollHeight = Math.max(scrollHeight, $F(bd.scrollHeight));
			scrollWidth = Math.max(scrollWidth, $F(bd.scrollWidth));
		}

		scrollHeight = Math.max(height,scrollHeight);
		scrollWidth = Math.max(width,scrollWidth);

		return {
		'scrollLeft': left,  'scrollTop':top,
		'width'  : width, 'height':height,
		'scrollWidth' : scrollWidth, 'scrollHeight': scrollHeight
		}
	},
	/** 
	* ����DOM���ṹ��ʼ������¼�
	* @method	ready
	* @param	{function} handler �¼��������
	* @return	{void}
	*/
	ready : function (handler) {
		if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', handler, false);
		} else {
			var fireDOMReadyEvent = function () {
				fireDOMReadyEvent = new Function;
				handler();
			};
			(function () {
				try {
					document.body.doScroll('left');
				} catch(ex) {
					setTimeout(arguments.callee, 10);
					return ;
				}
				fireDOMReadyEvent();
			})();
			document.attachEvent('onreadystatechange', function () {
				/^(?:loaded|complete)$/.test(document.readyState) && fireDOMReadyEvent();
			});
		}
	}
};

QW.DomU=DomU;
})();



/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: wangchen
	author: JK
*/


/**
 * @class NodeH Element����չ
 * @singleton
 * @namespace QW
 * @helper
 */
(function(){
var StringH=QW.StringH,
	trim=StringH.trim,
	camelize=StringH.camelize,
	decamelize=StringH.decamelize,
	mix=QW.ObjectH.mix,
	getDocRect=QW.DomU.getDocRect,
	create=QW.DomU.create,
	Selector=QW.Selector,
	query=Selector.query,
	selector2Filter=Selector.selector2Filter,
	Browser=QW.Browser;
/**
* �õ�һ��HTML Element����������������ַ������ͷ��ز�������. 
* @method	$
* @param	{String} id HTML Element��id.
* @param	{document} doc Ŀ��document.
* @return	{Object} ����������ַ������ͷ���document.getElementById������ͷ��ز�������
*/
function $(id, doc){
	if ('string' == typeof id) 
		return (doc || document).getElementById(id);
	else
		return (id && ('core' in id)) ? $(id.core,doc) : id;
};

var NodeH={
	//--//JsDataϵ��
	/**
	* JsData һ�������ռ䣬����������Ԫ�ض�Ӧ����.
	* @property	{Json} JsData ����������Ԫ�ض�Ӧ��ĳЩ������
		ʾ����
		{
			valid:{
				'.date':{'format':'yyyy-mm-dd','minValue':'2008-01-01'},
				'#myDate':{'minDate':'2009-01-01'}
			},
			effect:{
				'DIV':{easing:function(per){return per}},
				'.slow':{per:50}
			}
		}
	*/
	JsData:{},
	/** 
	* ��JsData�л�ȡelement���������
	* @method	getJsAttr
	* @param	{HTMLElement} el Ŀ�����
	* @param	{string} attribute ��������
	* @param	{string|Json} ns ������ַ�������ns=NodeH.JsData[ns]�����������һ��Json������
	* @return	{any}
	*/
	getJsAttr: function (el, attribute, ns) {
		el=$(el);
		if(typeof ns =='string') ns=NodeH.JsData[ns];
		var keys=(el.id && ['#'+el.id] || []).concat(el.className.match(/\.[\w\-]+/g) ||[], el.tagName),//���ȶ�:id>className>tagName
			len=keys.length;
		for(var i=0;i<len;i++){
			var key=keys[i];
			if((key in ns) && (attribute in ns[key])) return ns[key][attribute];
		}
		return null;
	},
	/** 
	* ��ȡelement���������,���δ��ȡ�ɹ������JsData�л�ȡelement���������
	* @method	getExAttr
	* @param	{HTMLElement} el Ŀ�����
	* @param	{string} attribute ��������
	* @optional	{string|Json} ns ��ο�getJsAttr��ns����
	* @return	{any}
	*/
	getExAttr: function (el, attribute, ns) {
		el=$(el);
		if(attribute in el) return el[attribute];
		var value=el.getAttribute(attribute);
		if(value) return value;
		return NodeH.getJsAttr(el,attribute,ns);
	},

	//--//����ΪgetElementsϵ��
	$:$,
	/**
	* ����"$"��һ������. 
	* @method	g
	* @see	$
	*/
	query:function(refEl,sSelector){
		var el2=$(refEl);
		if(refEl && !el2) throw new Error('null');//��������׳��쳣��refEl��һ���Ҳ��������id��
		return query(el2,sSelector);
	},
	/**
	* ͨ��className���õ�Ԫ�ؼ���.
	* @method	getElementsByClass
	* @param	{HTMLElement} refEl ��������
	* @param	{string} className className.
	* @return	{Array} ����Element����
	*/
	getElementsByClass:function(refEl,className){
		return NodeH.query(refEl,"."+className);
	},
	/**
	* ͨ��className���õ�Ԫ�ؼ���.
	* @method	getElementsByTagName
	* @param	{string} tagName tagName.
	* @param	{HTMLElement} pEl ��������
	* @return	{Array} ����Element����
	*/
	getElementsByTagName:function(pEl,tagName){
		return NodeH.query(pEl,tagName);
	},

	//--// Dom�ж���Dom��ϵϵ��
	/**
	* ����������������Ƚڵ�
	* @method	ancestorNode
	* @param	{String} sSelector cssѡ����������Ϊ��
	* @return	{HTMLElement} �����������������Ƚڵ㣬���û�����Ƚڵ������������򷵻�null
	*/
	ancestorNode: function(el, sSelector) {
		return findFirst($(el).parentNode,'parentNode',sSelector);
	},
	/**
	* ��������������ܵܽڵ�
	* @method	nextSibling
	* @param	{String} sSelector cssѡ����������Ϊ��
	* @return	{HTMLElement} �������������ĵܵܽڵ㣬���û�еܵܽڵ������������򷵻�null
	*/
	nextSibling: function (el,sSelector) {
		return findFirst($(el).nextSibling,'nextSibling',sSelector);
	},
	/**
	* ��������������ֳ��ڵ�
	* @method	previousSibling
	* @param	{String} sSelector cssѡ����������Ϊ��
	* @return	{HTMLElement} ���������������ֳ��ڵ㣬���û���ֳ��ڵ������������򷵻�null
	*/
	previousSibling: function (el,sSelector) {
		return findFirst($(el).previousSibling,'previousSibling',sSelector);
	},
	/**
	* ������������Ķ���
	* @method	firstChild
	* @param	{String} sSelector cssѡ����������Ϊ��
	* @return	{HTMLElement} ����������������Ķ��ӣ����û�ж��������������򷵻�null
	*/
	firstChild: function (el,sSelector) {
		return findFirst($(el).firstChild,'nextSibling',sSelector);
	},
	/**
	* ������������С�Ķ���
	* @method	lastChild
	* @param	{String} sSelector cssѡ����������Ϊ��
	* @return	{HTMLElement} ����������������Ķ��ӣ����û�ж��������������򷵻�null
	*/
	lastChild: function (el,sSelector) {
		return findFirst($(el).lastChild,'previousSibling',sSelector);
	},
	/**
	* һ��Ԫ���Ƿ������һ��Ԫ��
	* @method	contains
	* @param	{HTMLElement} pEl ��Ԫ��
	* @param	{HTMLElement} el ��(��)Ԫ��
	* @return	{HTMLElement} ����ǰ�����ϵ������true�����򷵻�false
	*/
	contains: function (pEl, el) {
		pEl=$(pEl);
		el=$(el);
		return pEl.contains ? 
			pEl != el && pEl.contains(el) : 
			!!(pEl.compareDocumentPosition(el) & 16);
	},


	//--// Dom�ڵ����ϵ��
	/**
	* appendChild
	* @method	appendChild
	* @see	DOMLevel1.appendChild
	*/
	appendChild: function (pEl, el) {
		return $(pEl).appendChild($(el));
	},
	/** 
	* ��element�����ڲ���ĳԪ��ǰ����element����
	* @method	insertBefore
	* @param	{HTMLElement} el	id,Elementʵ����wrap
	* @param	{HTMLElement} nel	Ŀ��id,Elementʵ����wrap
	* @param	{HTMLElement} rel	���뵽id,Elementʵ����wrapǰ
	* @return	{HTMLElement} Ŀ��element����
	*/
	insertBefore : function (el, nel, rel) {
		return $(el).insertBefore($(nel), rel && $(rel) || null);
	},
	/** 
	* ��element�����ڲ���ĳԪ�غ����element����
	* @method	insertAfter
	* @param	{HTMLElement} el id,Elementʵ����wrap
	* @param	{HTMLElement} nel Ŀ��id,Elementʵ����wrap
	* @param	{HTMLElement} rel ���뵽id,Elementʵ����wrap��
	* @return	{HTMLElement} Ŀ��element����
	*/
	insertAfter : function (el, nel, rel) {
		return $(el).insertBefore($(nel), rel && $(rel).nextSibling || null);
	},
	/** 
	* ��element����ǰ����element����
	* @method	insertSiblingBefore
	* @param	{HTMLElement} el Ԫ��
	* @param	{HTMLElement} nel ��Ԫ��
	* @return	{HTMLElement} Ŀ��element����
	*/
	insertSiblingBefore : function (el, nel) {
		el = $(el);
		return el.parentNode.insertBefore($(nel), el);
	},
	/** 
	* ��element��������element����
	* @method	insertSiblingAfter
	* @param	{HTMLElement} el Ԫ��
	* @param	{HTMLElement} nel ��Ԫ��
	* @return	{HTMLElement} Ŀ��element����
	*/
	insertSiblingAfter : function (el, nel) {
		el = $(el);
		el.parentNode.insertBefore($(nel), el.nextSibling || null);
	},
	/**
	* removeChild
	* @method	removeChild
	* @see	DOMLevel1.removeChild
	*/
	removeChild: function (pEl, el) {
		return $(pEl).removeChild($(el));
	},
	/**
	* �Ƴ�Ԫ��
	* @method	removeNode
	* @param	{HTMLElement} el ���Ƴ���HTMLElement
	* @return	{void} �޷���ֵ
	*/
	removeNode: function (el) {
		el=$(el);
		return el.parentNode.removeChild(el);
	},
	/**
	* cloneNode
	* @method	cloneNode
	* @see	DOMLevel1.cloneNode
	*/
	cloneNode: function (el,bCloneChildren) {
		el=$(el);
		return el.cloneNode(bCloneChildren);
	},
	/** 
	* ����element���������
	* @method	setAttr
	* @param	{HTMLElement} el Ŀ�����
	* @param	{string} attribute ��������
	* @param	{string} value ���Ե�ֵ
	* @param	{int} iCaseSensitive (Optional)
	* @return	{void}
	*/
	setAttr: function (el, attribute, value, iCaseSensitive) {
		el=$(el);
		el.setAttribute(attribute, value, iCaseSensitive);
	},
	/** 
	* ��ȡelement���������
	* @method	getAttr
	* @param	{HTMLElement} el Ŀ�����
	* @param	{string} attribute ��������
	* @optional	{int} iFlags
	* @return	{any}
	*/
	getAttr: function (el, attribute, iFlags) {
		el=$(el);
		return el.getAttribute(attribute, iFlags);
	},
	/** 
	* �Ƴ�Ԫ�ص�����
	* @method	removeAttr
	* @param	{HTMLElement} el Ŀ�����
	* @param	{string} attribute	��������
	* @param	{int} iCaseSensitive (Optional)
	* @return	{void}
	*/
	removeAttr : function (el, attribute, iCaseSensitive) {
		el = $(el);
		return el.removeAttribute(attribute, iCaseSensitive || 0);
	},
	/**
	* ��Ԫ�ص�ĳ��λ�ò���һ��HTML
	* @method	insertAdjacentHTML
	* @param	{HTMLElement} el �ο�����
	* @param	{String} sWhere ����λ��,������ֵ:beforebegin,afterbegin,beforeend,afterend.
	* @param	{String} sHTML: HTML�ַ���
	* @return	{void} �޷���ֵ
	*/
	insertAdjacentHTML: function (el, sWhere, sHTML) {
		el=$(el);
		if (el.insertAdjacentHTML) {
			el.insertAdjacentHTML(sWhere, sHTML);
		} else {
			var df=create(sHTML,false,el.ownerDocument);
			NodeH.insertAdjacentElement(el,sWhere,df);
		}
	},
	/**
	* ��Ԫ�ص�ĳ��λ�ò���һ��HTML
	* @method	insertAdjacentHTML
	* @param	{HTMLElement} el �ο�����
	* @param	{String} sWhere ����λ��,������ֵ:beforebegin,afterbegin,beforeend,afterend.
	* @param	{String} sHTML HTML�ַ���
	* @return	{void} �޷���ֵ
	*/
	insertAdjacentElement: function (el, sWhere, target) {
		el = $(el), target = $(target);
		if (el.insertAdjacentElement) {
			el.insertAdjacentElement(type, target);
		} else {
			switch (String(sWhere).toLowerCase()) {
				case "beforebegin":
					el.parentNode.insertBefore(target, el);
					break;
				case "afterbegin":
					el.insertBefore(target, el.firstChild);
					break;
				case "beforeend":
					el.appendChild(target);
					break;
				case "afterend":
					el.parentNode.insertBefore(target, el.nextSibling);
					break;
			}
		}
		return target;
	},
	/** 
	* ��ȡelement��value
	* @method	getValue
	* @param	{HTMLElement} el Ŀ�����
	* @return	{string} Ԫ��value
	*/
	getValue : function (el) {
		el = $(el);
		return el.value;
	},

	/** 
	* ����element��value
	* @method	setValue
	* @param	{HTMLElement} el Ŀ�����
	* @param	{string} value		����
	* @return	{void} 
	*/
	setValue : function (el, value) {
		$(el).value=value;
	},

	/** 
	* ��ȡelement��innerHTML
	* @method	getHTML
	* @param	{HTMLElement} el Ŀ�����
	* @return	{string} 
	*/
	getHtml : function (el) {
		el = $(el);
		return el.innerHTML;
	},

	/** 
	* ����element��innerHTML
	* @method	setHtml
	* @param	{HTMLElement} el Ŀ�����
	* @param	{string} value		����
	* @return	{void} 
	*/
	setHtml : function (el,value) {
		$(el).innerHTML=value;
	},
	
	//--// classNameϵ��
	/**
	* �ж��Ƿ����ָ����className
	* @method	hasClass
	* @param	{HTMLElement} el �ο�����
	* @param	{string} cn className
	* @return	{boolean} ���������className������true�����򷵻�false
	*/
	hasClass: function  (el, cn) {
		el=$(el);
		return new RegExp('(?:^|\\s)' +cn+ '(?:\\s|$)','i').test(el.className);
	},
	/**
	* ���һ��className��ָ��Ԫ����
	* @method	addClass
	* @param	{HTMLElement} el �ο�����
	* @param	{string} cn className
	* @return	{void} �޷���ֵ
	*/
	addClass: function  (el, cn) {
		el=$(el);
		if (!NodeH.hasClass(el, cn)) {
			el.className = trim(el.className + ' '+cn);
		}
	},
	/**
	* ��Ԫ�����Ƴ�һ��className
	* @method	removeClass
	* @param	{HTMLElement} el �ο�����
	* @param	{string} cn className
	* @return	{void} �޷���ֵ
	*/
	removeClass: function  (el, cn) {
		el=$(el);
		if (NodeH.hasClass(el, cn)) {
			el.className = trim(el.className.replace(new RegExp('(?:\\s|^)' +cn+ '(?:\\s|$)','i'),' '));
		}
	},
	/**
	* �滻Ԫ�ص�className
	* @method	replaceClass
	* @param	{HTMLElement} el �ο�����
	* @param	{string} cn1 ���滻��className
	* @param	{string} cn2 �µ�className
	* @return	{void} �޷���ֵ
	*/
	replaceClass: function (el, cn1, cn2) {
		el=$(el);
		if (cn1) NodeH.removeClass(el, cn1);
		if (cn2) NodeH.addClass(el, cn2);
	},
	/** 
	* element��className1��className2�л�
	* @method	toggleClass
	* @param	{HTMLElement} el �ο�����
	* @param	{string} cn1		��ʽ��1
	* @param	{string} cn2		(Optional)��ʽ��2
	* @return	{void}
	*/
	toggleClass : function (el, cn1, cn2) {
		cn2 = cn2 || '';
		if (NodeH.hasClass(el, cn1)) {
			NodeH.replaceClass(el, cn1, cn2);
		} else {
			NodeH.replaceClass(el, cn2, cn1);
		}
	},

	//--// CSS���ײ���ϵ��
	/**
	* ��һ��Ԫ�ص�display��������Ϊ��ʾ
	* @method	show
	* @param	{HTMLElement|array} el �ο�����
	* @param	{string} value: displayֵ,Ĭ��Ϊ"".
	* @return	{void} �޷���ֵ
	*/
	show: function (el, value) {
		el=$(el);
		el.style.display = value||'';
	},
	/**
	* ��һ��Ԫ�ص�display��������Ϊ����
	* @method	hide
	* @param	{HTMLElement|array} el �ο�����
	* @return	{void} �޷���ֵ
	*/
	hide: function (el) {
		el=$(el);
		el.style.display = 'none';
	},
	/** 
	* ����/��ʾelement����
	* @method	toggle
	* @param	{HTMLElement} el �ο�����
	* @param	{string} value (Optional)��ʾʱdisplay��ֵ Ĭ��Ϊ��
	* @return	{void}
	*/
	toggle : function (el, value) {
		if (NodeH.isVisible(el)) {
			NodeH.hide(el);
		} else {
			NodeH.show(el, value);
		}
	},
	/**
	* �õ�Ԫ�ص�css����ֵ
	* @method	getStyle
	* @param	{HTMLElement} el �ο�����
	* @param	{String} key css��������
	* @return	{String|int} css����ֵ
	*/
	getStyle: function (el, attr) {
		el = $(el);
		var s=el.style;
		// IE uses filters for opacity
		if (attr == 'opacity' && Browser.ie ) {
			return s.filter && s.filter.indexOf('opacity=') >= 0 ?
				(parseFloat( s.filter.match(/opacity=([^)]*)/)[1] ) / 100):1;
		}
		var result=s[camelize(camelize(attr))];
		return (!result || result == 'auto') ? null : result;
	},
	/**
	* ������ʽ�������ֵ�����ʽ��setStyle(el, attr, val),setStyle(el,op)
	* @method	setStyle
	* @param	{HTMLElement} el �ο�����
	* @param	{String|Json} attr css�������ƻ�����json,�����json,����Ҫ����������.
	* @param	{String|int} val css����ֵ,
	* @return	{void} �޷���ֵ
	*/
	setStyle: function (el, attr, val) {
		var op= {};
		if(typeof attr == 'string') op[attr]=val;
		else op=attr;
		el=$(el);
		for (var prop in op) {
			if ('opacity'==prop && Browser.ie){
				el.style['filter'] = 'alpha(opacity=' +(op[prop]*100)+ ')';
			}
			else {
				el.style[camelize(prop)] = op[prop];
			}
		}
	},
	/**
	* �õ�Ԫ�ص�ʵ��css����ֵ,����������dom��css��е�����
	* @method	getCurrentStyle
	* @param	{HTMLElement} el �ο�����
	* @param	{String} key css��������
	* @return	{String|int} css����ֵ
	*/
	getCurrentStyle: function  (el, attr) {
		el = $(el);
		var val=null;
		var dv=document.defaultView;
		if (dv && dv.getComputedStyle) {
			var css = dv.getComputedStyle(el, null);
			val = css ? css.getPropertyValue(decamelize(attr)) : null;
		} else if (el.currentStyle) {
			var s=el.currentStyle;
			if(attr=='opacity') {
				return s.filter && s.filter.indexOf('opacity=') >= 0 ?
				(parseFloat( s.filter.match(/opacity=([^)]*)/)[1] ) / 100):1;
			}
			val = el.currentStyle[camelize(attr)];
		}
		if((val == 'auto') && (NodeH.getCurrentStyle(el,'display') != 'none')){
			var idx=-1;
			if(attr=='height') idx=0;
			if(attr=='width') idx=1;
			if(idx>-1){
				val=el[camelize('offset-'+attr)];
				var bd=NodeH.borderWidth(el);
				var pd=NodeH.paddingWidth(el);
				val=(val-bd[idx]-bd[idx+2]-pd[idx]-pd[idx+2])+'px';
			}
		}
		return val;
	},

	//-//boxϵ��(����top/left/width/height/border/margin/padding��)
	/** 
	* �ж�element�����Ƿ�ɼ�
	* @method	isVisible
	* @param	{HTMLElement} el		�ο�����
	* @return	{boolean} �жϽ��
	*/
	isVisible : function (el) {
		el = $(el);
		return !!(el.offsetHeight || el.offestWidth);
	},
	/**
	* �õ�Ԫ�ص�ʵ��left��top��
	* @method	getXY
	* @param	{HTMLElement} el �ο�����
	* @return	{Array} �������飺[x,y]
	*/
	getXY: (function() {
		if (Browser.ie) {
			// IE
			return function (el) {
				var box     = el.getBoundingClientRect();
				var rect    = getDocRect(el.ownerDocument.parentWindow);
				var offsetX = box.left - 2 + rect.scrollLeft,
					offsetY = box.top - 2 + rect.scrollTop;			
				return [offsetX, offsetY];
			};
		} else {
			return function(el) { 
				// manually calculate by crawling up offsetParents
				var pos = [el.offsetLeft, el.offsetTop];
				var bd=el.ownerDocument.body;
				var patterns = {
					HYPHEN: /(-[a-z])/i, // to normalize get/setStyle
					ROOT_TAG: /^body|html$/i // body for quirks mode, html for standards
				};

				// safari: subtract body offsets if el is abs (or any offsetParent), unless body is offsetParent
				var accountForBody =false ;
				var pEl=el.offsetParent;
				while (pEl) {
					pos[0] += pEl.offsetLeft;
					pos[1] += pEl.offsetTop;
					if (Browser.safari && NodeH.getCurrentStyle(pEl,'position') == 'absolute') { 
						accountForBody = true;
					}
					pEl = pEl.offsetParent;
				}

				if (accountForBody) { 
					//safari doubles in this case
					pos[0] -= bd.offsetLeft;
					pos[1] -= bd.offsetTop;
				}

				pEl = el.parentNode;

				// account for any scrolled ancestors
				while ( pEl && pEl.tagName && !patterns.ROOT_TAG.test(pEl.tagName) ) {
					if (pEl.scrollTop || pEl.scrollLeft) {
						pos[0] -= pEl.scrollLeft;
						pos[1] -= pEl.scrollTop;
					}
					pEl = pEl.parentNode; 
				}

				return pos;
			};

		}

	})(),
	/**
	* ����Ԫ�ص�λ��
	* @method	setXY
	* @param	{HTMLElement} el Ŀ�����
	* @param	{int} x left
	* @param	{int} y top
	* @return	{void}
	*/
	setXY: function (el, x, y) {
		el=$(el);
		if (x!=null) el.style.left = x +'px';
		if (y!=null) el.style.top = y +'px';
	},
	/** 
	* ��ȡԪ�صĿ��
	* @method	getSize
	* @param	{HTMLElement} el Ŀ�����
	* @return	{object} width,height
	*/
	getSize : function (el) {
		el = $(el);
		return { width : el.offsetWidth, height : el.offsetHeight };
	},
	/** 
	* ����Ԫ�ص�offset���
	* @method	setSize
	* @param	{HTMLElement} el Ŀ�����
	* @param	{int} w			(Optional)�� Ĭ�ϲ�����
	* @param	{int} h			(Optional)�� Ĭ�ϲ�����
	* @return	{void}
	*/
	setSize : function (el, w, h) {
		el = $(el);
		w = parseFloat (w, 10);
		h = parseFloat (h, 10);

		if (isNaN(w) && isNaN(h)) return;

		var borders = NodeH.borderWidth(el);
		var paddings = NodeH.paddingWidth(el);

		if ( !isNaN(w) ) NodeH.setStyle(el, 'width', Math.max(+w - borders[1] - borders[3] - paddings[1] - paddings[3], 0) + 'px');
		if ( !isNaN(h) ) NodeH.setStyle(el, 'height', Math.max(+h - borders[0] - borders[2] - paddings[1] - paddings[2], 0) + 'px');
	},

	/** 
	* ����Ԫ�صĿ��
	* @method	setInnerSize
	* @param	{HTMLElement} el Ŀ�����
	* @param	{int} w			(Optional)�� Ĭ�ϲ�����
	* @param	{int} h			(Optional)�� Ĭ�ϲ�����
	* @return	{void}
	*/
	setInnerSize : function (el, w, h) {
		el = $(el);
		w = parseFloat (w, 10);
		h = parseFloat (h, 10);

		if ( !isNaN(w) ) NodeH.setStyle(el, 'width', w + 'px');
		if ( !isNaN(h) ) NodeH.setStyle(el, 'height', h + 'px');
	},
	/**
	* �õ�border���
	* @method	borderWidth
	* @param	{HTMLElement} el �ο�����
	* @return	{Array} ����border������飬�ֱ�Ϊ[�ϣ��ң��£���]
	*/
	borderWidth: function (el) {
		el = $(el);
		return [
			$F(NodeH.getCurrentStyle(el,'border-top-width')),
			$F(NodeH.getCurrentStyle(el,'border-right-width')),
			$F(NodeH.getCurrentStyle(el,'border-bottom-width')),
			$F(NodeH.getCurrentStyle(el,'border-left-width'))];
	},
	/**
	* �õ�padding���
	* @method	paddingWidth
	* @param	{HTMLElement} el �ο�����
	* @return	{Array} ����padding������飬�ֱ�Ϊ[�ϣ��ң��£���]
	*/
	paddingWidth: function (el) {
		el = $(el);
		return [
			$F(NodeH.getCurrentStyle(el,'padding-top')),
			$F(NodeH.getCurrentStyle(el,'padding-right')),
			$F(NodeH.getCurrentStyle(el,'padding-bottom')),
			$F(NodeH.getCurrentStyle(el,'padding-left'))];
	},
	/**
	* �õ�margin���
	* @method	marginWidth
	* @param	{HTMLElement} el �ο�����
	* @return	{Array} ����margin������飬�ֱ�Ϊ[�ϣ��ң��£���]
	*/
	marginWidth: function(el) {
		el = $(el);
		return [
			$F(NodeH.getCurrentStyle(el,'margin-top')),
			$F(NodeH.getCurrentStyle(el,'margin-right')),
			$F(NodeH.getCurrentStyle(el,'margin-bottom')),
			$F(NodeH.getCurrentStyle(el,'margin-left'))];
	},
	/**
	* �õ�Ԫ�ص�rect���ԡ�
	* @method	getRect
	* @param	{HTMLElement} el �ο�����
	* @return	{Json} �������������Сλ�õ�Json����{left:x, top:y, width: w, height: h}
	*/
	getRect: function (el) {
		el = $(el);
		var p = NodeH.getXY(el);
		var x = p[0];
		var y = p[1];
		var w = el.offsetWidth; 
		var h = el.offsetHeight;
		return {
			'width' : w,    'height': h,
			'left'  : x,    'top'   : y,
			'bottom': y+h,  'right' : x+w
		};
	},
	/**
	* ����Ԫ�ص�offset��ߺ�xy����
	* @method	setRect
	* @param	{HTMLElement} el: Ŀ�����
	* @param	{int} x left
	* @param	{int} y top
	* @param	{int} w ���
	* @param	{int} h �߶�
	* @param	{boolean} ignoreBorder �����߶��Ƿ����border,Ĭ��Ϊtrue
	* @return	{void}
	*/
	setRect: function setRect (el, x, y, w, h,ignoreBorder) {
		NodeH.setXY(el, x, y);
		NodeH.setSize(el, w, h);
	},
	/** 
	* ����Ԫ�صĿ�ߺ�xy����
	* @method	setRect
	* @param	{HTMLElement} el		Ŀ�����
	* @param	{int} x (Optional) x���� Ĭ�ϲ�����
	* @param	{int} y (Optional) y���� Ĭ�ϲ�����
	* @param	{int} w	(Optional) �� Ĭ�ϲ�����
	* @param	{int} h (Optional) �� Ĭ�ϲ�����
	* @return	{void}
	*/
	setInnerRect : function (el, x, y, w, h) {
		NodeH.setXY(el, x, y);
		NodeH.setInnerSize(el, w, h);
	},
	/**
	* ����һ��Ԫ��ȫ��
	* @method	setFullscreen
	* @param	{HTMLElement} el Ŀ�����
	* @param	{window} win window����Ĭ��Ϊ��ǰwindow
	* @return	{void}
	*/
	setFullscreen: function (el) {
		var rect = getDocRect();
		var x, y, w, h;
		x = y = 0;
		w = rect.scrollWidth;
		h = rect.scrollHeight;
		setRect ($(el), x, y, w, h);
	},

	/**
	* ����Ԫ�ؾ���ˮƽ��ֱ����
	* @method	setCenter
	* @param	{HTMLElement} el Ŀ�����
	* @param	{int} w ���
	* @param	{int} h �߶�
	* @param	{int} x �����ֵ������ѡ��center-x;
	* @param	{int} y �����ֵ������ѡ��middle-y;
	* @return	{void}
	*/
	setCenter: function (el, w, h, x, y) {
		var rect = getDocRect();
		if(x==null) x = (rect.width-w)/2  + rect.scrollLeft;
		x=Math.max(Math.min(x,rect.scrollLeft+rect.width-w),rect.scrollLeft);
		if(y==null) y = (rect.height-h)/2 + rect.scrollTop;
		y=Math.max(Math.min(y,rect.scrollTop+rect.height-h),rect.scrollTop);
		NodeH.setXY($(el), x, y);
	},

	//--// set/get
	/** 
	* ΪԪ����������ֵ
	* @method	set
	* @param	{HTMLElement} el Ŀ�����
	* @param	{string} attr ������
	* @param	{any} value ����ֵ
	* @return	{void}  
	*/
	set:function(el,attr,value){
		$(el)[attr]=value;
	},
	/** 
	* ��ȡԪ������ֵ
	* @method	get
	* @param	{HTMLElement} el Ŀ�����
	* @param	{string} attr ������
	* @return	{any}  
	*/
	get:function(el,attr,subAttrs){
		return $(el)[attr];
	},
	/**
	* ��ȡһ��form���post����
	* @method	encodeURIForm
	* @param	{FORMElement} oForm form����
	* @param	{String} exceptNames ���Բ��ύ��Ԫ�������á�,����������
	* @return	{String} ��'&'���ӵļ�ֵ�ַ�������post���ݣ���
	*/
	encodeURIForm: function(oForm,exceptNames){
		var els=$(oForm).elements,
			exNames=','+(exceptNames||'')+',',
			sArr=[];
		for(var i=0;i<els.length;i++){
			var el=els[i],
				name=el.name;
			if(el.disabled || !name || exNames.indexOf(','+name+',')>-1 ) continue;
			switch(el.type){
				case undefined:
				case 'button':
				case 'image':
				case 'reset':
				case 'submit': break;
				case 'radio':
				case 'checkbox':
					if(el.checked) sArr.push(name+"="+encodeURIComponent(el.value));
					break;
				case 'select-one':
					if(el.selectedIndex>-1) sArr.push(name+'='+encodeURIComponent(el.value));
					break;
				case 'select-multiple':
					var opts=el.options;
					for(var j=0;j<opts.length;j++){
						if(opts[j].selected) sArr.push(name+"="+encodeURIComponent(opts[j].value));
					}
					break;
				default: //case "text":	case "hidden":	case "password": case "textarea": ��Ҫ���ݸ��࣬����HTML5�����ģ��Լ�webkit��search��
					sArr.push(name+'='+encodeURIComponent(el.value));
			}
		}
		return sArr.join('&');
	},

	/**
	* �ж�һ�����Ƿ��޸Ĺ�.
	* @method	isFormChanged
	* @param	{FORMElement} oForm form����
	* @param	{String} exceptNames ���Բ��ύ��Ԫ�������á�,����������
	* @return	{boolean} 
	* @example	isFormChangedFun(document.frm,"ACheckbox,BRadio,CSelect");
	*/
	isFormChanged: function (oForm,exceptNames)
	{
		var els=$(oForm).elements,
			exNames=','+(exceptNames||'')+',';
		for(var i=0;i<els.length;i++){
			var el=els[i],
				name=el.name,
				j=0;
			if(el.disabled || !name || exNames.indexOf(','+name+',')>-1 ) continue;
			switch (el.type) {
				case "text":
				case "hidden":
				case "password":
				case "textarea":
					if (el.defaultValue != el.value) return true;
					break;
				case "radio":
				case "checkbox":
					if (el.defaultChecked != el.checked) return true;
					break;
				case "select-one":j=1;
				case "select-multiple":
					var opts = el.options;
					for (; j < opts.length ; j++) {
						if (opts[j].defaultSelected != opts[j].selected) return true;
					}
					break;
			}
		}
		return false;
	}
};

function $F(s) { return parseInt(s)||0; };

function findFirst(el,attr,sSelector){
	/* 
	 * @private
	 * findFirst(el,attr,sSelector): ���Լ���ʼ���ݹ��������,�õ�һ����������������. 
	 * @see	ancestorNode
	 * @see	previousSibling
	 * @see	nextSibling
	 * @see	firstChild
	 */
	if(!sSelector) return el;
	var f=selector2Filter(sSelector);
    while (el && !f(el)) {
      el = el[attr];
    }
	return el;
};


QW.NodeH=NodeH;
})();



/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: wangchen
*/
/** 
* @class EventTargetH EventTarget Helper��������¼�����Ŀ���йصļ�������
* @singleton
* @helper
* @namespace QW
*/
QW.EventTargetH = function () {

	var E = {};
	var $=QW.NodeH.$;


	var cache = {};
	var delegateCache = {};
	var PROPERTY_NAME = '_EventTargetH_ID';
	var index = 0;


	/** 
	* ��ȡkey
	* @method	getKey
	* @private
	* @param	{element}	element		���۲��Ŀ��
	* @param	{string}	oldname		(Optional)�¼�����
	* @param	{function}	handler		(Optional)�¼��������
	* @return	{string}	key
	*/
	var getKey = function (element, type, handler) {
		var result = '';

		if (!element[PROPERTY_NAME]) element[PROPERTY_NAME] = ++ index;

		result += element[PROPERTY_NAME];

		if (type) {
			result += '_' + type;

			if (handler) {
				if (!handler[PROPERTY_NAME]) handler[PROPERTY_NAME] = ++ index;
				result += '_' + handler[PROPERTY_NAME];
			}
		}

		return result;
	};

	/** 
	* ��ȡkey
	* @method	getDelegateKey
	* @private
	* @param	{element}	element		��ί�е�Ŀ��
	* @param	{string}	selector	(Optional)ί�е�Ŀ��
	* @param	{string}	oldname		(Optional)�¼�����
	* @param	{function}	handler		(Optional)�¼��������
	* @return	{string}	key
	*/
	var getDelegateKey = function (element, selector, type, handler) {
		var result = '';

		if (!element[PROPERTY_NAME]) element[PROPERTY_NAME] = ++ index;

		result += element[PROPERTY_NAME];

		if (selector) {
			result += '_' + selector.replace(/_/g, '\x01');

			if (type) {
				result += '_' + type;

				if (handler) {
					if (!handler[PROPERTY_NAME]) handler[PROPERTY_NAME] = ++ index;
					result += '_' + handler[PROPERTY_NAME];
				}
			}
		}

		return result;
	};

	/** 
	* ͨ��key��ȡ�¼���
	* @method	keyToName
	* @private
	* @param	{string}	key		��ֵ
	* @return	{string}	�¼�����
	*/
	var keyToName = function (key) {
		return key.split('_')[1];
	};

	/** 
	* ͨ��key��ȡ�¼���
	* @method	delegateKeyToName
	* @private
	* @param	{string}	key		��ֵ
	* @return	{string}	�¼�����
	*/
	var delegateKeyToName = function (key) {
		return key.split('_')[2];
	};

	/** 
	* ��������
	* @method	listener
	* @private
	* @param	{element}	element	����Ŀ��
	* @param	{string}	name	�¼�����
	* @param	{function}	handler	�¼��������
	* @return	{object}	ί�з���ִ�н��
	*/
	var listener = function (element, name, handler) {
		return function (e) {
			return fireHandler(element, e, handler, name);
		};
	};

	/** 
	* ��������
	* @method	delegateListener
	* @private
	* @param	{element}	element 	����Ŀ��
	* @param	{string}	selector	ѡ����
	* @param	{string}	name		�¼�����
	* @param	{function}	handler		�¼��������
	* @return	{object}	ί�з���ִ�н��
	*/
	var delegateListener = function (element, selector, name, handler) {
		return function (e) {
			var elements = [], node = e.srcElement || e.target;
			
			if (!node) return;

			if (node.nodeType == 3) node = node.parentNode;

			while (node && node != element) {
				elements.push(node);
				node = node.parentNode;
			}

			elements = QW.Selector.filter(elements, selector, element);

			for (var i = 0, l = elements.length ; i < l ; ++ i) {
				fireHandler(elements[i], e, handler, name);
			}
		};
	};

	/**
	 * ����¼�����
	 * @method	addEventListener
	 * @param	{element}	element	����Ŀ��
	 * @param	{string}	name	�¼�����
	 * @param	{function}	handler	�¼��������
	 * @param	{bool}		capture	(Optional)�Ƿ񲶻��ie����Ч
	 * @return	{void}
	 */
	E.addEventListener = function () {
		if (document.addEventListener) {
			return function (element, name, handler, capture) {
				element.addEventListener(name, handler, capture || false);
			};
		} else if (document.attachEvent) {
			return function (element, name, handler) {
				element.attachEvent('on' + name, handler);
			};
		} else {
			return function () {};
		}
	}();

	/**
	 * �Ƴ��¼�����
	 * @method	removeEventListener
	 * @private
	 * @param	{element}	element	����Ŀ��
	 * @param	{string}	name	�¼�����
	 * @param	{function}	handler	�¼��������
	 * @param	{bool}		capture	(Optional)�Ƿ񲶻��ie����Ч
	 * @return	{void}
	 */
	E.removeEventListener = function () {
		if (document.removeEventListener) {
			return function (element, name, handler, capture) {
				element.removeEventListener(name, handler, capture || false);
			};
		} else if (document.detachEvent) {
			return function (element, name, handler) {
				element.detachEvent('on' + name, handler);
			};
		} else {
			return function () {};
		}
	}();

	/** 
	* ��׼���¼�����
	* @method	getName
	* @private
	* @param	{string}	name	�¼�����
	* @return	{string}	ת������¼�����
	*/
	var getName = function () {
		var UA = navigator.userAgent, NAMES = {
			'mouseenter' : 'mouseover',
			'mouseleave' : 'mouseout'
		};

		if (/msie/i.test(UA)) {
			NAMES['input'] = 'propertychange';
		} else if (/firefox/i.test(UA)) {
			NAMES['mousewheel'] = 'DOMMouseScroll';
		}

		return function (name) {
			return NAMES[name] || name;
		};

	}();

	/** 
	* �¼�ִ�����
	* @method	fireHandler
	* @private
	* @param	{element}	element		�����¼�����
	* @param	{event}		event		�¼�����
	* @param	{function}	handler		�¼�ί��
	* @param	{string}	name		����ǰ�¼�����
	* @return	{object}	�¼�ί��ִ�н��
	*/
	var fireHandler = function (element, e, handler, name) {
		if (name == 'mouseenter' || name == 'mouseleave') {
			var target = e.relatedTarget || (e.type == 'mouseover' ? e.fromElement : e.toElement) || null;
			if (!target || target == element || (element.contains ? element.contains(target) : !!(element.compareDocumentPosition(target) & 16))) {
				return;
			}
		};
		return E.fireHandler(element, e, handler, name);
	};

	/** 
	* �¼�ִ�����
	* @method	fireHandler
	* @param	{element}	element		�����¼�����
	* @param	{event}		event		�¼�����
	* @param	{function}	handler		�¼�ί��
	* @param	{string}	name		����ǰ�¼�����
	* @return	{object}	�¼�ί��ִ�н��
	*/
	E.fireHandler = function (element, e, handler, name) {
		return handler.call(element, e);
	};

	/** 
	* ��Ӷ�ָ���¼��ļ���
	* @method	on
	* @param	{element}	element	����Ŀ��
	* @param	{string}	oldname	�¼�����
	* @param	{function}	handler	�¼��������
	* @return	{boolean}	�¼��Ƿ�����ɹ�
	*/
	E.on = function (element, oldname, handler) {
		element = $(element);

		var name = getName(oldname);
		
		var key = getKey(element, oldname, handler);

		if (cache[key]) {
			return false;
		} else {
			var _listener = listener(element, oldname, handler);

			E.addEventListener(element, name, _listener);

			cache[key] = _listener;

			return true;
		}
	};

	/** 
	* �Ƴ���ָ���¼��ļ���
	* @method	un
	* @param	{element}	element	�Ƴ�Ŀ��
	* @param	{string}	oldname	(Optional)�¼�����
	* @param	{function}	handler	(Optional)�¼��������
	* @return	{boolean}	�¼������Ƿ��Ƴ��ɹ�
	*/
	E.un = function (element, oldname, handler) {
		
		element = $(element);
		
		if (handler) {

			var name = getName(oldname);

			var key = getKey(element, oldname, handler);

			var _listener = cache[key];

			if (_listener) {
				E.removeEventListener(element, name, _listener);
				
				delete cache[key];

				return true;
			} else {
				return false;
			}
		} else {			

			var leftKey = '^' + getKey(element, oldname, handler), i, name;
			
			for (i in cache) {
				if (new RegExp(leftKey, 'i').test(i)) {
					name = keyToName(i);
					E.removeEventListener(element, getName(name), cache[i]);
					delete cache[i];
				}
			}

			return true;
		}
	};

	/** 
	* ����¼�ί��
	* @method	delegate
	* @param	{element}	element		��ί�е�Ŀ��
	* @param	{string}	selector	ί�е�Ŀ��
	* @param	{string}	oldname		�¼�����
	* @param	{function}	handler		�¼��������
	* @return	{boolean}	�¼������Ƿ��Ƴ��ɹ�
	*/
	E.delegate = function (element, selector, oldname, handler) {
		element = $(element);

		var name = getName(oldname);
		
		var key = getDelegateKey(element, selector, oldname, handler);

		if (delegateCache[key]) {
			return false;
		} else {
			var _listener = delegateListener(element, selector, oldname, handler);

			E.addEventListener(element, name, _listener);

			delegateCache[key] = _listener;

			return true;
		}
	};

	/** 
	* �Ƴ��¼�ί��
	* @method	undelegate
	* @param	{element}	element		��ί�е�Ŀ��
	* @param	{string}	selector	(Optional)ί�е�Ŀ��
	* @param	{string}	oldname		(Optional)�¼�����
	* @param	{function}	handler		(Optional)�¼��������
	* @return	{boolean}	�¼������Ƿ��Ƴ��ɹ�
	*/
	E.undelegate = function (element, selector, oldname, handler) {
		element = $(element);
		
		if (handler) {

			var name = getName(oldname);

			var key = getDelegateKey(element, selector, oldname, handler);

			var _listener = delegateCache[key];

			if (_listener) {
				E.removeEventListener(element, name, _listener);
				
				delete delegateCache[key];

				return true;
			} else {
				return false;
			}
		} else {			

			var leftKey = '^' + getDelegateKey(element, selector, oldname, handler).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1'), i, name;
			
			for (i in delegateCache) {
				if (new RegExp(leftKey, 'i').test(i)) {
					name = delegateKeyToName(i);
					E.removeEventListener(element, getName(name), delegateCache[i]);
					delete delegateCache[i];
				}
			}

			return true;
		}
	};

	/** 
	* ���������ָ���¼�
	* @method	fire
	* @param	{element}	element	Ҫ�����¼��Ķ���
	* @param	{string}	oldname	�¼�����
	* @return	{void}
	*/
	E.fire = function (element, oldname) {
		element = $(element);
		var name = getName(oldname);

		if (element.fireEvent) {
			element.fireEvent('on' + name);
		} else {
			var evt = null, doc = element.ownerDocument || element;
			
			if (/mouse|click/i.test(oldname)) {
				evt = doc.createEvent('MouseEvents');
				evt.initMouseEvent(name, true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
			} else {
				var evt = doc.createEvent('Events');
				evt.initEvent(name, true, true, doc.defaultView);
			}
			element.dispatchEvent(evt);
		}
	};

	var extend = function (types) {
		for (var i = 0, l = types.length ; i < l ; ++ i) {
			function(type){
				E[type]=function(el,handle){
					if(handle) E.on(type,handle);
					else el[type]();
				}
			}(types[i]);
		}
	};

	/** 
	* �󶨶����click�¼�����ִ��click����
	* @method	click
	* @param	{element}	element	Ҫ�����¼��Ķ���
	* @param	{function}	handler	(Optional)�¼�ί��
	* @return	{void}
	*/


	/** 
	* �󶨶����submit�¼�����ִ��submit����
	* @method	submit
	* @param	{element}	element	Ҫ�����¼��Ķ���
	* @param	{function}	handler	(Optional)�¼�ί��
	* @return	{void}
	*/

	/** 
	* �󶨶����focus�¼�����ִ��focus����
	* @method	focus
	* @param	{element}	element	Ҫ�����¼��Ķ���
	* @param	{function}	handler	(Optional)�¼�ί��
	* @return	{void}
	*/

	/** 
	* �󶨶����blur�¼�����ִ��blur����
	* @method	blur
	* @param	{element}	element	Ҫ�����¼��Ķ���
	* @param	{function}	handler	(Optional)�¼�ί��
	* @return	{void}
	*/

	extend('submit,click,focus,blur'.split(','));

	return E;

}();

/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: wangchen
	author: JK
*/
/** 
* @class NodeW HTMLElement�����װ��
* @namespace QW
*/
(function () {
	var ObjectH = QW.ObjectH,
		mix = ObjectH.mix,
		getType = ObjectH.getType,
		push = Array.prototype.push,
		NodeH = QW.NodeH,
		$ = NodeH.$,
		query = NodeH.query;

	var NodeW=function(core) {
		if(!core) return null;
		var arg1=arguments[1];
		if(typeof core=='string'){
			if(this instanceof NodeW){//�÷���var el=new NodeW(id); //���Ƽ����÷�
				return new NodeW($(core,arg1));
			}
			else {//�÷�: var els=NodeW(selector)
				return new NodeW(query(arg1,core));
			}
		}
		else {
			core=$(core,arg1);
			if(this instanceof NodeW){
				this.core=core;
				var type=getType(core);
				if(type=='array'){//�÷���var els=new NodeW([el1,el2]); 
					this.length=0;
					push.apply( this, core );
				}
				else{//�÷�: var el=new NodeW(el); 
					this.length=1;
					this[0]=core;
				}
			}
			else return new NodeW(core);//�÷���var el=NodeW(el); var els=NodeW([el1,el2]); //ʡ��"new"
		}
	};

	mix(NodeW.prototype,{
		/** 
		* ����NodeW�ĵ�0��Ԫ�صİ�װ
		* @method	first
		* @return	{NodeW}	
		*/
		first:function(){
			return NodeW(this[0]);
		},
		/** 
		* ����NodeW�����һ��Ԫ�صİ�װ
		* @method	last
		* @return	{NodeW}	
		*/
		last:function(){
			return NodeW(this[this.length-1]);
		},
		/** 
		* ����NodeW�ĵ�i��Ԫ�صİ�װ
		* @method	last
		* @param {int}	i ��i��Ԫ��
		* @return	{NodeW}	
		*/
		item:function(i){
			return NodeW(this[i]);
		}
	});

	QW.NodeW=NodeW;
})();


QW.NodeC={
	arrayMethods:[//����Array�ķ���Ҳ�Ἧ�ɵ�NodeW��
		'map',
		'forEach',
		'filter',
		'toArray'
	],
	wrapMethods:{ //�ڴ�json��ķ������᷵�ش���װ�Ľ���������ֵΪ-1�����ء�����ֵ���İ�װ���,���򷵻ص�i��λ�õĲ����İ�װ���
		//����EventTargetH
		on	: 0,
		un	: 0,
		delegate	: 0,
		undelegate	: 0,
		fire	: 0,
		click	: 0,
		submit	: 0,
		
		//����NodeH
		//getJsAttr
		//getExAttr
		$	: -1,
		query	: -1,
		getElementsByClass	: -1,
		getElementsByTagName	: -1,
		ancestorNode	: -1,
		nextSibling	: -1,
		previousSibling	: -1,
		firstChild	: -1,
		lastChild	: -1,
		//contains
		//appendChild
		insertBefore	: -1,
		insertAfter	: -1,
		insertSiblingBefore	: -1,
		insertSiblingAfter	: -1,
		removeChild	: -1,
		removeNode	: -1,
		cloneNode	: -1,
		setAttr	: 0,
		//getAttr
		removeAttr	: 0,
		//insertAdjacentHTML
		insertAdjacentElement	: -1,
		//getValue
		setValue	: 0,
		//getHtml
		setHtml	: 0,
		//hasClass
		addClass	: 0,
		removeClass	: 0,
		replaceClass	: 0,
		toggleClass	: 0,
		show	: 0,
		hide	: 0,
		toggle	: 0,
		//getStyle
		setStyle	: 0,
		//getCurrentStyle
		//isVisible
		//getXY
		setXY	: 0,
		//getSize
		setSize	: 0,
		setInnerSize	: 0,
		//borderWidth
		//paddingWidth
		//marginWidth
		//getRect
		setRect	: 0,
		setInnerRect	: 0,
		setFullscreen	: 0,
		setCenter	: 0,
		set	: 0,
		//get
		//encodeURIForm
		//isFormChanged
		
		//����ArrayH
		//map
		forEach	: 0,
		filter	: -1
		//toArray
	},
	gsetterMethods : { //�ڴ�json��ķ���������һ��getter��setter�Ļ����
		val :['getValue','setValue'],
		html : ['getHtml','setHtml'],
		attr :['','getAttr','setAttr'],
		css :['','getCurrentStyle','setStyle'],
		size : ['getSize', 'setSize'],
		xy : ['getXY', 'setXY']
	}
};



/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK
*/

/*
��Ⱦ�ڲ�����
*/
(function(){
var HelperH=QW.HelperH,
	applyTo=HelperH.applyTo,
	methodizeTo=HelperH.methodizeTo;

/**
* @class Object ��չObject����ObjectH������Object���ر�˵����δ��Object.prototype����Ⱦ���Ա�֤Object.prototype�Ĵ�����
*/
applyTo(QW.ObjectH,Object);

/**
* @class Array ��չArray����ArrayH������Array
*/
applyTo(QW.ArrayH,Array);
methodizeTo(QW.ArrayH,Array.prototype);


/**
* @class Function ��չFunction����FunctionH/ClassH������Function
*/
Object.mix(QW.FunctionH, QW.ClassH);
applyTo(QW.FunctionH,Function);
methodizeTo(QW.FunctionH,Function.prototype);

/**
* @class String ��չString����StringH������String
*/
applyTo(QW.StringH,String);
methodizeTo(QW.StringH,String.prototype);

/**
* @class Date ��չDate����DateH������Date
*/
applyTo(QW.DateH,Date);
methodizeTo(QW.DateH,Date.prototype);

})();


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




/*
* Youa Retouch
*/

QW.$=QW.NodeH.$;	// $ = getElementById
QW.W=QW.NodeW;		// W = NodeW
QW.$$=QW.NodeW.$;	// $$ = NodeW.$
QW.Env=QW.Browser;	// 
window.BB=window.QW;	//�а���BB
QW.ObjectH.mix(window,QW);	//��QW�ռ��������һ��
QW.provideDomains=[QW,window];	//�ı�provide���������Ŀ�ĵ�

