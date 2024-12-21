const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const validate = {};

validate.addClassificationRules = () => {
  return [
    // classification name is required and must only contain alphabetic characters, with no spaces or special characters
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required")
      .isAlpha("en-US", { ignore: "" }) // ensures only alphabetic characters, no spaces or special characters
      .withMessage(
        "Classification name can only contain alphabetic characters without spaces or special characters"
      )
      .custom(async (classification_name) => {
        const classificationExists =
          await invModel.checkExistingClassification(classification_name);
        if (classificationExists) {
          throw new Error("Classification already exists");
        }
      }),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

validate.addInventoryRules = () => {
  return [
    // Make: Required, minimum length 2
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required")
      .isLength({ min: 2 }),

    // Model: Required, minimum length 2
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required")
      .isLength({ min: 2 }),

    // Year: Required, numeric, exactly 4 digits
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Year is required")
      .isNumeric()
      .withMessage("Year must be a number")
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be exactly 4 digits"),

    // Description: Required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required"),

    // Image: Required, predefined value, no additional validation needed
    body("inv_image").trim().notEmpty().withMessage("Image is required"),

    // Thumbnail: Required, predefined value, no additional validation needed
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail is required"),

    // Color: Required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required"),

    // Miles: Required, numeric, whole number
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Miles is required")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer"),

    // Price: Required, numeric, whole number
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Price is required")
      .isInt({ min: 0 })
      .withMessage("Price must be a positive integer"),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  const select = await utilities.buildClassificationList(
    req.body.classification_id
  );
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      select,
      nav,
    });
    return;
  }
  next();
};

validate.checkUpdateData = async (req, res, next) => {
  let errors = [];
  const inv_id = req.body.inv_id;
  const vehicleName =
    req.body.inv_year + " " + req.body.inv_make + " " + req.body.inv_model;
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + vehicleName,
      nav,
      inv_id,
    });
    return;
  }
  next();
};

module.exports = validate;