'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isProduction = exports.env = exports.thunk2Promise = exports.thunk2Func = exports.birthdayFromIDNo = exports.sexFromIDNo = exports.isIDNo = exports.isPhone = exports.unflatten = exports.flatten = exports.chunkArrayByQuantity = exports.chunkArrayByCapacity = exports.readDirectoryStructure = exports.randomS = exports.randomN = exports.getPropertyCount = exports.setPropertyDotExpression = exports.setPropertyRecursion = exports.setProperty = exports.rangeDateAsDay = exports.rangeDateAsYear = exports.rangeDateAsMonth = exports.range = exports.values = exports.pluck = exports.pick = exports.isFunction = exports.isObject = exports.isString = undefined;

var _klaw = require('klaw');

var _klaw2 = _interopRequireDefault(_klaw);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _thunkify = require('thunkify');

var _thunkify2 = _interopRequireDefault(_thunkify);

var _thunkToPromise = require('thunk-to-promise');

var _thunkToPromise2 = _interopRequireDefault(_thunkToPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by zppro on 17-6-22.
 */

var isString = exports.isString = function isString(o) {
    return Object.prototype.toString.call(o) == '[object String]';
};

var isObject = exports.isObject = function isObject(o) {
    return o === Object(o);
};

var isFunction = exports.isFunction = function isFunction(o) {
    var getType = {};
    return o && getType.toString.call(o) === '[object Function]';
};

var pick = exports.pick = function pick(o) {
    for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        keys[_key - 1] = arguments[_key];
    }

    var result = {};
    if (o) {
        if (Array.isArray(o)) {
            return o.map(function (o) {
                return pick.apply(null, [o].concat(keys));
            });
        } else if (isObject(o)) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var k = _step.value;

                    if (o[k]) {
                        result[k] = o[k];
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }
    return result;
};

var pluck = exports.pluck = function pluck(arr, key) {
    return arr.map(function (o) {
        return o[key];
    });
};

var values = exports.values = function values(o) {
    return Object.keys(o).map(function (k) {
        return o[k];
    });
};

var range = exports.range = function range(start, stop, step) {
    if (stop == null) {
        stop = start || 0;
        start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var current = start;
    return Array.from({ length: length }, function (v, k) {
        k === 0 ? current : current += step;
        return current;
    });
};

var _rangeDate = function _rangeDate(start, end, format, type) {
    var s = (0, _moment2.default)(start),
        e = end ? (0, _moment2.default)(end) : (0, _moment2.default)(),
        _f = void 0;
    !type && (type = 'months');
    switch (type) {
        case 'months':
            _f = 'YYYY-MM';
            break;
        case 'years':
            _f = 'YYYY';
            break;
        case 'days':
            _f = 'YYYY-MM-DD';
            break;
        default:
            return [];
            break;
    }

    var f = format || _f,
        ret = [];
    for (var d = s; e.diff(d) >= 0; d = d.add(1, type)) {
        ret.push(d.format(f));
    }
    return ret;
};

var rangeDateAsMonth = exports.rangeDateAsMonth = function rangeDateAsMonth(start, end, format) {
    return _rangeDate(start, end, format);
};
var rangeDateAsYear = exports.rangeDateAsYear = function rangeDateAsYear(start, end, format) {
    return _rangeDate(start, end, format, 'years');
};
var rangeDateAsDay = exports.rangeDateAsDay = function rangeDateAsDay(start, end, format) {
    return _rangeDate(start, end, format, 'days');
};

var setProperty = exports.setProperty = function setProperty(o, k, v) {
    if (isObject(o)) {
        if (o.hasOwnProperty(k)) {
            o[k] = v;
        }
    }
};

var setPropertyRecursion = exports.setPropertyRecursion = function setPropertyRecursion(o, k, v) {
    if (isObject(o)) {
        if (o.hasOwnProperty(k)) {
            o[k] = v;
        } else {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = Object.keys(o)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var oc = _step2.value;

                    setPropertyRecursion(o[oc], k, v);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }
};

var setPropertyDotExpression = exports.setPropertyDotExpression = function setPropertyDotExpression(o, k, v) {
    if (isObject(o)) {
        if (o.hasOwnProperty(k)) {
            o[k] = v;
        } else {
            //保证至少一个点
            var arrExpPath = k.split('.');
            if (arrExpPath.length > 1) {
                var obj = o[arrExpPath[0]];
                for (var i = 1, len = arrExpPath.length; i < len - 1; i++) {
                    obj = obj[arrExpPath[i]];
                }
                obj[arrExpPath[arrExpPath.length - 1]] = v;
            }
        }
    }
};

var getPropertyCount = exports.getPropertyCount = function getPropertyCount(o) {
    var count = 0;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = Object.keys(o)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var k = _step3.value;

            count++;
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return count;
};

var randomN = exports.randomN = function randomN(len) {
    return Math.random().toString().substr(2, len);
};

var randomS = exports.randomS = function randomS(len) {
    return process.binding('crypto').randomBytes(len).toString('hex').substr(0, len);
};

var readDirectoryStructure = exports.readDirectoryStructure = function readDirectoryStructure(dir, options) {
    dir = _path2.default.normalize(dir);
    if (dir.endsWith('/')) {
        dir = dir.substr(0, dir.length - 1);
    }
    options = options || {};
    var exts = options.exts;
    var excludeDirs = options.excludeDirs;
    if (excludeDirs) {
        if (!Array.isArray(excludeDirs)) {
            excludeDirs = [excludeDirs];
        }
        excludeDirs = excludeDirs.map(function (o) {
            return _path2.default.join(dir, o);
        });
    }
    var testExclude = function testExclude(excludes, testPath) {
        return excludes.some(function (o) {
            return testPath.startsWith(o);
        });
    };
    var filter = _through2.default.obj(function (item, enc, next) {
        if (dir != item.path && !(excludeDirs && testExclude(excludeDirs, item.path))) {
            if (!exts) {
                this.push(item);
            } else {
                if (!Array.isArray(exts)) {
                    exts = [exts];
                }

                if (exts.includes(_path2.default.extname(item.path))) {
                    this.push(item);
                }
            }
        }
        next();
    });

    return options.format === 'tree' ? _transformTree(dir, filter) : _transformObject(dir, filter);
};

var _transformTree = function _transformTree(dir, filter) {
    var promise = _transformObject(dir, filter).then(function (ret) {
        var fileKeys = ['name', 'relative_name', 'path', 'relative_path'];
        var treeNodes = [],
            dirNode = void 0,
            children = void 0;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = Object.keys(ret)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var key = _step4.value;

                if (!fileKeys.includes(key) && isObject(ret[key])) {
                    dirNode = { _id: ret[key].relative_path || key, name: key };
                    children = _parseChildren(ret[key], fileKeys);
                    if (children && children.length > 0) {
                        dirNode.children = children;
                    }
                    treeNodes.push(dirNode);
                }
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        return treeNodes;
    });
    return promise;
};

var _parseChildren = function _parseChildren(obj, fileKeys) {
    var treeNodes = [],
        dirNode = void 0,
        children = void 0;
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = Object.keys(obj)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var key = _step5.value;

            if (!fileKeys.includes(fileKeys, key) && isObject(obj[key])) {
                dirNode = { _id: obj[key].relative_path || key, name: key };
                children = _parseChildren(obj[key], fileKeys);
                if (children && children.length > 0) {
                    dirNode.children = children;
                }
                treeNodes.push(dirNode);
            }
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }

    return treeNodes;
};

var _transformObject = function _transformObject(dir, filter) {
    var promise = new Promise(function (resolve) {
        var ret = {};
        (0, _klaw2.default)(dir).pipe(filter).on('data', function (item) {
            var baseName = _path2.default.basename(item.path);
            if (item.stats.isDirectory()) {
                ret[baseName] = {};
            } else {
                var relativeDirs = item.path.replace(dir + '/', '').split('/');
                relativeDirs.splice(relativeDirs.length - 1, 1);
                var dirLength = relativeDirs.length;
                var parent = ret;
                for (var i = 0; i < dirLength; i++) {
                    parent[relativeDirs[i]] = parent[relativeDirs[i]] || {};
                    parent = parent[relativeDirs[i]];
                }
                var extName = _path2.default.extname(item.path);
                var noExtBaseName = _path2.default.basename(item.path, extName);
                var key = noExtBaseName + extName;

                parent[key] = {
                    name: key,
                    relative_name: relativeDirs.join('_') + '_' + noExtBaseName,
                    path: item.path,
                    relative_path: relativeDirs.join('/') + '/' + baseName
                };
            }
        }).on('end', function () {
            resolve(ret);
        });
    });
    return promise;
};

var chunkArrayByCapacity = exports.chunkArrayByCapacity = function chunkArrayByCapacity(arr, capacity) {
    var result = [],
        start = void 0,
        end = void 0;
    // console.log('total arr length:', arr.length);
    for (var x = 0; x < arr.length; x = x + capacity) {
        start = result.length * capacity;
        end = start + capacity < arr.length ? start + capacity : arr.length + 1;
        // console.log('chunkArrayRange:', start, end);
        result.push(arr.slice(start, end));
    }
    return result;
};

var chunkArrayByQuantity = exports.chunkArrayByQuantity = function chunkArrayByQuantity(arr, quantity) {
    var result = [],
        start = void 0,
        end = void 0;
    var remainder = arr.length % quantity;
    var step = Math.ceil(arr.length / quantity);
    var max = remainder > 0 ? quantity - 1 : quantity;
    for (var x = 0; x < max; x++) {
        start = x * step;
        end = start + step;
        result.push(arr.slice(start, end));
    }
    if (remainder > 0) {
        result.push(arr.slice((quantity - 1) * step, quantity * step));
    }
    return result;
};

var recurse = function recurse(result, cur, prop) {
    if (Object(cur) !== cur) {
        result[prop] = cur;
    } else if (Array.isArray(cur)) {
        for (var i = 0, _l = cur.length; i < _l; i++) {
            recurse(result, cur[i], prop + "[" + i + "]");
        }if (l == 0) result[prop] = [];
    } else {
        var isEmpty = true;
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = Object.keys(cur)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var p = _step6.value;

                isEmpty = false;
                recurse(result, cur[p], prop ? prop + "." + p : p);
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }

        if (isEmpty && prop) result[prop] = {};
    }
};

var flatten = exports.flatten = function flatten(data) {
    var result = {};
    recurse(result, data, "");
    return result;
};

var unflatten = exports.unflatten = function unflatten(o) {
    if (!isObject(o) || Array.isArray(o)) return o;
    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = Object.keys(o)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var p = _step7.value;

            var cur = resultholder,
                prop = "",
                m = void 0;
            while (m = regex.exec(p)) {
                cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
                prop = m[2] || m[1];
            }
            cur[prop] = o[p];
        }
    } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
            }
        } finally {
            if (_didIteratorError7) {
                throw _iteratorError7;
            }
        }
    }

    return resultholder[""] || resultholder;
};

