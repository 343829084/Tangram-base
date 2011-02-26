/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.dom._g;
///import baidu.dom.getDocument;
///import baidu.browser.ie;

/**
 * ��ȡĿ��Ԫ�ص�computed styleֵ
 * ���Ԫ�ص���ʽֵ���ܱ���������㣬��᷵�ؿ��ַ�����IE��
 *
 * @author berg
 * @name baidu.dom.getComputedStyle
 * @function
 * @grammar baidu.dom.getComputedStyle(element, key)
 * @param {HTMLElement|string} element Ŀ��Ԫ�ػ�Ŀ��Ԫ�ص�id
 * @param {string} key Ҫ��ȡ����ʽ��
 *
 * @see baidu.dom.getStyle
 *             
 * @returns {string} Ŀ��Ԫ�ص�computed styleֵ
 */

baidu.dom.getComputedStyle = function(element, key){
    element = baidu.dom._g(element);
    var doc = baidu.dom.getDocument(element),
        styles;
    if (doc.defaultView && doc.defaultView.getComputedStyle) {
        styles = doc.defaultView.getComputedStyle(element, null);
        if (styles) {
            return styles[key] || styles.getPropertyValue(key);
        }
    }
    return ''; 
};
