var expect = require('expect.js');
var Schema = require('mongoose').Schema;
var SchemaGenerator = require('../GformSchemaGenerator.js');

var generator = new SchemaGenerator();

var Berry = new Schema({
    name: { type: String, required: true },
    notSelected: {type: String, select: false}
}, {_id: false});

var Vegetable = new Schema({
    name: { type: String, required: true },
    lastname: String,
    nicknames: [String],
    berries: [Berry],
    embedded: {
        x: String,
        y: String
    },
    related: { type: Schema.ObjectId, ref: 'vegetable' }
});

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
    it('should generate array of string prop correctly', function (done) {
        var attribute = generator.generateArray("nicknames", Vegetable.paths["nicknames"]);
        expect(attribute).to.have.property("type", "array");
        expect(attribute.element).to.have.property("type", "string");
        done();
    });
    it('should generate array of objects prop correctly', function (done) {
        var attribute = generator.generateArray("berries", Vegetable.paths["berries"]);
        expect(attribute).to.have.property("type", "array");
        expect(attribute.group.attributes[0]).to.have.property("code", "name");
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
        expect(Object.keys(schema.attributes).length).to.be(7);
        done();
    });
});