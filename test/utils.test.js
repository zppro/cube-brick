/**
 * Created by zppro on 17-6-22.
 */

import { expect } from 'chai';
import { isString, isObject } from '../src/utils';

describe('module [utils]', () => {

    let str = 'this is a string', number = 3,
        obj = {foo: 'bar'}, objStr = JSON.stringify(obj),
        arr= ['aa', 134], arrStr = JSON.stringify(arr);
    describe('test function <isString>', () => {

        it(`'${str}' expect to be a string`, () => {
            expect(isString(str)).to.be.equal(true);
        });
        it(`${number} expect to be not a string`, () => {
            expect(isString(number)).to.be.not.equal(true);
        });

        it( `let obj = ${objStr}, obj expect to be not a string`, () => {
            expect(isString(obj)).to.be.not.equal(true);
        });

        it(`obj.foo expect to be a string`, () => {
            expect(isString(obj.foo)).to.be.equal(true);
        });

        it(`let arr = ${arrStr}, arr expect to be not a string`, () => {
            expect(isString(arr)).to.be.not.equal(true);
        });

        it(`arr[0] expect to be a string`, () => {
            expect(isString(arr[0])).to.be.equal(true);
        });

        it(`null expect to be not a string`, () => {
            expect(isString(null)).to.be.not.equal(true);
        });

        it(`undefined expect to be not a string`, () => {
            expect(isString(undefined)).to.be.not.equal(true);
        });
    });

    describe('test function <isObject>', () => {
        it(`'${str}' expect to be not a object`, () => {
            expect(isObject(str)).to.be.not.equal(true);
        });

        it(`${number} expect to be not a object`, () => {
            expect(isObject(number)).to.be.not.equal(true);
        });

        it( `let obj = ${objStr}, obj expect to be a object`, () => {
            expect(isObject(obj)).to.be.equal(true);
        });

        it(`obj.foo expect to be not a object`, () => {
            expect(isObject(obj.foo)).to.be.not.equal(true);
        });

        it(`let arr = ${arrStr}, arr expect to be a object`, () => {
            expect(isObject(arr)).to.be.equal(true);
        });

        it(`arr[0] expect to be not a object`, () => {
            expect(isObject(arr[0])).to.be.not.equal(true);
        });

        it(`null expect to be a not object`, () => {
            expect(isObject(null)).to.be.not.equal(true);
        });

        it(`undefined expect to be not a object`, () => {
            expect(isObject(undefined)).to.be.not.equal(true);
        });
    });

});
