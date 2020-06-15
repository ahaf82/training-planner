

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));


// Authorization

app.get('/connect/twitter',
    passport.authorize('twitter-authz', { failureRedirect: '/account' })
);

app.get('/connect/twitter/callback',
    passport.authorize('twitter-authz', { failureRedirect: '/account' }),
    function (req, res) {
        var user = req.user;
        var account = req.account;

        // Associate the Twitter account with the logged-in user.
        account.userId = user.id;
        account.save(function (err) {
            if (err) { return self.error(err); }
            self.redirect('/');
        });
    }
);










// Association Verify Callback

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/auth/twitter/callback",
    passReqToCallback: true
},
    function (req, token, tokenSecret, profile, done) {
        if (!req.user) {
            // Not logged-in. Authenticate based on Twitter account.
        } else {
            // Logged in. Associate Twitter account with user.  Preserve the login
            // state by supplying the existing user after association.
            // return done(null, req.user);
        }
    }
));




// Configuration Authorization

passport.use('twitter-authz', new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/connect/twitter/callback"
},
    function (token, tokenSecret, profile, done) {
        Account.findOne({ domain: 'twitter.com', uid: profile.id }, function (err, account) {
            if (err) { return done(err); }
            if (account) { return done(null, account); }

            var account = new Account();
            account.domain = 'twitter.com';
            account.uid = profile.id;
            var t = { kind: 'oauth', token: token, attributes: { tokenSecret: tokenSecret } };
            account.tokens.push(t);
            return done(null, account);
        });
    }
));