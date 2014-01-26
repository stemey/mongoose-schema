// __Module Definition__
var BaucisPropertyFilter = module.exports = function (controller) {
    this.controller = controller;
};

BaucisPropertyFilter.prototype.isIncluded = function (name, options) {
    var select = this.controller.get("select");
    var mode = select && (select.match(/\b[-]/g) ? 'exclusive' : 'inclusive');
    var exclusiveNamePattern = new RegExp('\\B-' + name + '\\b', 'gi');
    var inclusiveNamePattern = new RegExp('(?:\\B[+]|\\b)' + name + '\\b', 'gi');

    // If it's excluded, skip this one
    if (mode === 'exclusive' && select.match(exclusiveNamePattern)) return false;
    // If the mode is inclusive but the name is not present, skip this one
    if (mode === 'inclusive' && name !== '_id' && !select.match(inclusiveNamePattern)) return false;
    return true;
}

