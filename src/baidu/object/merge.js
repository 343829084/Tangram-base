/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.object;
///import baidu.lang.isObject;
///import baidu.lang.isFunction;

/**
 * �ϲ�Դ��������Ե�Ŀ�����
 * Ĭ������£�������Դ�����ϵ����Զ��ᱻ�ǵݹ�غϲ���Ŀ�������
 * �������Ŀ����������д����ԣ����ᱻ����
 *
 * @name baidu.array.merge
 * @function
 * @grammar baidu.array.merge(target, source[, opt_options])
 *
 * @param {Function} target Ŀ�����.
 * @param {Function} source Դ����.
 * @param {Object} opt_options optional mergeѡ��.
 * @config {boolean} overwrite optional ���Ϊ�棬Դ�������ԻḲ�ǵ�Ŀ������ϵ��������ԣ�Ĭ��Ϊ��.
 * @config {string[]} whiteList optional ��������Ĭ��Ϊ�գ�������ڣ�ֻ������������ԲŻᱻ����.
 * @config {boolean} recursive optional �Ƿ�ݹ�ϲ����������object��Ĭ��Ϊ��.
 * @return {object} merge���object.
 * @see baidu.array.extend
 * @author berg
 */
(function() {
var isPlainObject = function(source) {
        return baidu.lang.isObject(source) && !baidu.lang.isFunction(source);
    };

function mergeItem(target, source, index, overwrite, recursive) {
    if (source.hasOwnProperty(index)) {
        if (recursive && isPlainObject(target[index])) {
            // �����Ҫ�ݹ鸲�ǣ��͵ݹ����merge
            baidu.object.merge(
                target[index],
                source[index],
                {
                    'overwrite': overwrite,
                    'recursive': recursive
                }
            );
        } else if (overwrite || !(index in target)) {
            // ����ֻ����overwriteΪtrue��������Ŀ�������û�д����Ե����
            target[index] = source[index];
        }
    }
}

baidu.object.merge = function(target, source, opt_options) {
    var i = 0,
        options = opt_options || {},
        overwrite = options['overwrite'],
        whiteList = options['whiteList'],
        recursive = options['recursive'],
        len;

    // ֻ�����ڰ������е�����
    if (whiteList && whiteList.length) {
        len = whiteList.length;
        for (; i < len; ++i) {
            mergeItem(target, source, whiteList[i], overwrite, recursive);
        }
    } else {
        for (i in source) {
            mergeItem(target, source, i, overwrite, recursive);
        }
    }

    return target;
};
})();
