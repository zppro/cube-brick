'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by zppro on 17-6-23.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stopped = 'job-state-stopped';
var running = 'job-state-running';
var pausing = 'job-state-pausing';

var Job = function () {
    function Job(job_id, job_name, job_rule, job_exec, options) {
        var _this = this;

        _classCallCheck(this, Job);

        this.id = job_id;
        this.name = job_name;
        this.rule = job_rule;
        this.exec = job_exec;
        this.options = options;

        this.start = function () {
            _this._start();
        };
        this.stop = function () {
            _this._stop();
        };
        this.suspend = function () {
            _this._suspend();
        };
        this.resume = function () {
            _this._resume();
        };

        this.state = stopped;

        if (options.autoStart) {
            this._start();
        }
    }

    _createClass(Job, [{
        key: '_start',
        value: function _start() {
            var _this2 = this;

            if (!this.scheduleJob) {
                this.scheduleJob = _nodeSchedule2.default.scheduleJob(this.rule, function () {
                    if (_this2.state !== pausing) {
                        _this2.exec();
                    }
                });
            }
            if (this.state === stopped) {
                this.state = running;
                this.printLog && console.log((0, _moment2.default)().format('HH:mm:ss') + (' job [' + this.name + '(' + this.id + ')] is started.'));
            } else {
                this.printLog && console.log((0, _moment2.default)().format('HH:mm:ss') + (' job [' + this.name + '(' + this.id + ')] is already running.'));
            }
        }
    }, {
        key: '_stop',
        value: function _stop() {
            if (this.scheduleJob) {
                this.scheduleJob.cancel();
                this.scheduleJob = null;
                this.state = stopped;
                this.printLog && console.log((0, _moment2.default)().format('HH:mm:ss') + (' job [' + this.name + '(' + this.id + ')] is canceled.'));
            }
        }
    }, {
        key: '_suspend',
        value: function _suspend() {
            if (this.scheduleJob) {
                this.state = pausing;
                this.printLog && console.log((0, _moment2.default)().format('HH:mm:ss') + (' job [' + this.name + '(' + this.id + ')] is suspended.'));
            }
        }
    }, {
        key: '_resume',
        value: function _resume() {
            if (this.scheduleJob) {
                this.state = running;
                this.printLog && console.log((0, _moment2.default)().format('HH:mm:ss') + (' job [' + this.name + '(' + this.id + ')] is resumed.'));
            }
        }
    }]);

    return Job;
}();

var manager = {
    job_stores: {},
    length: 0,
    getJob: function getJob(job_id) {
        return this.job_stores[job_id];
    },
    createJob: function createJob() {
        var job_id = void 0,
            job_name = void 0,
            job_rule = void 0,
            job_exec = void 0,
            options = void 0,
            job = void 0;
        if (arguments.length == 5) {
            job_id = arguments[0];
            job_name = arguments[1];
            job_rule = arguments[2];
            job_exec = arguments[3];
            options = arguments[4];
        } else if (arguments.length == 4) {
            if ((0, _utils.isFunction)(arguments[3])) {
                job_id = arguments[0];
                job_name = arguments[1];
                job_rule = arguments[2];
                job_exec = arguments[3];
            } else {
                job_id = arguments[0];
                job_name = arguments[0];
                job_rule = arguments[1];
                job_exec = arguments[2];
                options = arguments[3];
            }
        } else if (arguments.length == 3) {
            job_id = arguments[0];
            job_name = arguments[0];
            job_rule = arguments[1];
            job_exec = arguments[2];
        } else {
            throw new Error('invalid arguments');
        }
        options = Object.assign({ autoStart: true, printLog: true }, options || {});

        job = this.job_stores[job_id];

        if (!job) {
            job = new Job(job_id, job_name, job_rule, job_exec, options);
            this.job_stores[job_id] = job;
            this.length++;
            options.printLog && console.log((0, _moment2.default)().format('HH:mm:ss') + (' job [' + job.name + '(' + job.id + ')] is created.'));
        } else {
            options.printLog && console.log((0, _moment2.default)().format('HH:mm:ss') + (' job [' + job.name + '(' + job.id + ')] is already created.'));
        }

        return job;
    },
    destroyJob: function destroyJob(job_id) {
        var job = this.job_stores[job_id];
        if (job) {
            this.printLog && console.log((0, _moment2.default)().format('HH:mm:ss') + (' job [' + job.name + '(' + job.id + ')] is destroyed.'));
            job.stop();
            this.job_stores[job_id] = job = null;
            this.length--;
        }
    }
};

exports.default = manager;