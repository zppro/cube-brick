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

const isString = exports.isString = o => {
    return Object.prototype.toString.call(o) == '[object String]';
};

const isObject = exports.isObject = o => {
    return o === Object(o);
};

const isFunction = exports.isFunction = o => {
    let getType = {};
    return o && getType.toString.call(o) === '[object Function]';
};

const pick = exports.pick = (o, ...keys) => {
    let result = {};
    if (o) {
        if (Array.isArray(o)) {
            return o.map(o => pick.apply(null, [o].concat(keys)));
        } else if (isObject(o)) {
            for (let k of keys) {
                if (o[k]) {
                    result[k] = o[k];
                }
            }
        }
    }
    return result;
};

const pluck = exports.pluck = (arr, key) => {
    return arr.map(o => o[key]);
};

const values = exports.values = o => {
    return Object.keys(o).map(k => o[k]);
};

const range = exports.range = (start, stop, step) => {
    if (stop == null) {
        stop = start || 0;
        start = 0;
    }
    step = step || 1;

    let length = Math.max(Math.ceil((stop - start) / step), 0);
    let current = start;
    return Array.from({ length: length }, (v, k) => {
        k === 0 ? current : current += step;
        return current;
    });
};

const _rangeDate = (start, end, format, type) => {
    let s = (0, _moment2.default)(start),
        e = end ? (0, _moment2.default)(end) : (0, _moment2.default)(),
        _f;
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

    let f = format || _f,
        ret = [];
    for (let d = s; e.diff(d) >= 0; d = d.add(1, type)) {
        ret.push(d.format(f));
    }
    return ret;
};

const rangeDateAsMonth = exports.rangeDateAsMonth = (start, end, format) => {
    return _rangeDate(start, end, format);
};
const rangeDateAsYear = exports.rangeDateAsYear = (start, end, format) => {
    return _rangeDate(start, end, format, 'years');
};
const rangeDateAsDay = exports.rangeDateAsDay = (start, end, format) => {
    return _rangeDate(start, end, format, 'days');
};

const setProperty = exports.setProperty = (o, k, v) => {
    if (isObject(o)) {
        if (o.hasOwnProperty(k)) {
            o[k] = v;
        }
    }
};

const setPropertyRecursion = exports.setPropertyRecursion = (o, k, v) => {
    if (isObject(o)) {
        if (o.hasOwnProperty(k)) {
            o[k] = v;
        } else {
            for (let oc of Object.keys(o)) {
                setPropertyRecursion(o[oc], k, v);
            }
        }
    }
};

const setPropertyDotExpression = exports.setPropertyDotExpression = (o, k, v) => {
    if (isObject(o)) {
        if (o.hasOwnProperty(k)) {
            o[k] = v;
        } else {
            //保证至少一个点
            let arrExpPath = k.split('.');
            if (arrExpPath.length > 1) {
                let obj = o[arrExpPath[0]];
                for (let i = 1, len = arrExpPath.length; i < len - 1; i++) {
                    obj = obj[arrExpPath[i]];
                }
                obj[arrExpPath[arrExpPath.length - 1]] = v;
            }
        }
    }
};

const getPropertyCount = exports.getPropertyCount = o => {
    let count = 0;
    for (let k of Object.keys(o)) {
        count++;
    }
    return count;
};

const randomN = exports.randomN = len => {
    return Math.random().toString().substr(2, len);
};

const randomS = exports.randomS = len => {
    return process.binding('crypto').randomBytes(len).toString('hex').substr(0, len);
};

