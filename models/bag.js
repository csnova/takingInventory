const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BagSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  fabric: { type: Schema.Types.ObjectId, ref: "Fabric", required: true },
  color: { type: Schema.Types.ObjectId, ref: "Color", required: true },
});

// Virtual for Bag's URL
BagSchema.virtual("url").get(function () {
  return `/inventory/bag/${this._id}`;
});

// Export model
module.exports = mongoose.model("Bag", BagSchema);
