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
const campground = require('./models/campground');

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

// Home Directory for Yelp-camp
app.get('/', (req, res) => {
    res.render('home')
});
// Listing all the Campgrounds
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    const count = await Campground.countDocuments({})
    res.render('campgrounds/index', { campgrounds, count })
}));
// Create a new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
});
// receive the new campground request, save it  and take to show page
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data!', 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)

}));
// Details page for an individual campground
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id).populate('reviews'));
res.render('campgrounds/show', { campgrounds })
}));

//This route will be used to show campground informaiton for editing
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campgrounds })
}));

//this is the route for the edit form to push the update to the server
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

// Delete page for an individual campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds')
}));

//Route for submitting the campground reviews
app.post('/campgrounds/:id/review', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
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