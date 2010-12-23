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


