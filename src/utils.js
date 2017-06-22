/**
 * Created by zppro on 17-6-22.
 */

// const crypto = require('crypto');
// const binding = process.binding('crypto');
// const randomBytes = process.binding('crypto').randomBytes;
const fs = require('fs-extra');
const path = require('path');
const through2 = require('through2');


export const isString =  (o) => {
    return Object.prototype.toString.call(o) == '[object String]';
};

export const isObject = (o) => {
    return o === Object(o);
};

export const setProperty = (o,k,v) => {
    if (isObject(o)) {
        if (o.hasOwnProperty(k)) {
            o[k] = v;
        }
    }
};

export const setPropertyRecursion = (o,k,v) => {
    if(isObject(o)){
        if(o.hasOwnProperty(k)){
            o[k] = v;
        }
        else {
            for (let oc in o) {
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
    let n, count = 0;
    for(n in o){
        if(o.hasOwnProperty(n)){
            count++;
        }
    }
    return count;
}


export const randomN = (len) => {
    return Math.random().toString().substr(2,len);
};

export const randomS = (len) => {
    return process.binding('crypto').randomBytes(len).toString('hex').substr(0, len);
};

export const readDirectoryStructure = (dir, exts, options) => {
    dir = path.normalize(dir);
    if (dir.endsWith('/')) {
        dir = dir.substr(0, dir.length - 1);
    }
    options = options || {};
    let filter = through2.obj(function (item, enc, next) {
        if (dir != item.path) {
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
        for(let key in ret) {
            if (ret.hasOwnProperty(key)) {
                if (!fileKeys.includes(key) && isObject(ret[key])) {
                    dirNode = {_id: ret[key].relative_path || key, name: key};
                    children = _parseChildren(ret[key], fileKeys);
                    if(children && children.length > 0) {
                        dirNode.children = children;
                    }
                    treeNodes.push(dirNode)
                }
            }
        }
        return treeNodes;
    });
    return promise;
};

const _parseChildren = (obj, fileKeys) => {
    let treeNodes = [], dirNode, children;
    for(let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (!fileKeys.includes(fileKeys, key) && isObject(obj[key])) {
                dirNode = {_id: obj[key].relative_path || key, name: key};
                children = _parseChildren(obj[key], fileKeys);
                if (children && children.length > 0) {
                    dirNode.children = children;
                }
                treeNodes.push(dirNode)
            }
        }
    }
    return treeNodes;
};

const _transformObject = (dir, filter) => {
    let promise = new Promise(resolve=> {
            let ret = {};
            fs.walk(dir)
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

export const chunkArrayRange = (arr, range) => {
    let result = [], start, end;
    // console.log('total arr length:', arr.length);
    for (let x = 0; x < arr.length; x = x + range) {
        start = result.length * range;
        end = (start + range) < arr.length ? (start + range) : arr.length + 1;
        // console.log('chunkArrayRange:', start, end);
        result.push(arr.slice(start, end));
    }
    return result;
};

export const chunkArraySize = (arr, size) => {
    let result = [], start, end;
    for (let x = 0; x < Math.ceil(arr.length / size); x++) {
        start = x * size;
        end = start + size;
        result.push(arr.slice(start, end));
    }
    return result;
};

export const unflatten = (o) => {
    if (!isObject(o) || Array.isArray(o))
        return o;
    let regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    for (let p in o) {
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
        for (let p in cur) {
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


