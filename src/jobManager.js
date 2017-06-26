/**
 * Created by zppro on 17-6-23.
 */
import schedule from 'node-schedule';
import moment from 'moment';
import { isFunction } from './utils'

const stopped = 'job-state-stopped';
const running = 'job-state-running';
const pausing = 'job-state-pausing';

class Job {
    constructor(job_id, job_name, job_rule, job_exec, options) {
        this.id = job_id;
        this.name = job_name;
        this.rule = job_rule;
        this.exec = job_exec;
        this.options = options;

        this.start = () => {
            this._start();
        };
        this.stop = () => {
            this._stop();
        };
        this.suspend = () => {
            this._suspend();
        };
        this.resume = () => {
            this._resume();
        };

        this.state = stopped;

        if (options.autoStart) {
            this._start();
        }
    }

    _start() {
        if (!this.scheduleJob) {
            this.scheduleJob = schedule.scheduleJob(this.rule, ()=> {
                if (this.state !== pausing) {
                    this.exec();
                }
            });
        }
        if (this.state === stopped) {
            this.state = running;
            this.printLog && console.log(moment().format('HH:mm:ss') + ` job [${this.name}(${this.id})] is started.`);
        }
        else {
            this.printLog && console.log(moment().format('HH:mm:ss') + ` job [${this.name}(${this.id})] is already running.`);
        }
    }

    _stop() {
        if (this.scheduleJob) {
            this.scheduleJob.cancel();
            this.scheduleJob = null;
            this.state = stopped;
            this.printLog && console.log(moment().format('HH:mm:ss') + ` job [${this.name}(${this.id})] is canceled.`);
        }
    }

    _suspend() {
        if (this.scheduleJob) {
            this.state = pausing;
            this.printLog && console.log(moment().format('HH:mm:ss') + ` job [${this.name}(${this.id})] is suspended.`);
        }
    }

    _resume() {
        if (this.scheduleJob) {
            this.state = running;
            this.printLog && console.log(moment().format('HH:mm:ss') + ` job [${this.name}(${this.id})] is resumed.`);
        }
    }
}


const manager = {
    job_stores: {},
    length: 0,
    getJob: function (job_id) {
        return this.job_stores[job_id];
    },
    createJob: function () {
        let job_id, job_name, job_rule, job_exec, options, job;
        if (arguments.length == 5) {
            job_id = arguments[0];
            job_name = arguments[1];
            job_rule = arguments[2];
            job_exec = arguments[3];
            options = arguments[4];
        }
        else if (arguments.length == 4) {
            if (isFunction(arguments[3])) {
                job_id = arguments[0];
                job_name = arguments[1];
                job_rule = arguments[2];
                job_exec = arguments[3];
            }
            else {
                job_id = arguments[0];
                job_name = arguments[0];
                job_rule = arguments[1];
                job_exec = arguments[2];
                options = arguments[3];
            }
        }
        else if (arguments.length == 3) {
            job_id = arguments[0];
            job_name = arguments[0];
            job_rule = arguments[1];
            job_exec = arguments[2];
        }
        else {
            throw new Error('invalid arguments');
        }
        options =  Object.assign({autoStart: true, printLog: true}, options|| {});

        job = this.job_stores[job_id];

        if (!job) {
            job = new Job(job_id, job_name, job_rule, job_exec, options);
            this.job_stores[job_id] = job;
            this.length++;
            options.printLog && console.log(moment().format('HH:mm:ss') + ` job [${job.name}(${job.id})] is created.` );
        } else {
            options.printLog && console.log(moment().format('HH:mm:ss') + ` job [${job.name}(${job.id})] is already created.` );
        }

        return job;
    },
    destroyJob: function (job_id) {
        let job = this.job_stores[job_id];
        if (job) {
            this.printLog && console.log(moment().format('HH:mm:ss') + ` job [${job.name}(${job.id})] is destroyed.`);
            job.stop();
            this.job_stores[job_id] = job = null;
            this.length--;

        }
    }
};

export default manager;