const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret', 
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] }));
app.use(cors({ origin: '*' }));

// Route handlers
app.use('/', require('./routes/index.js'));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL || "http://localhost:3000/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Home Route
app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}!` : 'Logged out!');
});

// This endpoint kicks off the GitHub OAuth process
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', 
    session: true 
}),
    (req, res) => {
        req.session.user = req.user;
        
        req.session.save((err) => {
            if (err) {
                console.error(err);
            }
            res.redirect('/');
        });
    }
);

// Database connection & Server initialization
mongodb.initDb((err) => {
    if (err) {
        console.log('Unable to connect to database!');
    } else {
        app.listen(port, () => {
            console.log(`Database is listening and node running on http://localhost:${port}`);
        });
    }
});