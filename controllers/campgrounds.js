const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary")

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    const count = await Campground.countDocuments({})
    res.render('campgrounds/index', { campgrounds, count })
};


module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
};

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.showCampground = async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('author');
    console.log(campgrounds)
    if (!campgrounds) {
        req.flash('error', 'Cannot Find That Campground, Try again!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campgrounds })
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
    if (!campgrounds) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campgrounds });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImage) {
        for (let filename of req.body.deleteImage) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImage } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You Do Not Have Permission to do that!');
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    const campgrounds = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Deleted the Campground');
    res.redirect('/campgrounds')
};