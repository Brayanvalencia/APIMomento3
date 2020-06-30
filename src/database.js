const mongoose = require('mongoose');
const { mongodb } = require('./keys');


mongoose.connect(mongodb.URI, {useNewUrlParser: true})
    .then(db => console.log('Database is Connected'))
    .catch(err => console.err(err))