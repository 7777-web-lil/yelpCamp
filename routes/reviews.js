const express= require('express')
const asyncatch = require("../utilities/asyncatch");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {reviewSchema} = require("../schemas");
const AppError = require("../utilities/AppError");
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware");
const reviews = require('../controllers/reviewcontroller');
const router = express.Router({ mergeParams: true })



router.post('/', isLoggedIn, validateReview, asyncatch(reviews.createReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, asyncatch(reviews.deleteReview));

module.exports= router

