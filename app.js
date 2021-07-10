const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
const ejsMAte = require('ejs-mate');
const morgan = require('morgan');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const campgrounds = require('./routes/campgrounds');

//connect to Mongo DB
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

//launch express
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

// info to render views for the pages
app.engine('ejs', ejsMAte)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

app.use('/campgrounds', campgrounds)

// Home Directory for Yelp-camp
app.get('/', (req, res) => {
    res.render('home')
});

//Route for submitting the campground reviews
app.post('/campgrounds/:id/review', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Delete a Review
app.delete('/campgrounds/:id/review/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}));

//new error
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Basic Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong!'
    res.status(statusCode).render('errors', { err })
})

app.listen(3000, () => {
    console.log("Listening on Port 3000")
});