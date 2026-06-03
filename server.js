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
    saveUninitialized: false,
    cookie: {
        // Set secure to true if running on HTTPS (Render production)
        secure: process.env.NODE_ENV === 'production',
        // 'lax' works great for local testing; 'none' + secure required for cross-origin production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = [
    'http://localhost:3000', 
    'https://cse-341-project2-8htm.onrender.com' 
];

app.use(cors({ 
    origin: function (origin, callback) {
        // Allows API clients like Postman, Thunder Client, or Swagger UI to pass through
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS policy does not allow access from this origin.'), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true 
}));

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

// Kicks off the GitHub OAuth process
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

// GitHub Callback
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