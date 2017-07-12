/**
 * Created by zppro on 17-6-23.
 */
import { expect } from 'chai';
import { join } from 'path'
import dictBuilder from '../src/lib/dictBuilder'

describe('module [dictBuilder]', () => {
    let d1 = dictBuilder(), slot1='slot1', slot2='slot2', slot3='slot3',
    slot4='slot4', slot5='slot5', slot6='slot6', slot7='slot7', slot8='slot8';

    it( `test dict add value = "v1,v2" `, () => {
        d1.add(slot1,`v1,v2`);
        expect(d1.keys[slot1][0]).to.be.equal(d1.vals[slot1][0]);
        expect(d1.vals[slot1][0]).to.be.equal('v1');
        expect(d1.keys[slot1][1]).to.be.equal(d1.vals[slot1][1]);
        expect(d1.vals[slot1][1]).to.be.equal('v2');
    });

    it( `test dict add value = "k1=v1,k2=v2" `, () => {
        d1.add(slot2,`k1=v1,k2=v2`);
        expect(d1.keys[slot2][0]).to.be.equal('k1');
        expect(d1.vals[slot2][0]).to.be.equal('v1');
        expect(d1.keys[slot2][1]).to.be.equal('k2');
        expect(d1.vals[slot2][1]).to.be.equal('v2');
    });

    it( `test dict add value = "k1:v1,k2:v2" `, () => {
        d1.add(slot3,`k1:v1,k2:v2`);
        expect(d1.keys[slot3][0]).to.be.equal('k1');
        expect(d1.vals[slot3][0]).to.be.equal('v1');
        expect(d1.keys[slot3][1]).to.be.equal('k2');
        expect(d1.vals[slot3][1]).to.be.equal('v2');
    });

    it( `test dict add value = {"k1":"v1","k2":"v2"} `, () => {
        d1.add(slot4, {"k1":"v1","k2":"v2"});
        expect(d1.keys[slot4][0]).to.be.equal('k1');
        expect(d1.vals[slot4][0]).to.be.equal('v1');
        expect(d1.keys[slot4][1]).to.be.equal('k2');
        expect(d1.vals[slot4][1]).to.be.equal('v2');
    });

    it( `test dict add value = ["v1","v2"] `, () => {
        d1.add(slot5, ["v1","v2"]);
        expect(d1.keys[slot5][0]).to.be.equal(d1.vals[slot5][0]);
        expect(d1.vals[slot5][0]).to.be.equal('v1');
        expect(d1.keys[slot5][1]).to.be.equal(d1.vals[slot5][1]);
        expect(d1.vals[slot5][1]).to.be.equal('v2');
    });

    it( `test dict add value = [{k:"k1",v:"v1"},{k:"k2",v:"v2"}] `, () => {
        d1.add(slot6, [{k:"k1",v:"v1"},{k:"k2",v:"v2"}]);
        expect(d1.keys[slot6][0]).to.be.equal('k1');
        expect(d1.vals[slot6][0]).to.be.equal('v1');
        expect(d1.keys[slot6][1]).to.be.equal('k2');
        expect(d1.vals[slot6][1]).to.be.equal('v2');
    });

    it( `test dict add value = [["k1","v1"],["k2","v2"]] `, () => {
        d1.add(slot7, [["k1","v1"],["k2","v2"]]);
        expect(d1.keys[slot7][0]).to.be.equal('k1');
        expect(d1.vals[slot7][0]).to.be.equal('v1');
        expect(d1.keys[slot7][1]).to.be.equal('k2');
        expect(d1.vals[slot7][1]).to.be.equal('v2');
    });

    it( `test dict add value = [{k:"k1",v:{"name":"姓名1","order":1}},{k:"k2",v:{"name":"姓名2","order":2}}] `, () => {
        d1.add(slot8, [{k:"k1",v:{"name":"姓名1","order":1}},{k:"k2",v:{"name":"姓名2","order":2}}]);
        expect(d1.keys[slot8][0]).to.be.equal('k1');
        expect(d1.vals[slot8][0].name).to.be.equal('姓名1');
        expect(d1.vals[slot8][0].order).to.be.equal(1);
        expect(d1.keys[slot8][1]).to.be.equal('k2');
        expect(d1.vals[slot8][1].name).to.be.equal('姓名2');
        expect(d1.vals[slot8][1].order).to.be.equal(2);
    });

    it( `test dict readJson dictionary.json `, (done) => {
        d1.clear();
        let file = join(__dirname, 'dictionary.json');
        d1.readJson(file).then(()=>{
            expect(d1.pairs['IDC00']['name']).to.be.equal('产品类型(带票)');
            expect(d1.pairs['IDC00']['A'].name).to.be.equal('景点');
            expect(d1.pairs['IDC00']['A'].order).to.be.equal(1);
            expect(d1.pairs['IDC00']['B'].name).to.be.equal('线路');
            expect(d1.pairs['IDC00']['B'].order).to.be.equal(2);
            expect(d1.pairs['IDC00']['C'].name).to.be.equal('酒店');
            expect(d1.pairs['IDC00']['C'].order).to.be.equal(3);
            expect(d1.pairs['IDC00']['F'].name).to.be.equal('套票');
            expect(d1.pairs['IDC00']['F'].order).to.be.equal(6);
            expect(d1.pairs['IDC00']['H'].name).to.be.equal('演出');
            expect(d1.pairs['IDC00']['H'].order).to.be.equal(8);
            expect(d1.pairs['IDC00']['I'].name).to.be.equal('未知');
            expect(d1.pairs['IDC00']['I'].order).to.be.equal(10);
            done();
        });

    });
});