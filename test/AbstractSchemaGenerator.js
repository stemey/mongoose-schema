var expect = require('expect.js');
var Schema = require('mongoose').Schema;
var Vegetable = require("./fixtures.js");
var SchemaGenerator = require('../AbstractSchemaGenerator.js');

var generator = new SchemaGenerator();


describe('AbstractSchemaGenerator', function () {


    it('should handle native type correctly', function (done) {
        var type = generator.swaggerTypeFor(String);
        expect(type).to.have.property("type", "String");
        done();
    });
    it('should handle object literal type correctly', function (done) {
        var type = generator.swaggerTypeFor({type: "String"});
        expect(type).to.have.property("type", "String");
        done();
    });
    it('should handle array prop correctly', function (done) {
        var type = generator.swaggerTypeFor([
            {type: "String"}
        ]);
        expect(type).to.have.property("type", "Array");
        done();
    });


});