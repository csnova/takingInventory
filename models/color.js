const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ColorSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  image: { type: String, required: true, maxLength: 500 },
});

// Virtual for color URL
ColorSchema.virtual("url").get(function () {
  return `/inventory/color/${this._id}`;
});

// Virtual for color image location
ColorSchema.virtual("imageLocation").get(function () {
  let imageLocation = this.image;
  imageLocation = imageLocation.slice(8);
  return imageLocation;
});

// Export model
module.exports = mongoose.model("Color", ColorSchema);