var isPhone = exports.isPhone = function isPhone(aPhone) {
    return RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|177)[0-9]{8}$/).test(aPhone);
};

var isIDNo = exports.isIDNo = function isIDNo(code) {
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " },
        tip = '',
        pass = true;

    //if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
    //if(!code || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(code)){
    if (!code || !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],
                sum = 0,
                ai = 0,
                wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17].toUpperCase()) {
                tip = "校验位错误";
                pass = false;
            }
        } else if (code.length == 15) {
            // 通过验证
        } else {
            pass = false;
        }
    }
    return pass;
};

var sexFromIDNo = exports.sexFromIDNo = function sexFromIDNo(idNo) {
    if (isIDNo(idNo)) {
        if (idNo.length == 18) {
            return idNo.charAt(16) % 2 ? 'M' : 'F';
        } else if (idNo.length == 15) {
            return idNo.charAt(14) % 2 ? 'M' : 'F';
        }
    }
    return 'N';
};

var birthdayFromIDNo = exports.birthdayFromIDNo = function birthdayFromIDNo(idNo) {
    if (isIDNo(idNo)) {
        if (idNo.length == 18) {
            return idNo.substr(6, 4) + '-' + idNo.substr(10, 2) + '-' + idNo.substr(12, 2);
        } else if (idNo.length == 15) {
            return '19' + idNo.substr(6, 2) + '-' + idNo.substr(8, 2) + '-' + idNo.substr(10, 2);
        }
    }
    return '';
};

var thunk2Func = exports.thunk2Func = _thunkify2.default;

var thunk2Promise = exports.thunk2Promise = function thunk2Promise(fn) {
    var ctx = undefined;
    return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return (0, _thunkToPromise2.default)((0, _thunkify2.default)(fn).apply(ctx, args));
    };
};

var env = exports.env = function env(env_str) {
    return process.env[env_str || 'NODE_ENV'];
};

var isProduction = exports.isProduction = function isProduction() {
    return env() === 'production';
};