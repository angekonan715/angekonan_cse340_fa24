const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities/");

//inventoryManagement route
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
);

//Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

//router to get inventory by classification id
router.get(
  "/getInventory/:classificationId",
  utilities.handleErrors(invController.getInventoryByClassificationId)
);

//route to build specific vehicle view
router.get(
  "/detail/:inv_Id",
  utilities.handleErrors(invController.buildVehicleDetail)
);

//route to build addclassification view
router.get(
  "/addClassification",
  utilities.handleErrors(invController.buildAddClassificationView)
);

//route to process adding classification
router.post(
  "/addClassification",
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.processAddClassification)
);

router.get(
  "/addInventory",
  utilities.handleErrors(invController.buildAddInventoryView)
);

//route to process adding inventory
router.post(
  "/addInventory",
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.processAddInventory)
);

//editInventory view route
router.get(
  "/editInventory/:inv_id",
  utilities.handleErrors(invController.buildEditInventoryView)
);

//process edit inventory
router.post(
  "/editInventory",
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.processEditInventory)
);

//delete inventory confirmation view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteInventoryConfirmationView)
);

//delete inventory process
router.post(
  "/delete/:inv_id",
  utilities.handleErrors(invController.processDeleteInventory)
);

//Route to add inventory review
router.post(
  "/addReview",
  utilities.checkLogin,
  utilities.handleErrors(invController.addReview)
);
module.exports = router;