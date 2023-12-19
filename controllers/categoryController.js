const Category = require("../models/category");
const Bag = require("../models/bag");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name description image")
    .sort({ name: 1 })
    .exec();

  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  // Get details of the categories and all associated bags (in parallel)
  const [category, bagsWithinCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Bag.find({ category: req.params.id }, "name price")
      .sort({ price: 1 })
      .exec(),
  ]);
  if (category === null) {
    // No results.
    const err = new Error("Fabric not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_bags: bagsWithinCategory,
  });
});

// Display Category create form on GET.
exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

// Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Category must have a name.")
    .isAlphanumeric()
    .withMessage("Category name has non-alphanumeric characters."),
  body("description", "Category description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("image", "Category image file name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      image: `/images/${req.body.image}`,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save Category.
      await category.save();
      // Redirect to new category record.
      res.redirect(category.url);
    }
  }),
];

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of categories and all their bags (in parallel)
  const [category, allBagsInThisCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Bag.find({ category: req.params.id }, "name").exec(),
  ]);

  if (category === null) {
    // No results.
    res.redirect("/inventory/categories");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_bags: allBagsInThisCategory,
  });
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of categories and all their bags (in parallel)
  const [category, allBagsInThisCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Bag.find({ category: req.params.id }, "name").exec(),
  ]);
  if (allBagsInThisCategory.length > 0) {
    //There are bags in this category. Render in same way as for GET route.
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_bags: allBagsInThisCategory,
    });
    return;
  } else {
    // There are no bags in this category. Delete object and redirect to the list of categories.
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/inventory/categories");
  }
});

// Display category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  // Get category
  const [category] = await Promise.all([
    Category.findById(req.params.id).exec(),
  ]);

  if (category === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update Category",
    category: category,
  });
});

// Handle category update on POST.
exports.category_update_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Category must have a name.")
    .isAlphanumeric()
    .withMessage("Category name has non-alphanumeric characters."),
  body("description", "Category description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("image", "Category image file name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      image: `/images/${req.body.image}`,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save Category.
      const updateCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      res.redirect(updateCategory.url);
    }
  }),
];
