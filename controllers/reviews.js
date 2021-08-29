const Campground = require('../models/campground');
const Review = require('../models/review');

// Telegram Stuff
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);
const chatId = process.env.TELEGRAM_GROUP_CHAT_ID

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created New Review!');
    res.redirect(`/campgrounds/${campground._id}`);
    bot.sendMessage(chatId, `🆕 New Review Created For ${campground.title} added by ${req.user.username} (${req.user.email})`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted the Review');
    res.redirect(`/campgrounds/${id}`)
    bot.sendMessage(chatId, `🗑️ A Review has been deleted for ${campground.title} by ${req.user.username} (${req.user.email})`);
};