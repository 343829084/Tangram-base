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
