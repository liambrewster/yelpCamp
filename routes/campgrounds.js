const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// Create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// Details page for an individual campground
router.route('/:id')
    .get('/:id', catchAsync(campgrounds.showCampground))
    .put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//This route will be used to show campground informaiton for editing
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;