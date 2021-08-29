if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const ejsMAte = require('ejs-mate');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//Routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

//connect to Mongo DB
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("√√√ Database Connected");
});

//launch express
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

// info to render views for the pages
app.engine('ejs', ejsMAte)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'liam@liam.com', username: 'Liam' });
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
});

// Telegram Stuff
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    const fName = msg.from.first_name
    const UID = msg.from.id
    const GID = msg.chat.id


    const chatId = msg.chat.id;
    // const resp = match[1]; 

    if (UID === GID) {
        const resp = `Hello ${fName}, Your User ID is: ${UID} you will be sent everything`;
        bot.sendMessage(chatId, resp);
    }
    const resp = `Hello ${fName}, Your User ID is: ${UID} & Your Group ID is ${GID} `;

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
    console.log(msg)
});

bot.onText(/\/setup/, (msg, match) => {
    const fName = msg.from.first_name;
    const UID = msg.from.id;
    const GID = msg.chat.id;
    const chatId = msg.chat.id;

    if (UID === GID) {
        const resp = `Hello ${fName},\n Lets Get you Started, Your User ID is: ${UID} \n as you are direct messaging me, you Chat ID is the same so add ${GID} in the next field`;
        bot.sendMessage(chatId, resp);
    } else {
        const resp = `Hello ${fName},\n Let get this group chat popping!, in the fields add you User ID: ${UID} \n & Your Group ID is ${GID} `;
        bot.sendMessage(chatId, resp);
    }
});

// Listen for any kind of message.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message here');
    console.log(msg)
});

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/review', reviewRoutes)

// Home Directory for Yelp-camp
app.get('/', (req, res) => {
    res.render('home')
});


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
    console.log("√√√ Listening on Port 3000")
});