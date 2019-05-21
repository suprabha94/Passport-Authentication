const express = require('express')
const cp = require('cookie-parser');
const bp = require('body-parser');

require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose')
const passport = require('passport')

const app = express();

const port = process.env.PORT || 3000
    // const dbPort = process.env.DB_PORT || 27017
    // const dbUrl = process.env.DB_URL || "localhost"
    // const dbCollection = process.env.DB_COLLECTION || "auth-test";

// mongoose.set('useCreateIndex', true);
// mongoose.connect(`mongodb://${dbUrl}/${dbCollection}`, { useNewUrlParser: true })
//     .then(_ => console.log('Connected Successfully to MongoDB'))
//     .catch(err => console.error(err))

var opts = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
};
const MONGO_URL = 'mongodb://heroku_sj2clvbr:kac225p7edbvo5i8t4nj5bqrcl@ds259586.mlab.com:59586/heroku_sj2clvbr';
mongoose.set('useCreateIndex', true)
mongoose.connect(MONGO_URL, { useNewUrlParser: true })
    .then(_ => console.log('Connected Successfully to MongoDB'))
    .catch(err => console.error(err))

app.use(passport.initialize())

require('./passport-config')(passport);

app.use(cp());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use((req, res, next) => {
    if (req.body) console.info(req.body)
    if (req.params) console.info(req.params)
    if (req.query) console.info(req.query)
    console.info(`Received a ${req.method} request from ${req.ip} for ${req.url}`)
    next();
})
app.use('/users', require('./routes/user'))

app.listen(port, err => {
    if (err) console.error(err);
    console.log(`Listening for requests on port: ${port}`)
})