const readDirectoryStructure = exports.readDirectoryStructure = (dir, options) => {
    dir = _path2.default.normalize(dir);
    if (dir.endsWith('/')) {
        dir = dir.substr(0, dir.length - 1);
    }
    options = options || {};
    let exts = options.exts;
    let excludeDirs = options.excludeDirs;
    if (excludeDirs) {
        if (!Array.isArray(excludeDirs)) {
            excludeDirs = [excludeDirs];
        }
        excludeDirs = excludeDirs.map(o => {
            return _path2.default.join(dir, o);
        });
    }
    let testExclude = (excludes, testPath) => {
        return excludes.some(o => {
            return testPath.startsWith(o);
        });
    };
    let filter = _through2.default.obj(function (item, enc, next) {
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

const _transformTree = (dir, filter) => {
    let promise = _transformObject(dir, filter).then(function (ret) {
        let fileKeys = ['name', 'relative_name', 'path', 'relative_path'];
        let treeNodes = [],
            dirNode,
            children;
        for (let key of Object.keys(ret)) {
            if (!fileKeys.includes(key) && isObject(ret[key])) {
                dirNode = { _id: ret[key].relative_path || key, name: key };
                children = _parseChildren(ret[key], fileKeys);
                if (children && children.length > 0) {
                    dirNode.children = children;
                }
                treeNodes.push(dirNode);
            }
        }
        return treeNodes;
    });
    return promise;
};

const _parseChildren = (obj, fileKeys) => {
    let treeNodes = [],
        dirNode,
        children;
    for (let key of Object.keys(obj)) {
        if (!fileKeys.includes(fileKeys, key) && isObject(obj[key])) {
            dirNode = { _id: obj[key].relative_path || key, name: key };
            children = _parseChildren(obj[key], fileKeys);
            if (children && children.length > 0) {
                dirNode.children = children;
            }
            treeNodes.push(dirNode);
        }
    }
    return treeNodes;
};

const _transformObject = (dir, filter) => {
    let promise = new Promise(resolve => {
        let ret = {};
        (0, _klaw2.default)(dir).pipe(filter).on('data', function (item) {
            let baseName = _path2.default.basename(item.path);
            if (item.stats.isDirectory()) {
                ret[baseName] = {};
            } else {
                let relativeDirs = item.path.replace(dir + '/', '').split('/');
                relativeDirs.splice(relativeDirs.length - 1, 1);
                let dirLength = relativeDirs.length;
                let parent = ret;
                for (let i = 0; i < dirLength; i++) {
                    parent[relativeDirs[i]] = parent[relativeDirs[i]] || {};
                    parent = parent[relativeDirs[i]];
                }
                let extName = _path2.default.extname(item.path);
                let noExtBaseName = _path2.default.basename(item.path, extName);
                let key = noExtBaseName + extName;

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

const chunkArrayByCapacity = exports.chunkArrayByCapacity = (arr, capacity) => {
    let result = [],
        start,
        end;
    // console.log('total arr length:', arr.length);
    for (let x = 0; x < arr.length; x = x + capacity) {
        start = result.length * capacity;
        end = start + capacity < arr.length ? start + capacity : arr.length + 1;
        // console.log('chunkArrayRange:', start, end);
        result.push(arr.slice(start, end));
    }
    return result;
};

const chunkArrayByQuantity = exports.chunkArrayByQuantity = (arr, quantity) => {
    let result = [],
        start,
        end;
    let remainder = arr.length % quantity;
    let step = Math.ceil(arr.length / quantity);
    let max = remainder > 0 ? quantity - 1 : quantity;
    for (let x = 0; x < max; x++) {
        start = x * step;
        end = start + step;
        result.push(arr.slice(start, end));
    }
    if (remainder > 0) {
        result.push(arr.slice((quantity - 1) * step, quantity * step));
    }
    return result;
};

const recurse = (result, cur, prop) => {
    if (Object(cur) !== cur) {
        result[prop] = cur;
    } else if (Array.isArray(cur)) {
        for (let i = 0, l = cur.length; i < l; i++) recurse(result, cur[i], prop + "[" + i + "]");
        if (l == 0) result[prop] = [];
    } else {
        var isEmpty = true;
        for (let p of Object.keys(cur)) {
            isEmpty = false;
            recurse(result, cur[p], prop ? prop + "." + p : p);
        }
        if (isEmpty && prop) result[prop] = {};
    }
};

const flatten = exports.flatten = data => {
    let result = {};
    recurse(result, data, "");
    return result;
};

const unflatten = exports.unflatten = o => {
    if (!isObject(o) || Array.isArray(o)) return o;
    let regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    for (let p of Object.keys(o)) {
        let cur = resultholder,
            prop = "",
            m;
        while (m = regex.exec(p)) {
            cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
            prop = m[2] || m[1];
        }
        cur[prop] = o[p];
    }
    return resultholder[""] || resultholder;
};

const isPhone = exports.isPhone = aPhone => RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|177)[0-9]{8}$/).test(aPhone);

const isIDNo = exports.isIDNo = code => {
    let city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " },
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
            let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],
                sum = 0,
                ai = 0,
                wi = 0;
            for (let i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            let last = parity[sum % 11];
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

const sexFromIDNo = exports.sexFromIDNo = idNo => {
    if (isIDNo(idNo)) {
        if (idNo.length == 18) {
            return idNo.charAt(16) % 2 ? 'M' : 'F';
        } else if (idNo.length == 15) {
            return idNo.charAt(14) % 2 ? 'M' : 'F';
        }
    }
    return 'N';
};

const birthdayFromIDNo = exports.birthdayFromIDNo = idNo => {
    if (isIDNo(idNo)) {
        if (idNo.length == 18) {
            return idNo.substr(6, 4) + '-' + idNo.substr(10, 2) + '-' + idNo.substr(12, 2);
        } else if (idNo.length == 15) {
            return '19' + idNo.substr(6, 2) + '-' + idNo.substr(8, 2) + '-' + idNo.substr(10, 2);
        }
    }
    return '';
};

const thunk2Func = exports.thunk2Func = _thunkify2.default;

const thunk2Promise = exports.thunk2Promise = fn => {
    let ctx = undefined;
    return (...args) => {
        return (0, _thunkToPromise2.default)((0, _thunkify2.default)(fn).apply(ctx, args));
    };
};

const env = exports.env = env_str => {
    return process.env[env_str || 'NODE_ENV'];
};

const isProduction = exports.isProduction = () => {
    return env() === 'production';
};