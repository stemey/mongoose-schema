var expect = require('expect.js');
var Schema = require('mongoose').Schema;
var Vegetable = require("./fixtures.js");
var SchemaGenerator = require('../JsonSchemaGenerator.js');

var generator = new SchemaGenerator();


describe('JsonSchemaGenerator', function () {


    it('should generate string prop correctly', function (done) {
        var property = generator.generateString(Vegetable.paths["name"]);
        console.log(JSON.stringify(property));
        expect(property).to.have.property("type", "string");
        done();
    });
    it('should generate boolean prop correctly', function (done) {
        var property = generator.generateBoolean(Vegetable.paths["great"]);
        console.log(JSON.stringify(property));
        expect(property).to.have.property("type", "boolean");
        done();
    });
    it('should generate Date prop correctly', function (done) {
        var property = generator.generateDate(Vegetable.paths["date"]);
        console.log(JSON.stringify(property));
        expect(property).to.have.property("type", "date");
        done();
    });
    it('should generate string prop correctly', function (done) {
        var property = generator.generateString(Vegetable.paths["lastname"]);
        console.log(JSON.stringify(property));
        expect(property).to.have.property("type", "string");
        done();
    });
    it('should generate array of string prop correctly', function (done) {
        var property = generator.generateArray(Vegetable.paths["nicknames"]);
        console.log(JSON.stringify(property));
        expect(property).to.have.property("type", "array");
        expect(property.items).to.have.property("type", "string");
        done();
    });
    it('should generate array of string prop correctly (2)', function (done) {
        var property = generator.generateArray(Vegetable.paths["moreNicknames"]);
        console.log(JSON.stringify(property));
        expect(property).to.have.property("type", "array");
        expect(property.items).to.have.property("type", "string");
        done();
    });
    it('should generate array of objects prop correctly', function (done) {
        var property = generator.generateArray(Vegetable.paths["berries"]);
        console.log(JSON.stringify(property));
        expect(property).to.have.property("type", "array");
        expect(property.items.properties.name).to.have.property("type", "string");
        done();
    });
    it('should generate ObjectId prop correctly', function (done) {
        var property = generator.generateObjectId(Vegetable.paths["related"]);
        console.log(JSON.stringify(property));
        expect(property).to.have.property("type", "string");
        done();
    });
    it('should find embeddeds', function (done) {
        var embeddeds = generator.findEmbeddeds(Vegetable);
        expect(embeddeds.embedded.length).to.be(2);
        expect(embeddeds.embedded[0]).to.have.property("path","x");
        done();
    });
   it('should generate a Schema correctly', function (done) {
        var schema = generator.generate(Vegetable);
        console.log(JSON.stringify(schema));
        expect(schema.properties._id).to.have.property("required",false);
       expect(schema.properties.__v).to.have.property("type","double");
        expect(schema.properties.embedded.properties).to.have.property("x");
        expect(Object.keys(schema.properties).length).to.be(13);
        done();
    });
});