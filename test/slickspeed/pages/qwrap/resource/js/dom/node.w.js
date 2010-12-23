/*
	Copyright (c) 2010, Baidu Inc.  http://www.youa.com; http://www.qwrap.com
	author: JK
	author: wangchen
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

