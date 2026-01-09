const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors,descriptions,imageLinks} = require('./seedsHelper')
const Campground = require('../models/campground')

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');
    console.log('MongoDB Connected!');
}

main().catch(err => console.log(err));

const sample = array => array[Math.floor(Math.random()* array.length)]
const seedDB= async () => {
    await Campground.deleteMany({})
    for(let i=0; i<=10; i++){
        const random= Math.floor(Math.random()*10);
        const price = Math.floor(Math.random() * 20) + 10;
        const city= cities[random]
        const camp = new Campground({
            location: `${city.city}, ${city.state}`,
        title: `${sample(descriptors)}, ${sample(places)}`,
            description: sample(descriptions),
            images: [
                {
                    url: sample(imageLinks),
                    filename: 'YelpCamp/default'
                }
            ],
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    city.longitude,
                    city.latitude
                ]
            }


        });
        await camp.save();
    }
    }
    seedDB().then(() => {
        mongoose.connection.close();
    });