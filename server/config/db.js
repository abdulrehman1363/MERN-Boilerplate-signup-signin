const mongoose = require('mongoose');
const keys = require('./keys');


const connectDB = async () => {
    try {
        await mongoose.connect(keys.mongoURI)
        console.log('Database connection established')
    } catch (error) {
        console.error('Error connecting', error)
        process.exit(1)
    }
}

module.exports = connectDB