const Fabric = require("../models/fabric");
const Bag = require("../models/bag");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
exports.fabric_create_get = (req, res, next) => {
  res.render("fabric_form", { title: "Create Fabric" });
};

// Handle Fabric create on POST.
exports.fabric_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Fabric must have a name.")
    .isAlphanumeric()
    .withMessage("Fabric name has non-alphanumeric characters."),
  body("description", "Fabric description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("image", "Fabric image file name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create fabric object with escaped and trimmed data
    const fabric = new Fabric({
      name: req.body.name,
      description: req.body.description,
      image: `/images/${req.body.image}`,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("fabric_form", {
        title: "Create Fabric",
        fabric: fabric,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save Fabric.
      await fabric.save();
      // Redirect to new fabric record.
      res.redirect(fabric.url);
    }
  }),
];

// Display Fabric delete form on GET.
exports.fabric_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of fabrics and all their bags (in parallel)
  const [fabric, allBagsThisFabric] = await Promise.all([
    Fabric.findById(req.params.id).exec(),
    Bag.find({ fabric: req.params.id }, "name").exec(),
  ]);

  if (fabric === null) {
    // No results.
    res.redirect("/inventory/fabrics");
  }

  res.render("fabric_delete", {
    title: "Delete Fabric",
    fabric: fabric,
    fabric_bags: allBagsThisFabric,
  });
});

// Handle Fabric delete on POST.
exports.fabric_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of fabrics and all their bags (in parallel)
  const [fabric, allBagsThisFabric] = await Promise.all([
    Fabric.findById(req.params.id).exec(),
    Bag.find({ fabric: req.params.id }, "name").exec(),
  ]);
  if (allBagsThisFabric.length > 0) {
    //There are bags this fabric. Render in same way as for GET route.
    res.render("fabric_delete", {
      title: "Delete Fabric",
      fabric: fabric,
      fabric_bags: allBagsThisFabric,
    });
    return;
  } else {
    // There are no bags this fabric. Delete object and redirect to the list of fabrics.
    await Fabric.findByIdAndDelete(req.body.fabricid);
    res.redirect("/inventory/fabrics");
  }
});

// Display fabric update form on GET.
exports.fabric_update_get = asyncHandler(async (req, res, next) => {
  // Get Fabric
  const [fabric] = await Promise.all([Fabric.findById(req.params.id).exec()]);

  if (fabric === null) {
    // No results.
    const err = new Error("Fabric not found");
    err.status = 404;
    return next(err);
  }

  res.render("fabric_form", {
    title: "Update Fabric",
    fabric: fabric,
  });
});

// Handle fabric update on POST.
exports.fabric_update_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Fabric must have a name.")
    .isAlphanumeric()
    .withMessage("Fabric name has non-alphanumeric characters."),
  body("description", "Fabric description must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("image", "Fabric image file name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Fabric object with escaped and trimmed data.
    const fabric = new Fabric({
      name: req.body.name,
      description: req.body.description,
      image: `/images/${req.body.image}`,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("fabric_form", {
        title: "Update Fabric",
        fabric: fabric,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save Fabric.
      const updateFabric = await Fabric.findByIdAndUpdate(
        req.params.id,
        fabric,
        {}
      );
      res.redirect(updateFabric.url);
    }
  }),
];
