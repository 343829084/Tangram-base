/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.dom;
///import baidu.browser.ie;

/**
 * 提供给setAttr与getAttr方法作名称转换使用
 * ie6,7下class要转换成className
 *
 * @author: allstar, erik, berg
 */

baidu.dom._NAME_ATTRS = (function () {
    var result = {
        'cellspacing': 'cellSpacing',
        'colspan': 'colSpan',
        'rowspan': 'rowSpan',
        'usemap': 'useMap',
        'readonly' : 'readOnly',
        'maxlength' : 'maxLength',
        'frameborder': 'frameBorder'
    };
    
    if (baidu.browser.ie < 8) {
        result['for'] = 'htmlFor';
        result['class'] = 'className';
    } else {
        result['htmlFor'] = 'for';
        result['className'] = 'class';
    }
    
    return result;
})();
