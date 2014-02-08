// __Module Definition__
var TabGroupCreator = module.exports = function () {
};

TabGroupCreator.prototype.create = function (schema, conf, attributes) {
    conf = conf || {};
    var groupConf = conf.group || this.createMainGroup(schema, attributes);
    var groups = groupConf.groups || [];
    var groupMap = {};
    groups.forEach(function (group) {
        groupMap[group.code] = group;
    });
    attributes.forEach(function (attribute) {
        var groupCode = this.getGroupCode(attribute);
        var group = groupMap[groupCode];
        if (!group) {
            group = this.createSubGroup(groupCode, schema);
            groupMap[groupCode] = group;
        }
        if (!group.attributes) {
            group.attributes = [];
        }
        group.attributes.push(attribute);
    }, this)
    if (!groupConf.editor) {
        groupConf.editor = "tab";
    }
    groupConf.groups = [];
    Object.keys(groupMap).forEach(function (groupCode) {
        groupConf.groups.push(groupMap[groupCode]);
    })
    if (Object.keys(groupConf.groups).length == 1) {
        return {attributes: attributes};
    } else {
        return groupConf;
    }
}

TabGroupCreator.prototype.getGroupCode = function (attribute) {
    var groupCode = attribute.groupCode || "general";
    return groupCode;
}

TabGroupCreator.prototype.createMainGroup = function (schema, attributes) {
    return {editor: "tab"};
}

TabGroupCreator.prototype.createSubGroup = function (code, schema) {
    return {label: code, code: code};
}

