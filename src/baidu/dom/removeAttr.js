/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.dom;
///import baidu.dom.g;
///import baidu.dom._NAME_ATTRS;

/**
 * 移除目标元素的指定属性
 * @author berg
 * @name baidu.dom.removeAttr
 * @function
 * @grammar baidu.dom.removeAttr(element, attr)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string} attr 要移除的属性
 * @see baidu.dom.removeClass, baidu.dom.removeStyle, baidu.dom.setAttr, baidu.dom.getAttr
 *             
 * @returns {HTMLElement} 目标元素
 */
baidu.dom.removeAttr = function (element, attr) {
    element = baidu.dom.g(element);
    var directAttr = baidu.dom._NAME_ATTRS[attr];
    if(directAttr){
        element[directAttr] = '';
    }else{
        element.removeAttribute(attr);
    }
    return element;
};
