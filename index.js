const cors = require('cors'),
    express = require('express')
var logger = require('morgan');
const path = require('path');
const session = require('express-session');
var MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
var passport = require('passport');
require('dotenv').config();
var authRouter = require('./AuthRoutes/authRoutes');


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

try {
    mongoose.connect(
        process.env.DBLINK,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    )
} catch (error) {
    console.log("Database connectivity error : ", error)
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl:process.env.DBLINK })
}));

app.use(passport.initialize());
app.use(passport.session());


process.on(
    'UnhandledRejection', error => {
        console.log("Uncaught error found : ", error)
    }
);
app.use('/', authRouter);

app.listen(process.env.PORT || 8080, () => console.log(`Server running on port: http://localhost:${process.env.PORT}`))
