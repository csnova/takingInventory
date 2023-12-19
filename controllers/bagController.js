const Bag = require("../models/bag");
const Category = require("../models/category");
const Fabric = require("../models/fabric");
const Color = require("../models/color");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of bags, categories, fabrics, adn colors
  const [numBags, numCategories, numFabrics, numColors] = await Promise.all([
    Bag.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
    Fabric.countDocuments({}).exec(),
    Color.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Mushy Plushy Home",
    bag_count: numBags,
    category_count: numCategories,
    fabric_count: numFabrics,
    color_count: numColors,
  });
});

// Display list of all Bags.
exports.bag_list = asyncHandler(async (req, res, next) => {
  const allBags = await Bag.find({}, "name price stock category fabric color")
    .sort({ price: 1 })
    .populate("category")
    .populate("fabric")
    .populate("color")
    .exec();

  res.render("bag_list", { title: "Products List", bag_list: allBags });
});

// Display detail page for a specific Bag.
exports.bag_detail = asyncHandler(async (req, res, next) => {
  // Get details of of this bean bag chair
  const [bag] = await Promise.all([
    Bag.findById(req.params.id)
      .populate("category")
      .populate("fabric")
      .populate("color")
      .exec(),
  ]);
  if (bag === null) {
    // No results.
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }
  res.render("bag_detail", {
    title: "Product Detail",
    bag: bag,
  });
});

// Display Bag create form on GET.
exports.bag_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bag create GET");
});

// Handle Bag create on POST.
exports.bag_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bag create POST");
});

// Display Bag delete form on GET.
exports.bag_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bag delete GET");
});

// Handle Bag delete on POST.
exports.bag_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bag delete POST");
});

// Display Bag update form on GET.
exports.bag_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bag update GET");
});

// Handle Bag update on POST.
exports.bag_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Bag update POST");
});
