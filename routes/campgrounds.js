const express = require('express');
const asyncatch = require("../utilities/asyncatch");
const AppError = require('../utilities/AppError');
const Campground = require("../models/campground");
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground, validateReview } = require('../middleware');
const campgrounds = require('../controllers/campgroundcontroller');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const reviews = require("../controllers/reviewcontroller");

const router = express.Router();

router.route('/')
    .get(asyncatch(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, asyncatch(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(asyncatch(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, upload.array('image'), asyncatch(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, asyncatch(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, asyncatch(campgrounds.renderEditForm));

module.exports = router;
