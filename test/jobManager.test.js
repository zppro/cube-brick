/**
 * Created by zppro on 17-6-26.
 */
import { expect } from 'chai';
import jobManager from '../src/jobManager'
import schedule from 'node-schedule';
import moment from 'moment';

describe('module [jobManager]', () => {

    let job1, job_id_1 = 'job_per_miniute', job_name_1 = '每分钟执行一次的任务', job_rule_1 = '*/1 * * * *', beginTime, endTime,
        currentJob;

    it(`create job ${job_id_1} exec per minute`, () => {
        beginTime = moment();
        return new Promise((resolve) => {
            job1 = jobManager.createJob(job_id_1, job_name_1, job_rule_1, ()=>{
                resolve();
            });
        }).then(()=>{
            endTime = moment();
            let ts = moment(endTime.format('YYYY-MM-DD HH:mm')).diff(moment(beginTime.format('YYYY-MM-DD HH:mm')), 'minutes');
            expect(ts).to.be.equal(1);
        });
    });

    it(`get job ${job_id_1} by job_id`, () => {
        currentJob = jobManager.getJob(job_id_1);
        expect(currentJob).to.be.equal(job1);
    });

    it(`destroyJob job ${job_id_1} by job_id`, () => {
        jobManager.destroyJob(job_id_1)
        currentJob = jobManager.getJob(job_id_1);
        expect(currentJob).to.be.null;
    });
    
    
});