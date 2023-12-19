const Bag = require("../models/bag");
const Category = require("../models/category");
const Fabric = require("../models/fabric");
const Color = require("../models/color");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

// Display bag create form on GET.
exports.bag_create_get = asyncHandler(async (req, res, next) => {
  // Get all categories, colors, and fabrics, which we can use for adding to our bag.
  const [allCategories, allFabrics, allColors] = await Promise.all([
    Category.find().sort({ name: 1 }).exec(),
    Fabric.find().sort({ name: 1 }).exec(),
    Color.find().sort({ name: 1 }).exec(),
  ]);

  res.render("bag_form", {
    title: "Create Bag",
    categories: allCategories,
    fabrics: allFabrics,
    colors: allColors,
  });
});

// Handle bag create on POST.
exports.bag_create_post = [
  // Validate and sanitize fields.
  body("name", "Product name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape(),
  body("stock", "Quantity must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape(),
  body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("fabric", "Fabric must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("color", "Fabric must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Bag object with escaped and trimmed data.
    const bag = new Bag({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      fabric: req.body.fabric,
      color: req.body.color,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories, colors, and fabrics, which we can use for adding to our bag.
      const [allCategories, allFabrics, allColors] = await Promise.all([
        Category.find().sort({ name: 1 }).exec(),
        Fabric.find().sort({ name: 1 }).exec(),
        Color.find().sort({ name: 1 }).exec(),
      ]);

      res.render("bag_form", {
        title: "Create Bag",
        categories: allCategories,
        fabrics: allFabrics,
        colors: allColors,
        bag: bag,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save Bag.
      await bag.save();
      res.redirect(bag.url);
    }
  }),
];

// Display Bag delete form on GET.
exports.bag_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of bags
  const [bag] = await Promise.all([Bag.findById(req.params.id).exec()]);

  if (bag === null) {
    // No results.
    res.redirect("/inventory/bags");
  }

  res.render("bag_delete", {
    title: "Delete Product",
    bag: bag,
  });
});

// Handle Color delete on POST.
exports.bag_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of bags
  const [bag] = await Promise.all([Bag.findById(req.params.id).exec()]);
  await Bag.findByIdAndDelete(req.body.bagid);
  res.redirect("/inventory/bags");
});

// Display bag update form on GET.
exports.bag_update_get = asyncHandler(async (req, res, next) => {
  // Get bag, categories, fabrics and colors for form.
  const [bag, allCategories, allFabrics, allColors] = await Promise.all([
    Bag.findById(req.params.id)
      .populate("category")
      .populate("fabric")
      .populate("color")
      .exec(),
    Category.find().sort({ name: 1 }).exec(),
    Fabric.find().sort({ name: 1 }).exec(),
    Color.find().sort({ name: 1 }).exec(),
  ]);

  if (bag === null) {
    // No results.
    const err = new Error("Bag not found");
    err.status = 404;
    return next(err);
  }

  res.render("bag_form", {
    title: "Update Bag",
    categories: allCategories,
    fabrics: allFabrics,
    colors: allColors,
    bag: bag,
  });
});

// Handle bag update on POST.
exports.bag_update_post = [
  // Validate and sanitize fields.
  body("name", "Product name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape(),
  body("stock", "Quantity must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .escape(),
  body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("fabric", "Fabric must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("color", "Fabric must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Bag object with escaped and trimmed data.
    const bag = new Bag({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      fabric: req.body.fabric,
      color: req.body.color,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories, colors, and fabrics, which we can use for adding to our bag.
      const [allCategories, allFabrics, allColors] = await Promise.all([
        Category.find().sort({ name: 1 }).exec(),
        Fabric.find().sort({ name: 1 }).exec(),
        Color.find().sort({ name: 1 }).exec(),
      ]);

      res.render("bag_form", {
        title: "Update Bag",
        categories: allCategories,
        fabrics: allFabrics,
        colors: allColors,
        bag: bag,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save Bag.
      const updateBag = await Bag.findByIdAndUpdate(req.params.id, bag, {});
      res.redirect(updateBag.url);
    }
  }),
];
