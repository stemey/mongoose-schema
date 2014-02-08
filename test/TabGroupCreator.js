var expect = require('expect.js');
var TabGroupCreator = require('../groupcreator/TabGroupCreator.js');

var creator = new TabGroupCreator();

var schema = {};
var attributes1 = [
    {code: "f11"},
    {code: "f12"},
    {code: "f13"}
]

var attributes2 = [
    {code: "f21", groupCode: "a"},
    {code: "f22", groupCode: "a"},
    {code: "f23", groupCode: "c"},
    {code: "f13"}
]


describe('TabGroupCreator', function () {


    it('should generate no groups if no group codes', function (done) {
        var schema = creator.create({}, null, attributes1);
        expect(schema).to.not.have.property("editor");
        expect(schema).to.have.property("attributes");
        expect(schema.attributes).to.have.property("length", 3);
        done();
    });

    it('should generate two groups if two group codes', function (done) {
        var schema = creator.create({}, null, attributes2);
        expect(schema).to.have.property("editor", "tab");
        expect(schema).to.have.property("groups");
        expect(schema.groups).to.have.property("length", 3);
        done();
    });

    it('should reuse configured group', function (done) {
        var schema = creator.create({}, {group: {editor: "tab", groups: [
            {editor: "x", code: "a"}
        ]}}, attributes2);
        expect(schema).to.have.property("editor", "tab");
        expect(schema).to.have.property("groups");
        expect(schema.groups[0]).to.have.property("editor", "x");
        expect(schema.groups[0]).to.have.property("code", "a");
        expect(schema.groups[0].attributes).to.have.property("length", 2);
        expect(schema.groups[1]).to.have.property("code", "c");
        expect(schema.groups[2]).to.have.property("code", "general");
        expect(schema.groups).to.have.property("length", 3);
        done();
    });

    it('create a tab as main group', function (done) {
        var group = creator.createMainGroup();
        expect(group).to.have.property("editor", "tab");
        done();
    });
    it('create a simple sub group', function (done) {
        var group = creator.createSubGroup();
        done();
    });

});