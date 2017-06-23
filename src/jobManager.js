/**
 * Created by zppro on 17-6-23.
 */
import schedule from 'node-schedule';
import moment from 'moment';


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
            if (_.isFunction(arguments[3])) {
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
        options =  Object.assign({autoStart: true, printLog: false}, options|| {});

        job = this.job_stores[job_id];
        if (!job) {
            job = {
                id: job_id,
                name: job_name,
                rule: job_rule,
                stop: stopJob,
                start: startJob,
                suspend: suspendJob,
                resume: resumeJob,
                job_running: false,
                job_pause: false,
                scheduleJob: null,
                printLog: options.printLog
            };

            function startJob() {
                var self = this;
                if (!this.job_running) {
                    this.scheduleJob = schedule.scheduleJob(job_rule, ()=> {
                        if (!self.job_pause) {
                            job_exec();
                        }
                    });
                    this.job_running = true;
                    this.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is started.');
                }
                else {
                    this.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is already running.');
                }
            }

            function stopJob() {
                if (this.scheduleJob) {
                    this.scheduleJob.cancel();
                    this.job_running = false;
                    this.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is canceled.');
                }
            }

            function suspendJob() {
                if (this.scheduleJob) {
                    this.job_pause = true;
                    this.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is suspended.');
                }
            }

            function resumeJob() {
                if (this.scheduleJob) {
                    this.job_pause = false;
                    this.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is resumed.');
                }
            }

            this.job_stores[job_id] = job;
            this.length++;

            job.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is created.');

            if (options.autoStart) {
                job.start();
            }
        }

        return job;
    },
    destroyJob: function (job_id) {
        let job = this.job_stores[job_id];
        if (job) {
            job.stop();
            this.job_stores[job_id] = job = null;
            this.length--;
            this.printLog && console.log(moment().format('HH:mm:ss') + ' job [' + job_id + '] is destroyed.');
        }
    }
};

export default manager;