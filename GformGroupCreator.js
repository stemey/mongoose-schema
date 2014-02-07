// __Module Definition__
var GformWalker = module.exports = function () {
};


// A method used to generate a Swagger model definition for a controller
GformCreator.prototype.transform = function (visitor, schema) {
    var builder = new Builder(schema);
    visitor.visitSchema(schema, builder);
    return builder.create();

}


GformCreator.prototype.createAttributeCascade = function (attribute) {
    var me = this;
    if (attribute.group) {
        cascade = function (visitor) {
            visitor.visitSchema(group);
        }
    } else {
        cascade = function (visitor) {
            groups.forEach(function (group) {
                visitor.visitSchema(groups);
            });
        }

    }

}

GformCreator.prototype.createSchemaCascade = function (schema) {
    var cascade = function (visitor) {
        schema.attributes.forEach(function (attribute) {
            var c = me.createCascade(attribute);
            visitor.visitAttribute(attribute, cascade);
        });
    }
    return cascade;

}

var GformBuilder = function () {
};


// A method used to generate a Swagger model definition for a controller
GformBuilder.prototype.define = function (props) {
    var newSchema=Object.clone(schema);
    Object.keys(props).forEach(function(key){
       newSchema[key]=props[key];
    });



}


GformCreator.prototype.addGroup = function (props) {


}

GformCreator.prototype.createSchemaCascade = function (schema) {
    var cascade = function (visitor) {
        schema.attributes.forEach(function (attribute) {
            var c = me.createCascade(attribute);
            visitor.visitAttribute(attribute, cascade);
        });
    }
    return cascade;

}




