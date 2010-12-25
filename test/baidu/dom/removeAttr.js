module('baidu.dom.removeAttr')

test('正常用例',function(){
	expect(5);
	var div = document.createElement('div');
	document.body.appendChild(div);

    div.setAttribute("test", "value");
    baidu.dom.removeAttr(div, 'test');
	equal(div.getAttribute("test"), null,'div test attr')

    div.setAttribute("valign", "top");
	equal(div.getAttribute("valign"), "top",'div valign attr')
    baidu.dom.removeAttr(div, 'valign');
	equal(div.getAttribute("valign"), null,'div valign attr')

    div.setAttribute("tabIndex", "10");
	equal(div.getAttribute("tabIndex"), "10",'div tabIndex')
    baidu.dom.removeAttr(div, 'tabindex');
	equal(div.getAttribute("tabIndex"), null,'div tabIndex')
    
	document.body.removeChild(div);
});
