// This is a Controller mixin to add methods for generating Swagger data.

// __Dependencies__
var mongoose = require('mongoose');
var AbstractSchemaGenerator = require('./AbstractSchemaGenerator');

// __Private Members__


// __Module Definition__
var JsonSchemaGenerator = module.exports = function () {
};

JsonSchemaGenerator.prototype = new AbstractSchemaGenerator();

// A method used to generate a Swagger model definition for a controller
JsonSchemaGenerator.prototype.generate = function (schema) {

    var definition = {};
    definition.properties = this.generateProperties(schema);
    return definition;
}



// A method used to generate a Swagger model definition for a controller
JsonSchemaGenerator.prototype.generateSchema = function (schema) {
    if (schema.paths) {
        var definition = {};
        definition.properties = this.generateProperties(schema);
        return definition;
    } else {
        return this.generateProperty(schema);
    }

}




JsonSchemaGenerator.prototype.generateProperty = function (path, schema) {
    var property = {};
    //var select = controller.get('select');
    var method = "generate" + this.swaggerTypeFor(path.options.type).type;
    if (typeof this[method] === "function") {
        var property = this[method](path, schema);
    } else {
        // throw new Error("cannot handle type " + path.options.type);
        return undefined;
    }


    return property;
};

JsonSchemaGenerator.prototype.generateProperties = function (schema) {
    var properties = {};
    Object.keys(schema.paths).forEach(function (name) {

        if (!this.getEmbeddedName(name) && this.isIncluded(name, schema.paths[name].options)) {
            var property = this.generateProperty(schema.paths[name], schema);
            properties[name] = property;


        }
    }, this);

    var embeddeds = this.findEmbeddeds(schema);
    for (var key in embeddeds) {
        var property = this.generateEmbedded(embeddeds[key]);
        if (property) {
            properties[key] = property;
        }
    }

    // also called for mebedded
    if (schema.options && schema.options.versionKey) {
        properties[schema.options.versionKey] = {type: "double", required: false}
    }

    return properties;
};

JsonSchemaGenerator.prototype.generateString = function (path, schema) {
    var property = {};
    this.setGeneralProperties(property, path);
    property.type = "string";
    if (path.options.enum) {
        property.enum = path.options.enum;
    }
    return property;
}

JsonSchemaGenerator.prototype.generateDate = function (path, schema) {
    var property = {};
    this.setGeneralProperties(property, path);
    property.type = "date";
    return property;
}

JsonSchemaGenerator.prototype.generateBoolean = function (path, schema) {
    var property = {};
    this.setGeneralProperties(property, path);
    property.type = "boolean";
    return property;
}

JsonSchemaGenerator.prototype.generateDouble = function (path, schema) {
    var property = {};
    this.setGeneralProperties(property, path);
    property.type = "double";
    if (path.options.min) {
        property.min = path.options.min;
    }
    if (path.options.max) {
        property.min = path.options.max;
    }
    return property;
}

JsonSchemaGenerator.prototype.generateDate = function (path, schema) {
    var property = {};
    this.setGeneralProperties(property, path);
    property.type = "date";
    return property;
}

JsonSchemaGenerator.prototype.generateArray = function (path, schema) {
    var property = {};
    this.setGeneralProperties(property, path);
    property.type = "array";
    var method = "generateType" + this.swaggerTypeFor(path.options.type[0]).type;
    if (typeof this[method] === "function") {
        property.items = this[method](path.options.type[0]);
    }
    return property;
}

JsonSchemaGenerator.prototype.generateObject = function (path, schema) {
    var property = {type: "object"};
    this.setGeneralProperties(property, path);
    // an object of propertiey
    property.type = this.generateSchema(path.options.type[0]);
    return property;
}

JsonSchemaGenerator.prototype.generateEmbedded = function (embedded) {
    var property = {type: "object"};
    var required = false;
    var schema = {paths: {}, options: {}};
    embedded.forEach(function (path) {
        if (path.options.required === true) {
            required = true;
        }
        schema.paths[path.path] = path;
    });
    property.required = required;
    property.type = "object";
    // todo move this to another method
    property.properties = this.generateProperties(schema);
    return property;
}

JsonSchemaGenerator.prototype.generateObjectId = function (path, schema) {
    var property = {};
    if (path.options.ref) {
        this.setGeneralProperties(property, path);
        // an object of propertiey
        property.type = "string";
    } else {
        this.setGeneralProperties(property, path);
        // an object of propertiey
        property.type = "string";
    }
    return property;
}

JsonSchemaGenerator.prototype.generateTypeObjectId = function (type) {
    return {type: "string"};
}

JsonSchemaGenerator.prototype.generateTypeString = function (type) {
    return {type: "string"};
}

JsonSchemaGenerator.prototype.generateTypeEmbedded = function (type) {
    var schema = this.generate(type);
    schema.type = "object";
    return schema;
}

JsonSchemaGenerator.prototype.setGeneralProperties = function (property, path) {
    property.required = path.options.required === true;
}



