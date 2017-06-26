/**
 * Created by zppro on 17-6-22.
 */

import klaw from 'klaw';
import path from 'path';
import through2 from 'through2';
import moment from 'moment';

export const isString = (o) => {
    return Object.prototype.toString.call(o) == '[object String]';
};

export const isObject = (o) => {
    return o === Object(o);
};

export const isFunction = (o) => {
    let getType = {};
    return o && getType.toString.call(o) === '[object Function]';
};

export const pick = (o, ...keys) => {
    let result = {};
    if (o) {
        if(Array.isArray(o)){
            return o.map(o => pick.apply(null, [o].concat(keys)));
        } else if(isObject(o)) {
            for (let k of keys) {
                if (o[k]) {
                    result[k] = o[k];
                }
            }
        }
    }
    return result;
}

export const pluck = (arr, key) => {
    return arr.map(o => o[key])
};

export const values = (o) => {
    return Object.keys(o).map(k => o[k]);
};


export const range = (start, stop, step) => {
    if (stop == null) {
        stop = start || 0;
        start = 0;
    }
    step = step || 1;

    let length = Math.max(Math.ceil((stop - start) / step), 0);
    let current = start;
    return Array.from({length: length}, (v, k) => {
        k === 0 ? current : current += step;
        return current;
    });
};

const _rangeDate = (start, end, format, type) => {
    let s = moment(start), e = end ? moment(end) : moment(), _f;
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

    let f = format || _f, ret = [];
    for (let d = s; e.diff(d) >= 0; d = d.add(1, type)) {
        ret.push(d.format(f));
    }
    return ret;
}

export const rangeDateAsMonth = (start, end, format) => {
    return _rangeDate(start, end, format);
};
export const rangeDateAsYear = (start, end, format) => {
    return _rangeDate(start, end, format, 'years');
};
export const rangeDateAsDay = (start, end, format) => {
    return _rangeDate(start, end, format, 'days');
};


export const setProperty = (o,k,v) => {
    if (isObject(o)) {
        if (o.hasOwnProperty(k)) {
            o[k] = v;
        }
    }
};

export const setPropertyRecursion = (o,k,v) => {
    if(isObject(o)) {
        if (o.hasOwnProperty(k)) {
            o[k] = v;
        }
        else {
            for (let oc of Object.keys(o)) {
                setPropertyRecursion(o[oc], k, v);
            }
        }
    }
};

export const setPropertyDotExpression = (o,k,v) => {
    if(isObject(o)){
        if(o.hasOwnProperty(k)){
            o[k] = v;
        }
        else {
            //保证至少一个点
            let arrExpPath = k.split('.');
            if (arrExpPath.length > 1) {
                let obj = o[arrExpPath[0]];
                for (let i = 1,len = arrExpPath.length; i < len - 1; i++) {
                    obj = obj[arrExpPath[i]];
                }
                obj[arrExpPath[arrExpPath.length - 1]] = v;
            }
        }
    }
};

export const getPropertyCount = (o) => {
    let count = 0;
    for (let k of Object.keys(o)) {
        count++;
    }
    return count;
}


export const randomN = (len) => {
    return Math.random().toString().substr(2,len);
};

export const randomS = (len) => {
    return process.binding('crypto').randomBytes(len).toString('hex').substr(0, len);
};

export const readDirectoryStructure = (dir, options) => {
    dir = path.normalize(dir);
    if (dir.endsWith('/')) {
        dir = dir.substr(0, dir.length - 1);
    }
    options = options || {};
    let exts = options.exts;
    let excludeDirs = options.excludeDirs;
    if (excludeDirs) {
        if(!Array.isArray(excludeDirs)){
            excludeDirs = [excludeDirs];
        }
        excludeDirs = excludeDirs.map((o)=>{return path.join(dir, o);})
    }
    let testExclude = (excludes, testPath) => {
        return excludes.some((o)=>{ return testPath.startsWith(o);});
    }
    let filter = through2.obj(function (item, enc, next) {
        if (dir != item.path && !(excludeDirs && testExclude(excludeDirs, item.path))) {
            if (!exts) {
                this.push(item);
            }
            else {
                if (!Array.isArray(exts)) {
                    exts = [exts];
                }

                if (exts.includes(path.extname(item.path))) {
                    this.push(item);
                }
            }
        }
        next()
    });

    return options.format === 'tree' ? _transformTree(dir, filter) : _transformObject(dir, filter);
};

