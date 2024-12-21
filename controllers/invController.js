const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const classification =
    await invModel.getClassificationbyId(classification_id);
  const classificationName = classification.classification_name;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  console.log("data", data[0]);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  if (data[0] !== undefined) {
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " Vehicles",
      nav,
      grid,
      className,
      message: null,
    });
  } else {
    res.render("./inventory/classification", {
      title: classificationName + "Vehicles",
      nav,
      grid,
      message: "No vehicles found for this classification",
      className: null,
    });
  }
};
invCont.buildVehicleDetail = async function (req, res, next) {
  const vehicle_id = req.params.inv_Id;
  const account_id = res.locals.account_id;
  const data = await invModel.getInventoryByVehicleId(vehicle_id);
  const reviewData = await revModel.getReviewsByVehicleId(vehicle_id);
  console.log("reviewData", reviewData);
  const vehicle = await utilities.buildVehicleViewbyId(data);
  let nav = await utilities.getNav();
  const vehicleName =
    data.inv_year + " " + data.inv_make + " " + data.inv_model;
  res.render("./inventory/vehicleDetails", {
    title: vehicleName,
    nav,
    vehicle,
    account_id,
    vehicle_id,
    reviewData,
  });
};

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
  });
};

invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

invCont.processAddClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  const addClassificationResult =
    await invModel.addClassification(classification_name);
  if (!addClassificationResult) {
    req.flash(
      "notice-fail",
      "Sorry, there was an error adding the classification."
    );
    res.redirect("/inv/addClassification");
    return;
  } else {
    req.flash("notice-success", "Classification added successfully.");
    res.redirect("/inv/");
  }
};

invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav();
  let select = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    select,
    errors: null,
  });
};

invCont.processAddInventory = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const addInventoryResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
  if (!addInventoryResult) {
    req.flash("notice-fail", "Sorry, there was an error adding the inventory.");
    res.redirect("/inv/addInventory");
    return;
  } else {
    req.flash("notice-success", "Inventory added successfully.");
    res.redirect("/inv/");
  }
};

invCont.getInventoryByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data =
      await invModel.getInventoryByClassificationId(classification_id);
    res.json(data);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.status(500).json({ error: "Failed to retrieve inventory items" });
  }
};

invCont.buildEditInventoryView = async function (req, res, next) {
  const inv_Id = req.params.inv_id;
  const data = await invModel.getInventoryByVehicleId(inv_Id);
  let select = await utilities.buildClassificationList(data.classification_id);
  let nav = await utilities.getNav();
  const vehicleName =
    data.inv_year + " " + data.inv_make + " " + data.inv_model;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + vehicleName,
    nav,
    errors: null,
    select,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id,
  });
};

invCont.processEditInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_color,
    inv_miles,
    inv_price,
    classification_id,
  } = req.body;
  console.log("in update", req.body);
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice-success", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const select = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice-fail", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      select,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

invCont.deleteInventoryConfirmationView = async function (req, res, next) {
  const inv_Id = req.params.inv_id;
  const data = await invModel.getInventoryByVehicleId(inv_Id);
  let nav = await utilities.getNav();
  const vehicleName =
    data.inv_year + " " + data.inv_make + " " + data.inv_model;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + vehicleName,
    nav,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
  });
};

invCont.processDeleteInventory = async function (req, res, next) {
  const inv_Id = req.params.inv_id;
  const deleteResult = await invModel.deleteInventory(inv_Id);
  if (deleteResult) {
    req.flash("notice-success", "The vehicle was successfully deleted.");
    res.redirect("/inv/");
  } else {
    req.flash("notice-fail", "Sorry, the delete failed.");
    res.redirect("/inv/");
  }
};

invCont.addReview = async function (req, res, next) {
  const { reviewer_name, review_content, inv_id } = req.body;
  const vehicle_id = inv_id;
  console.log("vehicle_id", vehicle_id);
  const account_id = res.locals.accountData.account_id;
  console.log("account_id", account_id);
  const reviewData = await revModel.getReviewsByVehicleId(vehicle_id);
  const data = await invModel.getInventoryByVehicleId(vehicle_id);
  const vehicle = await utilities.buildVehicleViewbyId(data);
  let nav = await utilities.getNav();
  const vehicleName =
    data.inv_year + " " + data.inv_make + " " + data.inv_model;

  try {
    const addReviewResult = await revModel.addReview(
      vehicle_id,
      account_id,
      reviewer_name,
      review_content
    );
    if (addReviewResult) {
      req.flash("notice-success", "Review added successfully.");
      res.render("./inventory/vehicleDetails", {
        title: vehicleName,
        nav,
        vehicle,
        account_id,
        vehicle_id,
        reviewData,
      });
    } else {
      req.flash("notice-fail", "Sorry, there was an error adding the review.");
      res.render("./inventory/vehicleDetails", {
        title: vehicleName,
        nav,
        vehicle,
        account_id,
        vehicle_id,
        reviewData,
      });
    }
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.status(500).json({ error: "Failed to retrieve inventory items" });
  }
};

module.exports = invCont