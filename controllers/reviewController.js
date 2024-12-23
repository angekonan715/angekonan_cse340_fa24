const revModel = require("../models/review-model");
const utilities = require("../utilities/");
const revCont = {};

revCont.buildEditReviewView = async (req, res) => {
  const nav = await utilities.getNav();
  const reviewId = req.params.review_id;
  const reviewData = await revModel.getReviewbyReviewId(reviewId);
  console.log(reviewData);
  res.render("./review/editReview", {
    title: "Edit Review",
    nav,
    reviewData,
  });
};

revCont.processEditReview = async (req, res) => {
  const { inv_id, account_id, review_id, reviewer_name, review_content } =
    req.body;
  const nav = await utilities.getNav();
  const reviewData = await revModel.getReviewbyReviewId(review_id);

  try {
    const data = await revModel.updateReview(
      inv_id,
      account_id,
      review_id,
      reviewer_name,
      review_content
    );

    if (data) {
      req.flash("notice-success", "Review updated successfully.");
      res.redirect("/account/");
    } else {
      req.flash(
        "notice-fail",
        "Sorry, there was an error updating the review."
      );
      res.render("./review/editReview", {
        title: "Edit Review",
        nav,
        reviewData,
      });
    }
  } catch (error) {
    console.error("ERROR IN PROCESSING EDIT REVIEW", error);
  }
};

revCont.deleteReviewView = async (req, res) => {
  const nav = await utilities.getNav();
  const reviewId = req.params.review_id;
  const reviewData = await revModel.getReviewbyReviewId(reviewId);
  console.log(reviewData);
  res.render("./review/deleteReview", {
    title: "Delete Review",
    nav,
    reviewData,
  });
};

revCont.processDeleteReview = async (req, res) => {
  const { review_id } = req.body;

  try {
    const data = await revModel.deleteReview(review_id);
    if (data) {
      req.flash("notice-success", "Review deleted successfully.");
      res.redirect("/account/");
    } else {
      req.flash(
        "notice-fail",
        "Sorry, there was an error deleting the review."
      );
      // res.redirect("/account/");
    }
  } catch (error) {
    console.error("ERROR IN PROCESSING DELETE REVIEW", error);
  }
};
module.exports = revCont;