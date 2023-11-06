const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TeaSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    numberInStock: { type: Number, required: true, min: 0 },
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

TeaSchema.virtual("url").get(function () {
    return `/tea/${this.name}`;
});

module.exports = mongoose.model("Tea", TeaSchema);