const _transformTree = (dir, filter) => {
    let promise  = _transformObject(dir,filter).then(function(ret){
        let fileKeys = ['name', 'relative_name', 'path', 'relative_path'];
        let treeNodes = [], dirNode, children;
        for(let key of Object.keys(ret)) {
            if (!fileKeys.includes(key) && isObject(ret[key])) {
                dirNode = {_id: ret[key].relative_path || key, name: key};
                children = _parseChildren(ret[key], fileKeys);
                if (children && children.length > 0) {
                    dirNode.children = children;
                }
                treeNodes.push(dirNode)
            }
        }
        return treeNodes;
    });
    return promise;
};

const _parseChildren = (obj, fileKeys) => {
    let treeNodes = [], dirNode, children;
    for(let key of Object.keys(obj)) {
        if (!fileKeys.includes(fileKeys, key) && isObject(obj[key])) {
            dirNode = {_id: obj[key].relative_path || key, name: key};
            children = _parseChildren(obj[key], fileKeys);
            if (children && children.length > 0) {
                dirNode.children = children;
            }
            treeNodes.push(dirNode)
        }
    }
    return treeNodes;
};

const _transformObject = (dir, filter) => {
    let promise = new Promise(resolve=> {
            let ret = {};
            klaw(dir)
                .pipe(filter)
                .on('data', function (item) {
                    let baseName = path.basename(item.path);
                    if (item.stats.isDirectory()) {
                        ret[baseName] = {};
                    }
                    else {
                        let relativeDirs = item.path.replace(dir + '/', '').split('/');
                        relativeDirs.splice(relativeDirs.length - 1, 1);
                        let dirLength = relativeDirs.length;
                        let parent = ret;
                        for (let i = 0; i < dirLength; i++) {
                            parent[relativeDirs[i]] = parent[relativeDirs[i]] || {};
                            parent = parent[relativeDirs[i]];
                        }
                        let extName = path.extname(item.path);
                        let noExtBaseName = path.basename(item.path, extName);
                        let key = noExtBaseName + extName

                        parent[key] = {
                            name: key,
                            relative_name: relativeDirs.join('_') + '_' + noExtBaseName,
                            path: item.path,
                            relative_path: relativeDirs.join('/') + '/' + baseName
                        };
                    }
                })
                .on('end', function () {
                    resolve(ret);
                });
        }
    );
    return promise;
};

export const chunkArrayByCapacity = (arr, capacity) => {
    let result = [], start, end;
    // console.log('total arr length:', arr.length);
    for (let x = 0; x < arr.length; x = x + capacity) {
        start = result.length * capacity;
        end = (start + capacity) < arr.length ? (start + capacity) : arr.length + 1;
        // console.log('chunkArrayRange:', start, end);
        result.push(arr.slice(start, end));
    }
    return result;
};

export const chunkArrayByQuantity = (arr, quantity) => {
    let result = [], start, end;
    let remainder = arr.length % quantity;
    let step = Math.ceil(arr.length / quantity);
    let max = remainder > 0 ? quantity - 1: quantity;
    for (let x = 0; x < max; x++) {
        start = x * step;
        end = start + step;
        result.push(arr.slice(start, end));
    }
    if(remainder > 0) {
        result.push(arr.slice((quantity - 1) * step, quantity * step));
    }
    return result;
};


const recurse = (result, cur, prop) => {
    if (Object(cur) !== cur) {
        result[prop] = cur;
    } else if (Array.isArray(cur)) {
        for(let i=0, l=cur.length; i<l; i++)
            recurse(result, cur[i], prop + "[" + i + "]");
        if (l == 0)
            result[prop] = [];
    } else {
        var isEmpty = true;
        for (let p of Object.keys(cur)) {
            isEmpty = false;
            recurse(result, cur[p], prop ? prop+"."+p : p);
        }
        if (isEmpty && prop)
            result[prop] = {};
    }
};

export const flatten = (data) => {
    let result = {};
    recurse(result, data, "");
    return result;
};

export const unflatten = (o) => {
    if (!isObject(o) || Array.isArray(o))
        return o;
    let regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    for (let p of Object.keys(o)) {
        let cur = resultholder,
            prop = "",
            m;
        while (m = regex.exec(p)) {
            cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
            prop = m[2] || m[1];
        }
        cur[prop] = o[p];
    }
    return resultholder[""] || resultholder;
};


