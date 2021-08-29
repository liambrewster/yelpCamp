const User = require('../models/user');

// Telegram Stuff
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);
const chatId = process.env.TELEGRAM_GROUP_CHAT_ID

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds')
        });
        bot.sendMessage(chatId, `🆕 New User Created called ${user.username}, with an email of ${user.email}`);

    } catch (e) {

        req.flash('error', e.message)
        res.redirect('register')
    }

};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectURL);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You have been logged out!');
    res.redirect('/campgrounds')
};