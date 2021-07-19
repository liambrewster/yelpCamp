const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');



// Listing all the Campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    const count = await Campground.countDocuments({})
    res.render('campgrounds/index', { campgrounds, count })
}));
// Create a new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
});
// receive the new campground request, save it  and take to show page
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)

}));
// Details page for an individual campground
router.get('/:id', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if (!campgrounds) {
        req.flash('error', 'Cannot Find That Campground, Try again!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campgrounds })
}));

//This route will be used to show campground informaiton for editing
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
    if (!campgrounds) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campgrounds });
}));

//this is the route for the edit form to push the update to the server
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Delete page for an individual campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You Do Not Have Permission to do that!');
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    const campgrounds = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Deleted the Campground');
    res.redirect('/campgrounds')
}));

module.exports = router;