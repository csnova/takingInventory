const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FabricSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 500 },
  image: { type: String, required: true, maxLength: 500 },
});

// Virtual for fabrics URL
FabricSchema.virtual("url").get(function () {
  return `/inventory/fabric/${this._id}`;
});

// Virtual for fabric image location
FabricSchema.virtual("imageLocation").get(function () {
  let imageLocation = this.image;
  imageLocation = imageLocation.slice(8);
  return imageLocation;
});

// Export model
module.exports = mongoose.model("Fabric", FabricSchema);
