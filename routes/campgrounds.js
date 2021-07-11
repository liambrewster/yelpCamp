const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');

//create validation middleware for campground
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

// Listing all the Campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    const count = await Campground.countDocuments({})
    res.render('campgrounds/index', { campgrounds, count })
}));
// Create a new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
});
// receive the new campground request, save it  and take to show page
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data!', 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)

}));
// Details page for an individual campground
router.get('/:id', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campgrounds })
}));

//This route will be used to show campground informaiton for editing
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campgrounds })
}));

//this is the route for the edit form to push the update to the server
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Delete page for an individual campground
router.delete('/:id', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds')
}));

module.exports = router;