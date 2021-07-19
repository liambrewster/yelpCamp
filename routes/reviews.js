const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { validateReview } = require('../middleware.js');


//Route for submitting the campground reviews
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created New Review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Delete a Review
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted the Review');
    res.redirect(`/campgrounds/${id}`)
}));

module.exports = router;