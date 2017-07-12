'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fsExtra = require('fs-extra');

var _utils = require('../src/utils');

/**
 * Created by zppro on 17-6-23.
 */
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

Dict.prototype.add = function (k, o) {
    if ((0, _utils.isString)(o)) {
        var pairs = o.split(","),
            _keys = [],
            _vals = [];
        pairs.forEach(function (io) {
            var split = void 0;
            if (io.indexOf("=") != -1) {
                split = "=";
            } else if (io.indexOf(":") != -1) {
                split = ":";
            }
            if (split) {
                var arrKV = io.split(split);

                _keys.push(arrKV[0]);
                _vals.push(arrKV[1]);
            } else {
                _keys.push(io);
                _vals.push(io);
            }
        });
        this.keys[k] = _keys;
        this.vals[k] = _vals;
    } else if (Array.isArray(o)) {
        if (o.length > 0) {
            if ((0, _utils.isString)(o[0])) {
                this.keys[k] = o;
                this.vals[k] = o;
            } else if (Array.isArray(o[0])) {
                this.keys[k] = o.map(function (it) {
                    return it[0];
                });
                this.vals[k] = o.map(function (it) {
                    return it[1];
                });
            } else if ((0, _utils.isObject)(o[0])) {
                this.keys[k] = (0, _utils.pluck)(o, 'k');
                this.vals[k] = (0, _utils.pluck)(o, 'v');
            } else {
                return;
            }
        } else {
            this.keys[k] = o;
            this.vals[k] = o;
        }
    } else if ((0, _utils.isObject)(o)) {
        this.keys[k] = Object.keys(o);
        this.vals[k] = (0, _utils.values)(o);
    }
    var pairObj = {};
    for (var i = 0, len = this.keys[k].length; i < len; i++) {
        pairObj[this.keys[k][i]] = this.vals[k][i];
    }
    this.pairs[k] = pairObj;
};

Dict.prototype.remove = function (k) {
    delete this.keys[k];
    delete this.vals[k];
    delete this.pairs[k];
};

Dict.prototype.clear = function () {
    this.keys = {};
    this.vals = {};
    this.pairs = {};
};

Dict.prototype.readJson = function (file) {
    var self = this;
    return (0, _fsExtra.pathExists)(file).then(function (exists) {
        if (!exists) {
            return;
        }

        return (0, _fsExtra.readJson)(file).then(function (jo) {
            if (Array.isArray(jo) && jo.length > 0) {
                for (var i = 0, len = jo.length; i < len; i++) {
                    self.add("d" + i, jo[i]);
                }
            } else if ((0, _utils.isObject)(jo)) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.keys(jo)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var k = _step.value;

                        self.add(k, jo[k]);
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
        }).catch(function (err) {
            console.error(err);
        });
    });
};

Dict.prototype.writeJSON = function (file) {
    var self = this;
    return (0, _fsExtra.ensureFile)(file).then(function () {
        return (0, _fsExtra.writeJson)(file, self.pairs);
    }).catch(function (err) {
        console.error(err);
    });
};

exports.default = function () {
    return new Dict();
};