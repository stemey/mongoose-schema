var Schema = require('mongoose').Schema;

var Berry = new Schema({
    name: { type: String, required: true },
    notSelected: {type: String, select: false}
}, {_id: false});

var Vegetable = new Schema({
    name: { type: String, required: true },
    lastname: String,
    great: Boolean,
    date: Date,
    label: {type: String, enum: ["my", "your"]},
    nicknames: [String],
    moreNicknames: [
        {type: "String", match: /^a/}
    ],
    berries: [Berry],
    many: [
        { type: Schema.ObjectId, ref: 'vegetable' }
    ],
    embedded: {
        x: String,
        y: String
    },
    related: { type: Schema.ObjectId, ref: 'vegetable' }
});

module.exports = Vegetable;