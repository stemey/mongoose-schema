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
    var method = "generate" + this.swaggerTypeFor(path.options.type);
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


            // Configure the property
            /*property.required = path.options.required;
             property.type = type;

             // Set enum values if applicable
             if (path.enumValues && path.enumValues.length > 0) {
             property.allowableValues = { valueType: 'LIST', values: path.enumValues };
             }

             // Set allowable values range if min or max is present
             if (!isNaN(path.options.min) || !isNaN(path.options.max)) {
             property.allowableValues = { valueType: 'RANGE' };
             }

             if (!isNaN(path.options.min)) {
             property.allowableValues.min = path.options.min;
             }

             if (!isNaN(path.options.max)) {
             property.allowableValues.max = path.options.max;
             }

             if (!property.type) {
             console.log('Warning: That field type is not yet supported in baucis Swagger definitions, using "string."');
             console.log('Path name: %s.%s', definition.id, name);
             console.log('Mongoose type: %s', path.options.type);
             property.type = 'string';
             }*/

            //definition.properties[name] = property;
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
    if (path.options.enumValues) {
        property.enum = path.options.enumValues;
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
    var method = "generateType" + this.swaggerTypeFor(path.options.type[0]);
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
        property.url = path.options.ref;
        property.type = "ref";
        property.schemaUrl = path.options.ref;
        property.idProperty = "_id";
    } else {
        this.setGeneralProperties(property, path);
        // an object of propertiey
        property.type = "string";
    }
    return property;
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



