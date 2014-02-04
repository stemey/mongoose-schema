// This is a Controller mixin to add methods for generating Swagger data.

// __Dependencies__
var mongoose = require('mongoose');

// __Private Members__


// __Module Definition__
var AbstractSchemaGenerator = module.exports = function () {
};

// A method for capitalizing the first letter of a string
AbstractSchemaGenerator.prototype.capitalize = function (s) {
    if (!s) return s;
    if (s.length === 1) return s.toUpperCase();
    return s[0].toUpperCase() + s.substring(1);
}

// A method used to generate a Swagger model definition for a controller
AbstractSchemaGenerator.prototype.isIncluded = function (name, options) {
    if (options.select === false) {
        return false;
    } else if (this.propertyFilter) {
        return this.propertyFilter.isIncluded(name, options);
    } else {
        return true;
    }

}

AbstractSchemaGenerator.prototype.convertType = function (type) {
    if (typeof type === "string") {
        return type;
    }
    if (type === String) return 'String';
    if (type === Number) return 'Number';
    if (type === Date) return 'Date';
    if (type === Boolean) return 'Boolean';
    if (type === mongoose.Schema.Types.ObjectId) return 'ObjectId';
    if (type === mongoose.Schema.Types.Oid) return 'Oid';
    if (type === Object) return "Embedded";
    if (type instanceof Object && type.type) {
        return this.swaggerTypeFor(type.type);
    }
    if (type instanceof Object) return "Embedded";
    if (type === mongoose.Schema.Types.Mixed) return null;
    if (type === mongoose.Schema.Types.Buffer) return null;
    throw new Error('Unrecognized type: ' + type);
}

// Convert a Mongoose type into a Swagger type
AbstractSchemaGenerator.prototype.swaggerTypeFor = function (type) {
    // type may be a Schema or an object with property type
    if (type === mongoose.Schema.Types.Array || Array.isArray(type)) {
        return {type:'Array'};
    } else if (type.type) {
        type.type = this.convertType(type.type);
        return type;
    } else {
        var fullType = {};
        fullType.type = this.convertType(type);
        return fullType;
    }

};

AbstractSchemaGenerator.prototype.getEmbeddedName = function (name) {
    var embeddedName
    var paths = name.split(".");
    if (paths.length > 1) {
        embeddedName = paths[0];
    }
    return embeddedName;
}


// Convert a Mongoose type into a Swagger type
AbstractSchemaGenerator.prototype.findEmbeddeds = function (schema) {
    var embeddeds = {};
    Object.keys(schema.paths).forEach(function (name) {

        var embeddedName = this.getEmbeddedName(name);
        if (embeddedName) {
            var embedded = embeddeds[embeddedName];
            if (embedded == null) {
                embedded = [];
                embeddeds[embeddedName] = embedded;
            }
            var normalizedPath = {};
            var originalPath = schema.paths[name];
            Object.keys(originalPath).forEach(function (key) {
                normalizedPath[key] = originalPath[key];
            });
            normalizedPath.path = name.substring(embeddedName.length + 1);
            embedded.push(normalizedPath);
        }
    }, this);
    return embeddeds;
}




