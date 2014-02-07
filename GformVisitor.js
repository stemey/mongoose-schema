// __Module Definition__
var GformVisitor = module.exports = function () {
};

GformVisitor.prototype.visitSchema = function (schema, builder) {
    console.log("we are currently at " + builder.path);
    var newBuilder = builder.define({editor: "tab"});
    var groupBuilder1 = newBuilder.addGroup({editor: "listpane", label: "1"});
    groupBuilder1.addAttribute(schema.attributes[0]);
    var groupBuilder2 = newBuilder.addGroup({editor: "listpane", label: "2"});
    groupBuilder2.addAttribute(schema.attributes[1]);
}





