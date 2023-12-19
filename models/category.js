const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 500 },
  image: { type: String, required: true, maxLength: 500 },
});

// Virtual for category URL
CategorySchema.virtual("url").get(function () {
  return `/inventory/category/${this._id}`;
});

// Export model
module.exports = mongoose.model("Category", CategorySchema);
