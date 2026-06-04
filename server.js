const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 3000;
const app = express();

// 1. CRITICAL FOR RENDER: Trust proxy must be set at the absolute top
app.set('trust proxy', 1);

app.use(bodyParser.json());

// 2. CORS configuration configuration
const allowedOrigins = [
    'http://localhost:3000', 
    'https://cse-341-project2-8htm.onrender.com' 
];

app.use(cors({ 
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS policy does not allow access from this origin.'), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true 
}));

// 3. Session Middleware Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret', 
    resave: false,
    saveUninitialized: false, // Changed to false to avoid empty session initialization bugs
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// 4. Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// 5. Define Passport Strategies & Serialization BEFORE mounting routes
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

// 6. Home Route Definition
app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName || req.session.user.username}!` : 'Logged out!');
});

// 7. Authentication Routes
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', 
    session: true 
}), (req, res) => {
    req.session.user = req.user;
    req.session.save((err) => {
        if (err) {
            console.error("Session save error:", err);
        }
        res.redirect('/');
    });
});

// 8. Mount collection and swagger routing engine LAST
app.use('/', require('./routes/index.js'));

// Database connection & Server initialization
mongodb.initDb((err) => {
    if (err) {
        console.log('Unable to connect to database!');
    } else {
        app.listen(port, () => {
            console.log(`Database is listening and node running on port ${port}`);
        });
    }
});