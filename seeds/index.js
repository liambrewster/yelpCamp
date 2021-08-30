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
                coordinates: [-1.470829, 53.370350],
            },
            images: [
                {

                    url: 'https://res.cloudinary.com/br3wst3r/image/upload/v1629576867/YelpCamp/ibrickg4g59kzhhdtq8j.jpg',
                    filename: 'YelpCamp/ibrickg4g59kzhhdtq8j'
                },
                {

                    url: 'https://res.cloudinary.com/br3wst3r/image/upload/v1629576868/YelpCamp/xa2tgi9kv2oh0rm2muo9.jpg',
                    filename: 'YelpCamp/xa2tgi9kv2oh0rm2muo9'
                }
            ],
            description: 'another great campground 🏕️ ',
            price
        })
        await camp.save();

    }
}
seedDB().then(() => {
    mongoose.connection.close();
    console.log("New Test Data populated √")
})