// This is a Controller mixin to add methods for generating Swagger data.

// __Dependencies__
var mongoose = require('mongoose');
var AbstractSchemaGenerator = require('./AbstractSchemaGenerator');

// __Private Members__



// __Module Definition__
var GformSchemaGenerator = module.exports = function () {
};

GformSchemaGenerator.prototype = new AbstractSchemaGenerator();


// A method used to generate a Swagger model definition for a controller
GformSchemaGenerator.prototype.generate = function (schema) {

    var definition = {};
    definition.attributes = this.generateAttributes(schema);
    return definition;
}




// A method used to generate a Swagger model definition for a controller
GformSchemaGenerator.prototype.generateSchema = function (schema) {
    if (schema.paths) {
        var definition = {};
        definition.attributes = this.generateAttributes(schema);
        return definition;
    } else {
        return this.generateAttribute(schema);
    }

}


GformSchemaGenerator.prototype.generateAttribute = function (name, path, schema) {
    var attribute = {};
    //var select = controller.get('select');
    var method = "generate" + this.swaggerTypeFor(path.options.type);
    if (typeof this[method] === "function") {
        var attribute = this[method](name, path, schema);
    } else {
        // throw new Error("cannot handle type " + path.options.type);
        return undefined;
    }


    return attribute;
};

GformSchemaGenerator.prototype.generateAttributes = function (schema) {
    var attributes = [];
    Object.keys(schema.paths).forEach(function (name) {
        if (!this.getEmbeddedName(name) && this.isIncluded(name, schema.paths[name].options)) {
            var attribute = this.generateAttribute(name, schema.paths[name], schema);
            attributes.push(attribute);
        }
    }, this);

    var embeddeds = this.findEmbeddeds(schema);
    for (var key in embeddeds) {
        var attribute = this.generateEmbedded(key, embeddeds[key]);
        if (attribute) {
            attributes.push(attribute);
        }
    }

    return attributes;
};

GformSchemaGenerator.prototype.generateString = function (name, path, schema) {
    var attribute = {};
    this.setGeneralProperties(name, attribute, path);
    attribute.type = "string";
    if (path.options.enumValues) {
        attribute.values = path.options.enumValues;
    }
    return attribute;
}

GformSchemaGenerator.prototype.generateDate = function (name, path, schema) {
    var attribute = {};
    this.setGeneralProperties(name, attribute, path);
    attribute.type = "date";
    return attribute;
}

GformSchemaGenerator.prototype.generateBoolean = function (name, path, schema) {
    var attribute = {};
    this.setGeneralProperties(name, attribute, path);
    attribute.type = "boolean";
    return attribute;
}

GformSchemaGenerator.prototype.generateNumber = function (name, path, schema) {
    var attribute = {};
    this.setGeneralProperties(name, attribute, path);
    attribute.type = "number";
    if (path.options.min) {
        attribute.min = path.options.min;
    }
    if (path.options.max) {
        attribute.min = path.options.max;
    }
    return attribute;
}

GformSchemaGenerator.prototype.generateDate = function (name, path, schema) {
    var attribute = {};
    this.setGeneralProperties(name, attribute, path);
    attribute.type = "date";
    return attribute;
}

GformSchemaGenerator.prototype.generateArray = function (name, path, schema) {
    var attribute = {};
    this.setGeneralProperties(name, attribute, path);
    attribute.type = "array";
    var type = path.options.type[0];
    var propertyType = this.swaggerTypeFor(type);
    var method = "generateType" + propertyType;
    if (typeof this[method] === "function") {
        if (propertyType === "Embedded") {
            attribute.group = this[method](path.options.type[0]);
        } else {
            attribute.element = this[method](path.options.type[0]);
        }
    }
    return attribute;
}

GformSchemaGenerator.prototype.generateObject = function (name, path, schema) {
    var attribute = {type: "object"};
    this.setGeneralProperties(name, attribute, path);
    // an object of propertiey
    attribute.type = this.generateSchema(path.options.type[0]);
    return attribute;
}

GformSchemaGenerator.prototype.generateEmbedded = function (name, embedded) {
    var attribute = {};
    var required = false;
    var schema = {paths: {}};
    embedded.forEach(function (path) {
        if (path.options.required === true) {
            required = true;
        }
        schema.paths[path.path] = path;
    });
    attribute.required = required;
    attribute.type = "object";
    attribute.group = {attributes: this.generateAttributes(schema)};
    attribute.code = name;
    return attribute;
}

GformSchemaGenerator.prototype.generateObjectId = function (name, path, schema) {
    var attribute = {};
    this.setGeneralProperties(name, attribute, path);
    if (path.options.ref) {
        attribute.type = "ref";
        attribute.idProperty = "_id";
        if (this.refHelper) {
            this.refHelper.update(attribute, path.options.ref);
        }else {
            attribute.url = path.options.ref;
            attribute.schemaUrl = path.options.ref;
        }
    } else {
        attribute.type = "string";
    }
    return attribute;
}

GformSchemaGenerator.prototype.generateTypeString = function (type) {
    return {type: "string"};
}

GformSchemaGenerator.prototype.generateTypeEmbedded = function (type) {
    var schema = this.generate(type);
    schema.type = "object";
    return schema;
}

GformSchemaGenerator.prototype.setGeneralProperties = function (name, attribute, path) {
    attribute.required = path.options.required;
    attribute.code = name;
}



