const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const revModel = require("../models/review-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Deliver Login View
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", { title: "Login", nav, errors: null });
  req.flash("notice-success", "Please log in");
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", { title: "Register", nav, errors: null });
}

async function processRegistration(req, res, next) {
  let nav = await utilities.getNav();

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice-fail",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice-success",
      `Registration successful ${account_firstname}. Please login.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice-fail", "Registration failed. Please try again.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
}

/*
 * Process Login
 */
async function processLogin(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice-fail", "Login failed. Please try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
          secure: true,
        });
      }
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/*
Process logout
 */
async function processLogout(req, res, next) {
  if (req.cookies.jwt) {
    res.clearCookie("jwt");
  }

  return res.redirect("/");
}

/***
 * Build Account Management Page
 * ** */
async function buildAccountManagement(req, res, next) {
  const accountData = res.locals.accountData;
  const accountReviews = await revModel.getReviewsbyAccountId(
    accountData.account_id
  );
  console.log(accountReviews);
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData,
    accountReviews,
  });
}

/**
 * Account Update view
 */

async function buildUpdateAccount(req, res, next) {
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id);
  // console.log(account_id, "account_id");
  const nav = await utilities.getNav();
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData,
  });
}

/***
 * Update account details
 * ** */
async function processUpdateAccount(req, res, next) {
  const account_id = req.params.account_id;
  const { account_firstname, account_lastname, account_email } = req.body;

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  if (updateResult) {
    req.flash("notice-success", "Account updated successfully.");
    res.redirect("/account/");
  } else {
    req.flash("notice-fail", "Sorry, there was an error updating the account.");
  }
}

/****
 * Update account password
 * **** */
async function processUpdatePassword(req, res, next) {
  const nav = await utilities.getNav();
  const account_id = req.params.account_id;
  const { account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice-fail",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );
  if (updateResult) {
    req.flash("notice-success", "Password updated successfully.");
    res.redirect("/account/");
  } else {
    req.flash(
      "notice-fail",
      "Sorry, there was an error updating the password."
    );
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  processRegistration,
  processLogin,
  buildAccountManagement,
  processLogout,
  buildUpdateAccount,
  processUpdateAccount,
  processUpdatePassword,
};