const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

//accountManagement route
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

//Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Route to build register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.processRegistration)
);

//Route to process login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.processLogin)
);

//Route to process logout
router.get("/logout", utilities.handleErrors(accountController.processLogout));

//Route to update account view
router.get(
  "/updateAccount/:account_id",
  utilities.handleErrors(accountController.buildUpdateAccount)
);

//Route to update account
router.post(
  "/updateAccount/:account_id",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.processUpdateAccount)
);

router.post(
  "/updatePassword/:account_id",
  regValidate.updatePasswordDataRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.processUpdatePassword)
);

module.exports = router;