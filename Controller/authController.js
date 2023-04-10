var express = require('express');
var passport = require('passport');
var gitRouter = express.Router();

var GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    //console.log("Deserial : ", user)
    cb(null, user);
  });
});

passport.use(new GitHubStrategy({
  clientID: process.env['GITHUB_CLIENT_ID'],
  clientSecret: process.env['GITHUB_CLIENT_SECRET'],
  callbackURL: 'http://127.0.0.1:3002/auth/github/callback',
  //scope: ['profile']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ githubId: profile.id });
    if (!user) {
      const newUser = new User({
        name: profile.username,
        email: profile.email,
        githubId: profile.id,
        accessToken: accessToken,
        Introduction: {
          title: "Welcome to Jira",
          image: "",
          body: "Not sure where to start? Check out the Jira 101 guide and Atlassian training course."
        },
        AssignedMe: {
          body: "You currently have no issues assigned to you. Enjoy your day!"
        },
        Projects: {
          projectname: "Git-Hub Project",
          leadname: profile.username,
        },
        ActivityStream: {
          companyname: "People Application"
        }
      }
      );
      await newUser.save();

      const request = require('request');
      const options = {
        url: 'https://api.github.com/user/emails',
        headers: {
          'User-Agent': 'request',
          'Authorization': 'Bearer ' + accessToken
        }
      };
      request(options, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const emails = JSON.parse(body);
          const primaryEmail = emails.find(email => email.primary);
          profile.email = primaryEmail.email;

          // update the user's email in the database
          const filter = { githubId: profile.id };
          const update = { email: primaryEmail.email };
          //console.log("Filter : ",filter," update : ",update)
          await User.findOneAndUpdate(filter, update);
        }
      });
      return done(null, newUser);
    } else {
      const existingUser = await User.findOne({ githubId: user.githubId });
      if (!user) {
        return done(null, false);
      }
      return done(null, existingUser);
    }
  } catch (err) {
    return done(err);
  }
}));

gitRouter.get('/github', passport.authenticate('github',{ scope: ["user:email"] }));

gitRouter.get('/github/callback', passport.authenticate('github', {
  successRedirect: '/success',
  failureRedirect: '/login'
}));

module.exports = gitRouter;
