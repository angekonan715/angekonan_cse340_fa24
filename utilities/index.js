const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
      + 'details"><img src="' + vehicle.inv_thumbnail
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View '
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}



Util.buildVehicleViewbyId = async function (data) {
  let view = `<div id="detailDiv">
  <div id="imageDiv"> <img id="vehicleImage" src=${
    data.inv_image
  } alt="Image of ${data.inv_year} ${data.inv_make} ${
    data.inv_model
  } on CSE Motors"/></div>
  <div id="infoDiv">
  <div id="vehicleInfo">
  <p><span>Price: $</span>${new Intl.NumberFormat("en-US").format(
    data.inv_price
  )}</p>
  <p><span>Color: </span>${data.inv_color}</p>
  <p><span>Mileage: </span>${new Intl.NumberFormat("en-US").format(
    data.inv_miles
  )}</p>
  </div>
  <p><span>Description: </span>${data.inv_description}</p>

  </div>

   </div>`;

  return view;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList = `
    <select name="classification_id" id="classificationList" required>
      <option value="">Choose a Classification</option>`;

  data.rows.forEach((row) => {
    classificationList += `
      <option value="${row.classification_id}"${classification_id != null && row.classification_id == classification_id ? " selected" : ""}>
        ${row.classification_name}
      </option>`;
  });

  classificationList += `</select>`;
  return classificationList;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("Please log in");
    res.redirect("/account/login");
  }
};

Util.checkAccountType = (req, res, next) => {
  const accountType = res.locals.accountData.account_type;
  if (accountType === "Admin" || accountType === "Employee") {
    next();
  } else {
    req.flash(
      "notice-fail",
      "You have to be an admin or an employee to access this page"
    );
    res.redirect("/account/login");
  }
};


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util