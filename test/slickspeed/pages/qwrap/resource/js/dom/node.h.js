/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: wangche
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


