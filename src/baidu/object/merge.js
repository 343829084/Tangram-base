/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.object;

/**
 * ��������������Ԫ�أ���ÿһ��Ԫ��Ӧ�÷�������ת����������ת����������顣
 * @name baidu.array.merge
 * @function
 * @grammar baidu.array.map(source, iterator)
 * @param {Array}    source   ��Ҫ����������.
 * @param {Function} iterator ��ÿ������Ԫ�ؽ��д���ĺ���.
 * @return {Array} map�������.
 * @see baidu.array.extend
 * @author berg
 */
baidu.array.map = function(source, iterator) {
    var results = [],
        i = 0,
        l = source.length;
    for (; i < l; i++) {
        results[i] = iterator(source[i], i);
    }
    return results;
};
