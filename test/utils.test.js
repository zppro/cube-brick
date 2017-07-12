/**
 * Created by zppro on 17-6-22.
 */
/**
 * Created by zppro on 17-6-22.
 */

import { expect } from 'chai';
import { isString, isObject, isFunction, pick, pluck, values, range, rangeDateAsMonth, rangeDateAsYear, rangeDateAsDay,
    setProperty, setPropertyRecursion, setPropertyDotExpression, getPropertyCount,
    randomN, randomS, readDirectoryStructure, chunkArrayByCapacity, chunkArrayByQuantity, flatten, unflatten,
    isPhone, isIDNo, sexFromIDNo,birthdayFromIDNo, thunk2Func, thunk2Promise, env, isProduction } from '../src/utils';

describe('module [utils]', () => {

    let str = 'this is a string', number = 3, arrRange, monthRange, dateRange, yearRange,
        objPick = { a: 1, b:2, c:3, d:4, e:5 }, objPickStr = JSON.stringify(objPick),
        objPluck = [{ a: 1, b:2, c:3, d:4, e:5 }, { a: 11, b:12, c:13, d:14, e:15 }], objPluckStr = JSON.stringify(objPluck),
        func1 = () => {}, func1Str = func1.toString(), func2 = ()=> 1, func2Str = func2.toString(),
        obj = {foo: 'bar' ,bas: ()=> 'aaa'}, objStr = JSON.stringify(obj),
        objRecursion = {foo: { bar: 'bas'}}, objRecursionStr = JSON.stringify(objRecursion),
        objDotExpression = {foo: { bar: { bas: 'dot'}}}, objDotExpressionStr = JSON.stringify(objDotExpression),
        objParent = {a:1}, objParentStr = JSON.stringify(objParent),objChildren,
        arr= ['aa', 134 , () =>{return 2;}], arrStr = JSON.stringify(arr), arrChunked,
        objUnflatten, objUnflattenStr, objFlatten, objFlattenStr,
        thunkify_executed_value = 3, fn_to_thunk = (num1, num2, callback)=>{setTimeout(()=>{callback(null, num1 + num2)}, 1000)}, fn_to_thunk_str = fn_to_thunk.toString();

    describe(`test function <isString>`, () => {

        it(`'${str}' expect to be a string`, () => {
            expect(isString(str)).to.be.ok;
        });
        it(`${number} expect to be not a string`, () => {
            expect(isString(number)).to.be.not.ok;
        });

        it( `let obj = ${objStr}, obj expect to be not a string`, () => {
            expect(isString(obj)).to.be.not.ok;
        });

        it(`obj.foo expect to be a string`, () => {
            expect(isString(obj.foo)).to.be.ok;
        });

        it(`let arr = ${arrStr}, arr expect to be not a string`, () => {
            expect(isString(arr)).to.be.not.ok;
        });

        it(`arr[0] expect to be a string`, () => {
            expect(isString(arr[0])).to.be.ok;
        });

        it(`null expect to be not a string`, () => {
            expect(isString(null)).to.be.not.ok;
        });

        it(`undefined expect to be not a string`, () => {
            expect(isString(undefined)).to.be.not.ok;
        });
    });

    describe(`test function <isObject>`, () => {
        it(`'${str}' expect to be not a object`, () => {
            expect(isObject(str)).to.be.not.ok;
        });

        it(`${number} expect to be not a object`, () => {
            expect(isObject(number)).to.be.not.ok;
        });

        it( `let obj = ${objStr}, obj expect to be a object`, () => {
            expect(isObject(obj)).to.be.ok;
        });

        it(`obj.foo expect to be not a object`, () => {
            expect(isObject(obj.foo)).to.be.not.ok;
        });

        it(`let arr = ${arrStr}, arr expect to be a object`, () => {
            expect(isObject(arr)).to.be.ok;
        });

        it(`arr[0] expect to be not a object`, () => {
            expect(isObject(arr[0])).to.be.not.ok;
        });

        it(`null expect to be a not object`, () => {
            expect(isObject(null)).to.be.not.ok;
        });

        it(`undefined expect to be not a object`, () => {
            expect(isObject(undefined)).to.be.not.ok;
        });
    });

    describe(`test function <isFunction>`, () => {
        it(`'${str}' expect to be not a function`, () => {
            expect(isFunction(str)).to.be.not.ok;
        });

        it(`${number} expect to be not a function`, () => {
            expect(isFunction(number)).to.be.not.ok;
        });

        it( `let func1 = ${func1Str}, func1 expect to be a function`, () => {
            expect(isFunction(func1)).to.be.ok;
        });

        it( `let func2 = ${func2Str}, func1 expect to be a function`, () => {
            expect(isFunction(func2)).to.be.ok;
        });

        it(`obj.bas expect to be a function`, () => {
            expect(isObject(obj.bas)).to.be.ok;
        });

        it(`arr[2] expect to be a function`, () => {
            expect(isObject(arr[2])).to.be.ok;
        });

        it(`null expect to be a not function`, () => {
            expect(isFunction(null)).to.be.not.ok;
        });

        it(`undefined expect to be not a function`, () => {
            expect(isFunction(undefined)).to.be.not.ok;
        });
    });


    describe(`test function <pick>`, () => {
        it( `let objPick = ${objPickStr}, pick(objPick, 'a','e') expect to be {a:1, e:5}`, () => {
            let retPick = pick(objPick, 'a','e');
            expect(Object.keys(retPick).length).to.be.equal(2);
            expect(retPick['a']).to.be.equal(1);
            expect(retPick['e']).to.be.equal(5);
        });

        it( `let objPluck = ${objPluckStr}, pick(objPluck, 'a','e') expect to be [{a:1, e:5}, {a:11, e:15}]`, () => {
            let retPluck = pick(objPluck, 'a','e');
            expect(retPluck.length).to.be.equal(2);
            expect(retPluck[0]['a']).to.be.equal(1);
            expect(retPluck[0]['e']).to.be.equal(5);
            expect(retPluck[1]['a']).to.be.equal(11);
            expect(retPluck[1]['e']).to.be.equal(15);
        });
    });

    describe(`test function <pluck>`, () => {
        it( `let objPluck = ${objPluckStr}, pluck(objPluck, 'e') expect to be [5, 15]`, () => {
            let retPluck = pluck(objPluck, 'e');
            expect(retPluck.length).to.be.equal(2);
            expect(retPluck[0]).to.be.equal(5);
            expect(retPluck[1]).to.be.equal(15);
        });
    });

    describe(`test function <values>`, () => {
        it( `let objValue = ${objPickStr}, values(objPick) expect to be [1,2,3,4,5]`, () => {
            expect(values(objPick).join()).to.be.equal('1,2,3,4,5');
        });
    });

    describe(`test function <range>`, () => {
        it( `let arrRange = range(5), arrRange expect to be [0,1,2,3,4]`, () => {
            arrRange = range(5);
            expect(arrRange.length).to.be.equal(5);
            expect(arrRange.join()).to.be.equal('0,1,2,3,4');
        });
        it( `let arrRange = range(1,6), arrRange expect to be [1,2,3,4,5]`, () => {
            arrRange = range(1, 6);
            expect(arrRange.length).to.be.equal(5);
            expect(arrRange.join()).to.be.equal('1,2,3,4,5');
        });

        it( `let arrRange = range(1,6,2), arrRange expect to be [1,3,5]`, () => {
            arrRange = range(1, 6, 2);
            expect(arrRange.length).to.be.equal(3);
            expect(arrRange.join()).to.be.equal('1,3,5');
        });
    });

    describe(`test function <rangeDateAsMonth>`, () => {
        it( `let monthRange = rangeDateAsMonth('2017-05-02 00:00:00', '2017-06-23 00:00:00', 'YYYYMM'), arrRange expect to be ['201705','201706']`, () => {
            monthRange = rangeDateAsMonth('2017-05-02 00:00:00', '2017-06-23 00:00:00', 'YYYYMM');
            expect(monthRange.length).to.be.equal(2);
            expect(monthRange.join()).to.be.equal('201705,201706');
        });
    });

    describe(`test function <rangeDateAsYear>`, () => {
        it( `let yearRange = rangeDateAsYear('2017-05-02 00:00:00', '2018-06-23 00:00:00'), arrRange expect to be ['2017', '2018']`, () => {
            yearRange = rangeDateAsYear('2017-05-02 00:00:00', '2018-06-23 00:00:00');
            expect(yearRange.length).to.be.equal(2);
            expect(yearRange.join()).to.be.equal('2017,2018');
        });
    });

    describe(`test function <rangeDateAsDay>`, () => {
        it( `let monthRange = rangeDateAsDay('2017-05-02 00:00:00', '2017-05-05 00:00:00'), arrRange expect to be ['2017-05-02', '2017-05-03', '2017-05-04', '2017-05-05']`, () => {
            dateRange = rangeDateAsDay('2017-05-02 00:00:00', '2017-05-05 00:00:00');
            expect(dateRange.length).to.be.equal(4);
            expect(dateRange.join()).to.be.equal('2017-05-02,2017-05-03,2017-05-04,2017-05-05');
        });
    });

    describe(`test function <setProperty>`, () => {
        it( `let obj = ${objStr}, setProperty(obj, 'newKey', 'value'), obj['newKey'] expect to be undefined`, () => {
            setProperty(obj, 'newKey', 'value');
            expect(obj['newKey']).to.be.equal(undefined);
        });
        it( `let obj = ${objStr}, obj.setProperty('foo', 'value'), obj['foo'] expect to be 'value'`, () => {
            setProperty(obj, 'foo', 'value');
            expect(obj['foo']).to.be.equal('value');
            setProperty(obj, 'foo', 'bar'); //restored
        });
    });

    describe(`test function <setPropertyRecursion>`, () => {
        it( `let objRecursion = ${objRecursionStr}, setPropertyRecursion(objRecursion, 'bar', 'value'), objRecursion['foo']['bar'] expect to be 'value'`, () => {
            setPropertyRecursion(objRecursion, 'bar', 'value');
            expect(objRecursion['foo']['bar']).to.be.equal('value');
            objRecursion['foo']['bar'] = 'bas'; //restored
        });
    });

    describe(`test function <setPropertyDotExpression>`, () => {
        it( `let objDotExpression = ${objDotExpressionStr}, setPropertyDotExpression(objDotExpression, 'foo.bar.bas', 'value'), objDotExpression['foo']['bar']['bas'] expect to be 'value'`, () => {
            setPropertyDotExpression(objDotExpression, 'foo.bar.bas', 'value');
            expect(objDotExpression['foo']['bar']['bas']).to.be.equal('value');
            objDotExpression['foo']['bar']['bas'] = 'dot'; //restored
        });
    });

    describe(`test function <getPropertyCount>`, () => {
        it( `let objParent = ${objParentStr}, objChildren = Object.create(objParent), getPropertyCount(objChildren) expect to be 0`, () => {
            objChildren = Object.create(objParent);
            expect(getPropertyCount(objChildren)).to.be.equal(0);
        });
        it( `objChildren['b'] = 'value', getPropertyCount(objChildren) expect to be 1`, () => {
            objChildren['b'] = 'value';
            expect(getPropertyCount(objChildren)).to.be.equal(1);
        });
    });

    describe(`test function <randomN>`, () => {
        it(`The randomN(6) expect to be not equal randomN(6)`, () => {
            expect(randomN(6)).to.be.not.equal(randomN(6));
        });
    });

    describe(`test function <randomS>`, () => {
        it(`The randomS(12) expect to be not equal randomS(12)`, () => {
            expect(randomS(6)).to.be.not.equal(randomS(6));
        });
    });

    describe(`test function <readDirectoryStructure>`, () => {
        it("readDirectoryStructure to.be.not.empty", function(done) {
            readDirectoryStructure(__dirname + '/../', { exts: ['.js', '.json'], excludeDirs: ['node_modules', '.git']})
            .then(function(ret) {
                expect(ret).to.be.not.empty;
                done();
            });
        });
    });

    describe(`test function <chunkArrayByCapacity>`, () => {
        it(`[0,1,2,3,4,5,6,7,8,9] split arrays with each had 4 capacity at most, expect to be chunk to [0,1,2,3],  [4,5,6,7] ,  [8,9]`, () => {
            arrRange = range(10);
            arrChunked = chunkArrayByCapacity(arrRange, 4);
            expect(arrChunked[0].join()).to.be.equal('0,1,2,3');
            expect(arrChunked[1].join()).to.be.equal('4,5,6,7');
            expect(arrChunked[2].join()).to.be.equal('8,9');
        });
    });

    describe(`test function <chunkArrayByQuantity>`, () => {
        it(`[0,1,2,3,4,5,6,7,8,9] split to 4 arrays,  expect to be chunk to [0,1,2],  [3,4,5] ,  [6,7,8] ,[9]`, () => {
            arrRange = range(10);
            arrChunked = chunkArrayByQuantity(arrRange, 4);
            expect(arrChunked[0].join()).to.be.equal('0,1,2');
            expect(arrChunked[1].join()).to.be.equal('3,4,5');
            expect(arrChunked[2].join()).to.be.equal('6,7,8');
            expect(arrChunked[3].join()).to.be.equal('9');
        });
        it(`[0,1,2,3,4,5,6,7,8,9] split to 3 arrays, expect to be chunk to [0,1,2,3],  [4,5,6,7] ,  [8,9]`, () => {
            arrRange = range(10);
            arrChunked = chunkArrayByQuantity(arrRange, 3);
            expect(arrChunked[0].join()).to.be.equal('0,1,2,3');
            expect(arrChunked[1].join()).to.be.equal('4,5,6,7');
            expect(arrChunked[2].join()).to.be.equal('8,9');
        });
    });

    describe(`test function <flatten>`, () => {
        objUnflatten = { a: { foo: "foo", bar: "bar"}, b: {bas: "bas", cet: "cet"} };
        objUnflattenStr =  JSON.stringify((objUnflatten));
        it( `let objUnflatten = ${objUnflattenStr}, flatten(objUnflatten) expect { "a.foo": "foo", "a.bar": "bar", "b.bas": "bas", "b.cet": "cet" }`, () => {
            objFlatten = flatten(objUnflatten);
            let keys = Object.keys(objFlatten);
            expect(keys.join()).to.be.equal('a.foo,a.bar,b.bas,b.cet');
            expect(objFlatten['a.foo']).to.be.equal('foo');
            expect(objFlatten['a.bar']).to.be.equal('bar');
            expect(objFlatten['b.bas']).to.be.equal('bas');
            expect(objFlatten['b.cet']).to.be.equal('cet');
        });
    });

    describe(`test function <unflatten>`, () => {
        objFlatten = { "a.foo": "foo", "a.bar": "bar", "b.bas": "bas", "b.cet": "cet" };
        objFlattenStr =  JSON.stringify((objFlatten));
        it( `let objFlatten = ${objFlattenStr}, unflatten(objFlatten) expect { a: { foo: "foo", bar: "bar"}, b: {bas: "bas", cet: "cet"} }`, () => {
            objUnflatten = unflatten(objFlatten);
            let keys = Object.keys(objUnflatten);
            expect(keys.join()).to.be.equal('a,b');
            expect(objUnflatten.a.foo).to.be.equal('foo');
            expect(objUnflatten.a.bar).to.be.equal('bar');
            expect(objUnflatten.b.bas).to.be.equal('bas');
            expect(objUnflatten.b.cet).to.be.equal('cet');
        });
    });

    describe(`test function <isPhone>`, () => {
        it(`The isPhone('13958009802') should be ok`, () => {
            expect(isPhone('13958009802')).to.be.ok;
        });
    });

    describe(`test function <isIDNo>`, () => {
        it(`The isIDNo('330104191612181028') should be ok`, () => {
            expect(isIDNo('330104191612181028')).to.be.ok;
        });
    });

    describe(`test function <sexFromIDNo>`, () => {
        it(`The sexFromIDNo('330104191612181028') should be 'F' `, () => {
            expect(sexFromIDNo('330104191612181028')).to.be.equal('F');
        });
    });

    describe(`test function <birthdayFromIDNo>`, () => {
        it(`The birthdayFromIDNo('330104191612181028') should be '1916-12-18' `, () => {
            expect(birthdayFromIDNo('330104191612181028')).to.be.equal('1916-12-18');
        });
    });

    describe(`test function <thunk2Func>`, () => {
        it(`After thunk2Func(${fn_to_thunk_str})(1, 2) executed, thunkify_executed_value should be equal thunkify_executed_value`, function(done) {
            thunk2Func(fn_to_thunk)(1, 2)((err, newValue)=>{
                expect(newValue).to.be.equal(thunkify_executed_value);
                done();
            });
        });
    });

    describe(`test function <thunk2Promise>`, () => {
        it(`After thunk2Promise(${fn_to_thunk_str})(1, 2) executed, thunkify_executed_value should be equal thunkify_executed_value`, function(done) {
            thunk2Promise(fn_to_thunk)(1, 2)
                .then(function (newValue) {
                    expect(newValue).to.be.equal(thunkify_executed_value);
                    done();
                }).catch((err)=>{console.log(err);});
        });
    });

    describe(`test function <env>`, () => {
        it(`The env() should be 'test' `, () => {
            expect(env()).to.be.equal('test');
        });
    });

    describe(`test function <isProduction>`, () => {
        it(`The isProduction() should be false `, () => {
            expect(isProduction()).to.be.not.ok;
        });
    });
});
