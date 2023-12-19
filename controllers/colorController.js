const Color = require("../models/color");
const Bag = require("../models/bag");
const asyncHandler = require("express-async-handler");

// Display list of all Colors.
exports.color_list = asyncHandler(async (req, res, next) => {
  const allColors = await Color.find({}, "name image")
    .sort({ index: 1 })
    .exec();

  res.render("color_list", {
    title: "Color List",
    color_list: allColors,
  });
});

// Display detail page for a specific Color.
exports.color_detail = asyncHandler(async (req, res, next) => {
  // Get details of the colors and all associated bags (in parallel)
  const [color, bagsWithColor] = await Promise.all([
    Color.findById(req.params.id).exec(),
    Bag.find({ color: req.params.id }, "name price").sort({ price: 1 }).exec(),
  ]);
  if (color === null) {
    // No results.
    const err = new Error("Fabric not found");
    err.status = 404;
    return next(err);
  }

  res.render("color_detail", {
    title: "Color Detail",
    color: color,
    color_bags: bagsWithColor,
  });
});

// Display Color create form on GET.
exports.color_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Color create GET");
});

// Handle Color create on POST.
exports.color_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Color create POST");
});

// Display Color delete form on GET.
exports.color_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Color delete GET");
});

// Handle Color delete on POST.
exports.color_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Color delete POST");
});

// Display Color update form on GET.
exports.color_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Color update GET");
});

// Handle Color update on POST.
exports.color_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Color update POST");
});
