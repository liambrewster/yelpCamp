const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
// this is the calculation to pick a random entry from an array of information
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '60f32041f3f6c3363069ca4b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude],
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/br3wst3r/image/upload/v1631105890/YelpCamp/dytypym74ggskf7zamxk.jpg',
                    filename: 'YelpCamp/dytypym74ggskf7zamxk'
                },
                {
                    url: 'https://res.cloudinary.com/br3wst3r/image/upload/v1631105889/YelpCamp/w7oocw15txmabr1m4uzw.jpg',
                    filename: 'YelpCamp/w7oocw15txmabr1m4uzw'
                },
                {
                    url: 'https://res.cloudinary.com/br3wst3r/image/upload/v1631105894/YelpCamp/t7dflhkuomhz1srfngqm.jpg',
                    filename: 'YelpCamp/t7dflhkuomhz1srfngqm'
                }
            ],
            description: "Run it up the flagpole that's not on the roadmap but can you put it into a banner that is not alarming, but eye catching and not too giant Bob called an all-hands this afternoon bake it in obviously, so quantity. On-brand but completeley fresh game plan, but digitalize for we need to build it so that it scales work for wheelhouse. Run it up the flag pole pipeline. Three-martini lunch critical mass. On your plate. Table the discussion hire the best drink the Kool-aid we need more paper back to the drawing-board, for table the discussion . Iâ€™ve been doing some research this morning and we need to better. New economy tread it daily. Problem territories let's take this conversation offline reach out, for move the needle encourage & support business growth  🏕️ ",
            price
        })
        await camp.save();

    }
}
seedDB().then(() => {
    mongoose.connection.close();
    console.log("New Test Data populated √")
})