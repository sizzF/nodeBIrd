const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');

const prod = process.env.NODE_ENV === 'production';
const db = require('./models');
const passportConfig = require('./passport');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const hashtagRouter = require('./routes/hashtag');
const hpp = require('hpp');
const helmet = require('helmet');

const app = express();

dotenv.config();
db.sequelize.sync({});

if (prod) {
    app.set('trust proxy', 1);
    app.use(helmet());
    app.use(hpp());
    app.use(morgan('combined'));
    app.use(cors({
        origin: 'https://nodebird.site',
        credentials: true
    }));

} else {
    app.use(morgan('dev'));
    app.use(cors({
        origin: 'http://localhost:3088',
        credentials: true
    }));
}

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: prod,
        domain: prod && 'nodebird.site',
    }
}));


passportConfig();
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    //res.send(`nodebird 백엔드 ${prod ? process.env.PORT : 3085}`);
    res.render('index.html');

});
app.get('/portfolio', (req, res) => {
    res.render('index.html');
})

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts/', postsRouter);
app.use('/hashtag/', hashtagRouter);


app.listen(prod ? process.env.PORT : 3085, '0.0.0.0', () => {
    console.log(`백엔드 서버 ${prod ? process.env.PORT : 3085}번 포트에서 작동중`);
});