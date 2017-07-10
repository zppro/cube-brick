/**
 * Created by zppro on 17-6-23.
 */
import { ensureFile, pathExists, readJson, writeJson } from 'fs-extra';
import { isString, isObject, pluck, values } from '../src/utils'

function Dict() {
    this.keys = {};
    this.vals = {};
    this.pairs = {};
};

// v的可能取值
//
//1 "v1,v2"
//2 "k1=v1,k2=v2"
//3 "k1:v1,k2:v2"
//4 {"k1":"v1","k2":"v2"}
//5 ["v1","v2"]
//6 [{k:"k1",v:"v1"},{k:"k2",v:"v2"}]
//7 [["k1","v1"],["k2","v2"]]
//8 [{k:"k1",v:{"name":"姓名1","order":1}},{k:"k2",v:{"name":"姓名2","order":2}}];

Dict.prototype.add = function(k, o) {
    if (isString(o)) {
        let pairs = o.split(","), _keys = [], _vals = [];
        pairs.forEach((io)=> {
            let split;
            if (io.indexOf("=") != -1) {
                split = "=";
            }
            else if (io.indexOf(":") != -1) {
                split = ":";
            }
            if (split) {
                let arrKV = io.split(split);

                _keys.push(arrKV[0]);
                _vals.push(arrKV[1]);
            }
            else {
                _keys.push(io);
                _vals.push(io);
            }
        });
        this.keys[k] = _keys;
        this.vals[k] = _vals;
    }
    else if (Array.isArray(o)) {
        if (o.length > 0) {
            if (isString(o[0])) {
                this.keys[k] = o;
                this.vals[k] = o;
            }
            else if (Array.isArray(o[0])) {
                this.keys[k] = o.map(it=>it[0]);
                this.vals[k] = o.map(it=>it[1]);
            }
            else if (isObject(o[0])) {
                this.keys[k] = pluck(o, 'k');
                this.vals[k] = pluck(o, 'v');
            }
            else {
                return;
            }
        }
        else {
            this.keys[k] = o;
            this.vals[k] = o;
        }
    }
    else if (isObject(o)) {
        this.keys[k] = Object.keys(o);
        this.vals[k] = values(o);
    }
    let pairObj = {};
    for (let i = 0, len = this.keys[k].length; i < len; i++) {
        pairObj[this.keys[k][i]] = this.vals[k][i];
    }
    this.pairs[k] = pairObj;
};

Dict.prototype.remove = function(k) {
    delete this.keys[k];
    delete this.vals[k];
    delete this.pairs[k];
};

Dict.prototype.clear = function() {
    this.keys = {};
    this.vals = {};
    this.pairs = {};
};

Dict.prototype.readJson = function(file) {
    let self = this;
    return pathExists(file).then((exists)=> {
        if (!exists) {
            return;
        }

        return readJson(file).then(jo => {
            if (Array.isArray(jo) && jo.length > 0) {
                for (let i = 0, len = jo.length; i < len; i++) {
                    self.add("d" + i, jo[i]);
                }
            }
            else if (isObject(jo)) {
                for (let k of Object.keys(jo)) {
                    self.add(k, jo[k]);
                }
            }
        }).catch(err => {
            console.error(err)
        });
    });
};

Dict.prototype.writeJSON = function(file) {
    let self = this;
    return ensureFile(file).then(() => {
        return writeJson(file, self.pairs);
    }).catch(err => {
        console.error(err)
    });
};

export default () => {
    return new Dict();
};