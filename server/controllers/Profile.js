const models = require('../models');

const { Profile } = models;

// The profile page controller... get a csrf token
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// Logout and destroy the session
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Make a login request
const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // Ensure both the username and password are provided before accessing mongo
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Profile.ProfileModel.authenticate(username, password, (err, profile) => {
    if (err || !profile) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.profile = Profile.ProfileModel.toAPI(profile);

    // Redirect to /main once the query completes successfully
    return res.json({ redirect: '/main' });
  });
};

// Perform a signup request
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to string to cover up security flaws
  req.firstname = `${req.body.firstname}`;
  req.lastname = `${req.body.lastname}`;
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // Ensure the username, password and confirm password fields are populated
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Ensure the passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Generate a hash (encrypted password) and salt
  return Profile.ProfileModel.generateHash(req.body.pass, (salt, hash) => {
    const profileData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      salt,
      password: hash,
    };

    // Add a new profile entry
    const newProfile = new Profile.ProfileModel(profileData);

    const savePromise = newProfile.save();

    // Once the promise has been met, redirect to /main
    savePromise.then(() => {
      req.session.profile = Profile.ProfileModel.toAPI(newProfile);
      res.json({ redirect: '/main' });
    });

    // Save the newly created data
    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// Load the profile page
const profilePage = (req, res) => {
  Profile.ProfileModel.findByOwner(req.session.profile._id, (err, docs) => {
    if (err) {
      console.log(err);

      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('profile', { csrfToken: req.csrfToken(), profile: docs });
  });
};

// Find a user profile and send it to the client
const getProfile = (request, response) => {
  const req = request;
  const res = response;

  // Find a profile based on user id
  return Profile.ProfileModel.findByOwner(req.session.profile._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ profile: docs });
  });
};

// Determine if the user is a subscriber
const isSubscribed = (request, response) => {
  const req = request;
  const res = response;

  // Find a profile based on user id
  return Profile.ProfileModel.findByOwner(req.session.profile._id, (err, docs) => {
    if (err) {
      console.log(err);

      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ subscribed: docs });
  });
};

// Determine if the supplied password is valid
const isValidPwd = (request, response) => {
  const req = request;
  const res = response;

  // Find a profile based on user id
  return Profile.ProfileModel.findByOwner(req.session.profile._id, (err, docs) => {
    if (err) {
      console.log(err);

      return res.status(400).json({ error: 'An error occurred' });
    }

    // Authenticate the user
    return Profile.ProfileModel.authenticate(
      docs[0].username,
      req.body.password,
      (err1, profile) => {
        if (err1 || !profile) {
          return res.json({ isValid: false });
        }

        return res.json({ isValid: true });
      },
    );
  });
};

// Update the user subscription
const updateSubscription = (request, response) => {
  const req = request;
  const res = response;

  const updateData = {
    owner: req.session.profile._id,
    subscription: req.body.subscribed,
  };

  // Update the subscription status
  return Profile.ProfileModel.updateSubscription(updateData, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ profile: docs });
  });
};

// Update the user password
const updatePwd = (request, response) => {
  const req = request;
  const res = response;

  // Get a new hash and salt for the new password
  Profile.ProfileModel.generateHash(req.body.newPassword, (salt, hash) => {
    const updateData = {
      _id: req.session.profile._id,
      username: req.session.profile.username,
      subscribed: req.session.profile.subscribed,
      password: hash,
      salt,
    };

    // Update the password
    return Profile.ProfileModel.updatePassword(updateData, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      req.session.profile = Profile.ProfileModel.toAPI(updateData);

      return res.json({ profile: docs });
    });
  });
};

// Get a token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.profilePage = profilePage;
module.exports.getProfile = getProfile;
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.updateSubscription = updateSubscription;
module.exports.getToken = getToken;
module.exports.isSubscribed = isSubscribed;
module.exports.isValidPwd = isValidPwd;
module.exports.updatePwd = updatePwd;
