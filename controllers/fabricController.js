const Fabric = require("../models/fabric");
const Bag = require("../models/bag");
const asyncHandler = require("express-async-handler");

// Display list of all Fabrics.
exports.fabric_list = asyncHandler(async (req, res, next) => {
  const allFabrics = await Fabric.find({}, "name description image").exec();

  res.render("fabric_list", {
    title: "Fabric List",
    fabric_list: allFabrics,
  });
});

// Display detail page for a specific Fabric.
exports.fabric_detail = asyncHandler(async (req, res, next) => {
  // Get details of fabrics and all associated bags (in parallel)
  const [fabric, bagsWithFabric] = await Promise.all([
    Fabric.findById(req.params.id).exec(),
    Bag.find({ fabric: req.params.id }, "name price").sort({ price: 1 }).exec(),
  ]);
  if (fabric === null) {
    // No results.
    const err = new Error("Fabric not found");
    err.status = 404;
    return next(err);
  }

  res.render("fabric_detail", {
    title: "Fabric Detail",
    fabric: fabric,
    fabric_bags: bagsWithFabric,
  });
});

// Display Fabric create form on GET.
exports.fabric_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Fabric create GET");
});

// Handle Fabric create on POST.
exports.fabric_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Fabric create POST");
});

// Display Fabric delete form on GET.
exports.fabric_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Fabric delete GET");
});

// Handle Fabric delete on POST.
exports.fabric_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Fabric delete POST");
});

// Display Fabric update form on GET.
exports.fabric_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Fabric update GET");
});

// Handle Fabric update on POST.
exports.fabric_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Fabric update POST");
});
