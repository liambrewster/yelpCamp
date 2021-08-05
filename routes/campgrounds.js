const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');



// Listing all the Campgrounds
router.get('/', catchAsync(campgrounds.index));

// Create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// receive the new campground request, save it  and take to show page
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// Details page for an individual campground
router.get('/:id', catchAsync(campgrounds.showCampground));

//This route will be used to show campground informaiton for editing
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

//this is the route for the edit form to push the update to the server
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// Delete page for an individual campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;