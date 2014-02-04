var expect = require('expect.js');
var Schema = require('mongoose').Schema;
var Vegetable = require("./fixtures.js");
var SchemaGenerator = require('../GformSchemaGenerator.js');

var generator = new SchemaGenerator();


describe('GformSchemaGenerator', function () {


    it('should generate string prop correctly', function (done) {
        var attribute = generator.generateString("name", Vegetable.paths["name"]);
        expect(attribute).to.have.property("type", "string");
        done();
    });
    it('should generate string prop correctly', function (done) {
        var attribute = generator.generateString("lastname", Vegetable.paths["lastname"]);
        expect(attribute).to.have.property("type", "string");
        expect(attribute).to.have.property("code", "lastname");
        done();
    });
    it('should generate string prop correctly', function (done) {
        var attribute = generator.generateString("label", Vegetable.paths["label"]);
        expect(attribute).to.have.property("type", "string");
        expect(attribute.values[0]).to.be("my");
        done();
    });
    it('should generate array of string prop correctly', function (done) {
        var attribute = generator.generateArray("nicknames", Vegetable.paths["nicknames"]);
        expect(attribute).to.have.property("type", "array");
        expect(attribute.element).to.have.property("type", "string");
        done();
    });
    it('should generate array of string prop correctly 2', function (done) {
        var attribute = generator.generateArray("moreNicknames", Vegetable.paths["moreNicknames"]);
        expect(attribute).to.have.property("type", "array");
        expect(attribute.element).to.have.property("type", "string");
        expect(attribute.element).to.have.property("pattern", "/^a/");
        done();
    });
    it('should generate array of objects prop correctly', function (done) {
        var attribute = generator.generateArray("berries", Vegetable.paths["berries"]);
        expect(attribute).to.have.property("type", "array");
        expect(attribute.group.attributes[0]).to.have.property("code", "name");
        done();
    });
    it('should generate array of refs correctly', function (done) {
        var attribute = generator.generateArray("many", Vegetable.paths["many"]);
        expect(attribute).to.have.property("type", "array");
        expect(attribute.element).to.have.property("type", "ref");
        expect(attribute.element).to.have.property("url");
        done();
    });
    it('should generate ObjectId prop correctly', function (done) {
        var attribute = generator.generateObjectId("related", Vegetable.paths["related"]);
        expect(attribute).to.have.property("type", "ref");
        expect(attribute).to.have.property("url", "vegetable");
        expect(attribute).to.have.property("idProperty", "_id");
        expect(attribute).to.have.property("schemaUrl", "vegetable");
        done();
    });
    it('should find embeddeds', function (done) {
        var embeddeds = generator.findEmbeddeds(Vegetable);
        expect(embeddeds.embedded.length).to.be(2);
        expect(embeddeds.embedded[0]).to.have.property("path", "x");
        done();
    });
    it('should generate a Schema correctly', function (done) {
        var schema = generator.generate(Vegetable);
        var id = schema.attributes.filter(function (a) {
            return a.code == "_id"
        })[0];
        expect(id).to.not.have.property("ref");
        var embedded = schema.attributes.filter(function (a) {
            return a.code == "embedded"
        })[0];
        expect(embedded.group.attributes[0]).to.have.property("code", "x");
        expect(Object.keys(schema.attributes).length).to.be(12);
        done();
    });
});