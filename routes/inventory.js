const express = require("express");
const router = express.Router();

// Require controller modules.
const bag_controller = require("../controllers/bagController");
const category_controller = require("../controllers/categoryController");
const fabric_controller = require("../controllers/fabricController");
const color_controller = require("../controllers/colorController");

/// Bag ROUTES ///

// GET inventory home page.
router.get("/", bag_controller.index);

// GET request for creating a bag. NOTE This must come before routes that display bag (uses id).
router.get("/bag/create", bag_controller.bag_create_get);

// POST request for creating bag.
router.post("/bag/create", bag_controller.bag_create_post);

// GET request to delete bag.
router.get("/bag/:id/delete", bag_controller.bag_delete_get);

// POST request to delete bag.
router.post("/bag/:id/delete", bag_controller.bag_delete_post);

// GET request to update bag.
router.get("/bag/:id/update", bag_controller.bag_update_get);

// POST request to update bag.
router.post("/bag/:id/update", bag_controller.bag_update_post);

// GET request for one bag.
router.get("/bag/:id", bag_controller.bag_detail);

// GET request for list of all Bag items.
router.get("/bags", bag_controller.bag_list);

/// Category ROUTES ///

// GET request for creating Category. NOTE This must come before route for id (i.e. display category).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating Category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Category.
router.get("/categories", category_controller.category_list);

/// Fabric ROUTES ///

// GET request for creating a Fabric. NOTE This must come before route that displays Fabric (uses id).
router.get("/fabric/create", fabric_controller.fabric_create_get);

//POST request for creating Fabric.
router.post("/fabric/create", fabric_controller.fabric_create_post);

// GET request to delete fabric.
router.get("/fabric/:id/delete", fabric_controller.fabric_delete_get);

// POST request to delete fabric.
router.post("/fabric/:id/delete", fabric_controller.fabric_delete_post);

// GET request to update fabric.
router.get("/fabric/:id/update", fabric_controller.fabric_update_get);

// POST request to update fabric.
router.post("/fabric/:id/update", fabric_controller.fabric_update_post);

// GET request for one fabric.
router.get("/fabric/:id", fabric_controller.fabric_detail);

// GET request for list of all fabric.
router.get("/fabrics", fabric_controller.fabric_list);

/// Color ROUTES ///

// GET request for creating a color. NOTE This must come before route that displays color (uses id).
router.get("/color/create", color_controller.color_create_get);

// POST request for creating color.
router.post("/color/create", color_controller.color_create_post);

// GET request to delete color.
router.get("/color/:id/delete", color_controller.color_delete_get);

// POST request to delete color.
router.post("/color/:id/delete", color_controller.color_delete_post);

// GET request to update color.
router.get("/color/:id/update", color_controller.color_update_get);

// POST request to update color.
router.post("/color/:id/update", color_controller.color_update_post);

// GET request for one color.
router.get("/color/:id", color_controller.color_detail);

// GET request for list of all color.
router.get("/colors", color_controller.color_list);

module.exports = router;
