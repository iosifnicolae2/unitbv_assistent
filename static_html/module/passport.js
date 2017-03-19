var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var Student = require('../model/Student');


var facebookAuth = {
      'clientID'      : '1680887928872364', // your App ID
      'clientSecret'  : '1fceab9e5189c914a9d915a09a70e83c', // your App Secret
      'callbackURL'   : 'http://localhost:9180/admin/auth/facebook/callback'

}

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    Student.findById(id, function(err, user) {
        done(err, user);
    });
});

// code for login (use('local-login', new LocalStategy))
// code for signup (use('local-signup', new LocalStategy))

// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
passport.use(new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : facebookAuth.clientID,
    clientSecret    : facebookAuth.clientSecret,
    callbackURL     : facebookAuth.callbackURL

},

// facebook will send back the token and profile
function(token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

        // find the user in the database based on their facebook id
        Student.findOne({ 'facebook.id' : profile.id }, function(err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);

            // if the user is found, then log them in
            if (user) {
                return done(null, user); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them
                var newStudent            = new Student();

                // set all of the facebook information in our user model
                newStudent.facebook.id    = profile.id; // set the users facebook id
                newStudent.facebook.token = token; // we will save the token that facebook provides to the user
                newStudent.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                if(profile.emails)
                newStudent.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                console.log(profile);

                // save our user to the database
                newStudent.save(function(err) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, newStudent);
                });
            }

        });
    });

}));

module.exports = passport;
