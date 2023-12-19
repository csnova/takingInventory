#! /usr/bin/env node

console.log(
  'This script populates some test bags, categories, fabrics and colors to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Bag = require("./models/bag");
const Category = require("./models/category");
const Fabric = require("./models/fabric");
const Color = require("./models/color");

const bags = [];
const categories = [];
const fabrics = [];
const colors = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createColors();
  await createFabrics();
  await createCategories();
  await createBags();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// color[0] will always be the Red, regardless of the order
// in which the elements of promise.all's argument complete.
async function colorCreate(index, name, image) {
  const colordetail = {
    name: name,
    image: image,
  };

  const color = new Color(colordetail);
  await color.save();
  colors[index] = color;
  console.log(`Added color: ${name}`);
}

async function fabricCreate(index, name, description, image) {
  const fabricdetail = {
    name: name,
    description: description,
    image: image,
  };

  const fabric = new Fabric(fabricdetail);
  await fabric.save();
  fabrics[index] = fabric;
  console.log(`Added fabric: ${name}`);
}

async function categoryCreate(index, name, description, image) {
  const categorydetail = {
    name: name,
    description: description,
    image: image,
  };

  const category = new Category(categorydetail);
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function bagCreate(index, name, price, stock, category, fabric, color) {
  const bagdetail = {
    name: name,
    price: price,
    stock: stock,
    category: category,
    fabric: fabric,
    color: color,
  };

  const bag = new Bag(bagdetail);
  await bag.save();
  bags[index] = bag;
  console.log(`Added bag: ${name}`);
}

async function createColors() {
  console.log("Adding colors");
  await Promise.all([
    colorCreate(0, "Red", "/images/red.jpg"),
    colorCreate(1, "Orange", "/images/orange.jpg"),
    colorCreate(2, "Yellow", "/images/yellow.jpg"),
    colorCreate(3, "Green", "/images/green.jpg"),
    colorCreate(4, "Blue", "/images/blue.jpg"),
    colorCreate(5, "Purple", "/images/purple.jpg"),
    colorCreate(6, "Brown", "/images/brown.jpg"),
    colorCreate(7, "White", "/images/white.jpg"),
    colorCreate(8, "Grey", "/images/grey.jpg"),
    colorCreate(9, "Black", "/images/black.jpg"),
  ]);
}

async function createFabrics() {
  console.log("Adding fabrics");
  await Promise.all([
    fabricCreate(
      0,
      "Canvas",
      "Tough, water & stain resistant fabric. Great for extended use and rough play.",
      "/images/canvas.jpg"
    ),
    fabricCreate(
      1,
      "Fluffy",
      "Soft, fun, and comfortable. This fabric is for your whimsical user.",
      "/images/fluffy.jpg"
    ),
    fabricCreate(
      2,
      "Leather",
      "Beautiful, elegant, and classy. Perfect for a user looking for luxury.",
      "/images/leather.jpg"
    ),
  ]);
}

async function createCategories() {
  console.log("Adding Catagories");
  await Promise.all([
    categoryCreate(
      0,
      "Classic",
      "A bean bag chair for all occasions, why change the classics",
      "/images/classic.png"
    ),
    categoryCreate(
      1,
      "Jumbo",
      "In this overstuffed chair you will sink into comfort",
      "/images/jumbo.jpg"
    ),
    categoryCreate(
      2,
      "Orthopedic",
      "For those who want to have their cake and eat it too. A bean bag chair with back support",
      "/images/orthopedic.png"
    ),
    categoryCreate(
      3,
      "Kids",
      "Small, comfy, and cute. Every little tyke dreams of a good bean bag chair.",
      "/images/kids.png"
    ),
  ]);
}

async function createBags() {
  console.log("Adding Bags");
  await Promise.all([
    bagCreate(
      0,
      "Red Classic",
      25.99,
      15,
      categories[0],
      fabrics[0],
      colors[0]
    ),
    bagCreate(
      1,
      "Orange Classic",
      25.99,
      12,
      categories[0],
      fabrics[0],
      colors[1]
    ),
    bagCreate(
      2,
      "Yellow Classic",
      25.99,
      16,
      categories[0],
      fabrics[0],
      colors[2]
    ),
    bagCreate(
      3,
      "Green Classic",
      25.99,
      19,
      categories[0],
      fabrics[0],
      colors[3]
    ),
    bagCreate(
      4,
      "Blue Classic",
      25.99,
      18,
      categories[0],
      fabrics[0],
      colors[4]
    ),
    bagCreate(
      5,
      "Purple Classic",
      25.99,
      15,
      categories[0],
      fabrics[0],
      colors[5]
    ),
    bagCreate(
      6,
      "Brown Classic",
      25.99,
      12,
      categories[0],
      fabrics[0],
      colors[6]
    ),
    bagCreate(
      7,
      "White Classic",
      25.99,
      16,
      categories[0],
      fabrics[0],
      colors[7]
    ),
    bagCreate(
      8,
      "Grey Classic",
      25.99,
      19,
      categories[0],
      fabrics[0],
      colors[8]
    ),
    bagCreate(
      9,
      "Black Classic",
      25.99,
      18,
      categories[0],
      fabrics[0],
      colors[9]
    ),
    bagCreate(
      10,
      "Green Fluffy",
      35.99,
      19,
      categories[0],
      fabrics[1],
      colors[3]
    ),
    bagCreate(
      11,
      "Purple Fluffy",
      35.99,
      15,
      categories[0],
      fabrics[1],
      colors[5]
    ),
    bagCreate(
      12,
      "White Fluffy",
      35.99,
      16,
      categories[0],
      fabrics[1],
      colors[7]
    ),
    bagCreate(
      13,
      "Grey Fluffy",
      35.99,
      19,
      categories[0],
      fabrics[1],
      colors[8]
    ),
    bagCreate(
      14,
      "Blue Leather",
      45.99,
      18,
      categories[0],
      fabrics[2],
      colors[4]
    ),
    bagCreate(
      15,
      "Brown Leather",
      45.99,
      12,
      categories[0],
      fabrics[2],
      colors[6]
    ),
    bagCreate(
      16,
      "White Leather",
      45.99,
      16,
      categories[0],
      fabrics[2],
      colors[7]
    ),
    bagCreate(
      17,
      "Grey Leather",
      45.99,
      19,
      categories[0],
      fabrics[2],
      colors[8]
    ),
    bagCreate(
      18,
      "Black Leather",
      45.99,
      18,
      categories[0],
      fabrics[2],
      colors[9]
    ),
    bagCreate(19, "Red Jumbo", 49.99, 15, categories[1], fabrics[0], colors[0]),
    bagCreate(
      20,
      "Orange Jumbo",
      49.99,
      12,
      categories[1],
      fabrics[0],
      colors[1]
    ),
    bagCreate(
      21,
      "Yellow Jumbo",
      49.99,
      16,
      categories[1],
      fabrics[0],
      colors[2]
    ),
    bagCreate(
      22,
      "Green Jumbo",
      49.99,
      19,
      categories[1],
      fabrics[0],
      colors[3]
    ),
    bagCreate(
      23,
      "Blue Jumbo",
      49.99,
      18,
      categories[1],
      fabrics[0],
      colors[4]
    ),
    bagCreate(
      24,
      "Purple Jumbo",
      49.99,
      15,
      categories[1],
      fabrics[0],
      colors[5]
    ),
    bagCreate(
      25,
      "Brown Jumbo",
      49.99,
      12,
      categories[1],
      fabrics[0],
      colors[6]
    ),
    bagCreate(
      26,
      "White Jumbo",
      49.99,
      16,
      categories[1],
      fabrics[0],
      colors[7]
    ),
    bagCreate(
      27,
      "Grey Jumbo",
      49.99,
      19,
      categories[1],
      fabrics[0],
      colors[8]
    ),
    bagCreate(
      28,
      "Black Jumbo",
      49.99,
      18,
      categories[1],
      fabrics[0],
      colors[9]
    ),
    bagCreate(
      29,
      "Red Orthopedic",
      84.99,
      15,
      categories[2],
      fabrics[0],
      colors[0]
    ),
    bagCreate(
      30,
      "Orange Orthopedic",
      84.99,
      12,
      categories[2],
      fabrics[0],
      colors[1]
    ),
    bagCreate(
      31,
      "Yellow Orthopedic",
      84.99,
      16,
      categories[2],
      fabrics[0],
      colors[2]
    ),
    bagCreate(
      32,
      "Green Orthopedic",
      84.99,
      19,
      categories[2],
      fabrics[0],
      colors[3]
    ),
    bagCreate(
      33,
      "Blue Orthopedic",
      84.99,
      18,
      categories[2],
      fabrics[0],
      colors[4]
    ),
    bagCreate(
      34,
      "Purple Orthopedic",
      84.99,
      15,
      categories[2],
      fabrics[0],
      colors[5]
    ),
    bagCreate(
      35,
      "Brown Orthopedic",
      84.99,
      12,
      categories[2],
      fabrics[0],
      colors[6]
    ),
    bagCreate(
      36,
      "White Orthopedic",
      84.99,
      16,
      categories[2],
      fabrics[0],
      colors[7]
    ),
    bagCreate(
      37,
      "Grey Orthopedic",
      84.99,
      19,
      categories[2],
      fabrics[0],
      colors[8]
    ),
    bagCreate(
      38,
      "Black Orthopedic",
      84.99,
      18,
      categories[2],
      fabrics[0],
      colors[9]
    ),
    bagCreate(
      39,
      "Brown Leather Orthopedic",
      94.99,
      12,
      categories[2],
      fabrics[2],
      colors[6]
    ),
    bagCreate(
      40,
      "Grey Leather Orthopedic",
      94.99,
      19,
      categories[2],
      fabrics[2],
      colors[8]
    ),
    bagCreate(
      41,
      "Black Leather Orthopedic",
      94.99,
      18,
      categories[2],
      fabrics[2],
      colors[9]
    ),
    bagCreate(42, "Red Kids", 15.99, 15, categories[3], fabrics[0], colors[0]),
    bagCreate(
      43,
      "Orange Kids",
      15.99,
      12,
      categories[3],
      fabrics[0],
      colors[1]
    ),
    bagCreate(
      44,
      "Yellow Kids",
      15.99,
      16,
      categories[3],
      fabrics[0],
      colors[2]
    ),
    bagCreate(
      45,
      "Green Kids",
      15.99,
      19,
      categories[3],
      fabrics[0],
      colors[3]
    ),
    bagCreate(46, "Blue Kids", 15.99, 18, categories[3], fabrics[0], colors[4]),
    bagCreate(
      47,
      "Purple Kids",
      15.99,
      15,
      categories[3],
      fabrics[0],
      colors[5]
    ),
    bagCreate(
      48,
      "Brown Kids",
      15.99,
      12,
      categories[3],
      fabrics[0],
      colors[6]
    ),
    bagCreate(
      49,
      "White Kids",
      15.99,
      16,
      categories[3],
      fabrics[0],
      colors[7]
    ),
    bagCreate(50, "Grey Kids", 15.99, 19, categories[3], fabrics[0], colors[8]),
    bagCreate(
      51,
      "Black Kids",
      15.99,
      18,
      categories[3],
      fabrics[0],
      colors[9]
    ),
    bagCreate(
      52,
      "Red Fluffy Kids",
      19.99,
      15,
      categories[3],
      fabrics[1],
      colors[0]
    ),
    bagCreate(
      53,
      "Orange Fluffy Kids",
      19.99,
      12,
      categories[3],
      fabrics[1],
      colors[1]
    ),
    bagCreate(
      54,
      "Yellow Fluffy Kids",
      19.99,
      16,
      categories[3],
      fabrics[1],
      colors[2]
    ),
    bagCreate(
      55,
      "Green Fluffy Kids",
      19.99,
      19,
      categories[3],
      fabrics[1],
      colors[3]
    ),
    bagCreate(
      56,
      "Blue Fluffy Kids",
      19.99,
      18,
      categories[3],
      fabrics[1],
      colors[4]
    ),
    bagCreate(
      57,
      "Purple Fluffy Kids",
      19.99,
      15,
      categories[3],
      fabrics[1],
      colors[5]
    ),
    bagCreate(
      58,
      "White Fluffy Kids",
      19.99,
      16,
      categories[3],
      fabrics[1],
      colors[7]
    ),
  ]);
}
