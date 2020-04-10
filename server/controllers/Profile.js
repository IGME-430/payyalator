const models = require('../models');

const { Profile } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Profile.ProfileModel.authenticate(username, password, (err, profile) => {
    if (err || !profile) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.profile = Profile.ProfileModel.toAPI(profile);

    return res.json({ redirect: '/main' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to string to cover up security flaws
  req.firstname = `${req.body.firstname}`;
  req.lastname = `${req.body.lastname}`;
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Profile.ProfileModel.generateHash(req.body.pass, (salt, hash) => {
    const profileData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      salt,
      password: hash,
    };

    const newProfile = new Profile.ProfileModel(profileData);

    const savePromise = newProfile.save();

    savePromise.then(() => {
      req.session.profile = Profile.ProfileModel.toAPI(newProfile);
      res.json({ redirect: '/main' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const profilePage = (req, res) => {
  Profile.ProfileModel.findByOwner(req.session.profile._id, (err, docs) => {
    if (err) {
      console.log(err);

      return res.status(400).json({error: 'An error occurred'});
    }

    return res.render('profile', { csrfToken: req.csrfToken(), profile: docs});
  });
};

const getProfile = (request, response) => {
  const req = request;
  const res = response;

  return Profile.ProfileModel.findByOwner(req.session.profile._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({error: 'An error occurred' });
    }

    console.log(docs);

    return res.json({ profile: docs });
  });
};

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
module.exports.getToken = getToken;

