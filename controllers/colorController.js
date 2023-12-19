const Color = require("../models/color");
const Bag = require("../models/bag");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
exports.color_create_get = (req, res, next) => {
  res.render("color_form", { title: "Create Color" });
};

// Handle Color create on POST.
exports.color_create_post = [
  // Validate and sanitize the name and image fields.
  body("name", "Color name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("image", "Color image file name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a color object with escaped and trimmed data.
    const color = new Color({
      name: req.body.name,
      image: `/images/${req.body.image}`,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("color_form", {
        title: "Create Color",
        color: color,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Color with same name already exists.
      const colorExists = await Color.findOne({ name: req.body.name }).exec();
      if (colorExists) {
        // Color exists, redirect to its detail page.
        res.redirect(colorExists.url);
      } else {
        await color.save();
        // New color saved. Redirect to color detail page.
        res.redirect(color.url);
      }
    }
  }),
];

// Display Color delete form on GET.
exports.color_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of colors and all their bags (in parallel)
  const [color, allBagsThisColor] = await Promise.all([
    Color.findById(req.params.id).exec(),
    Bag.find({ color: req.params.id }, "name").exec(),
  ]);

  if (color === null) {
    // No results.
    res.redirect("/inventory/colors");
  }

  res.render("color_delete", {
    title: "Delete Color",
    color: color,
    color_bags: allBagsThisColor,
  });
});

// Handle Color delete on POST.
exports.color_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of colors and all their bags (in parallel)
  const [color, allBagsThisColor] = await Promise.all([
    Color.findById(req.params.id).exec(),
    Bag.find({ color: req.params.id }, "name").exec(),
  ]);
  if (allBagsThisColor.length > 0) {
    //There are bags this color. Render in same way as for GET route.
    res.render("color_delete", {
      title: "Delete Color",
      color: color,
      color_bags: allBagsThisColor,
    });
    return;
  } else {
    // There are no bags this color. Delete object and redirect to the list of colors.
    await Color.findByIdAndDelete(req.body.colorid);
    res.redirect("/inventory/colors");
  }
});

// Display color update form on GET.
exports.color_update_get = asyncHandler(async (req, res, next) => {
  // Get color
  const [color] = await Promise.all([Color.findById(req.params.id).exec()]);

  if (color === null) {
    // No results.
    const err = new Error("Color not found");
    err.status = 404;
    return next(err);
  }

  res.render("color_form", {
    title: "Update Color",
    color: color,
  });
});

// Handle color update on POST.
exports.color_update_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Color must have a name."),
  body("image", "Color image file name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Color object with escaped and trimmed data.
    const color = new Color({
      name: req.body.name,
      image: `/images/${req.body.image}`,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("color_form", {
        title: "Update Color",
        color: color,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save Color.
      const updateColor = await Color.findByIdAndUpdate(
        req.params.id,
        color,
        {}
      );
      res.redirect(updateColor.url);
    }
  }),
];
