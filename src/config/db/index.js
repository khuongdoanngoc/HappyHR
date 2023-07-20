const mongoose = require('mongoose')


async function connect() {
    try {
        await mongoose.connect(process.env.DB_CONNECT)
        console.log('Connect successfully!');
    } catch (error) {
        console.log('Connect failed!');
    }
}

module.exports = { connect }