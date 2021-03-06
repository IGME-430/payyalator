const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const convertId = mongoose.Types.ObjectId;

let ProfileModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

// User profile model
const ProfileSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      unique: false,
    },
    lastname: {
      type: String,
      require: true,
      trim: true,
      unique: false,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /^[A-Za-z0-9_\-.]{1,16}$/,
    },
    subscribed: {
      type: Boolean,
      required: true,
      default: false,
    },
    salt: {
      type: Buffer,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'profiles',
  },
);

ProfileSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  subscribed: doc.subscribed,
  _id: doc._id,
});

// Validate the user provided password
const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

// Search for a user by providing the username
ProfileSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return ProfileModel.findOne(search, callback);
};

// Search for an entry based on the id of the owner who created it
ProfileSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    _id: convertId(ownerId),
  };

  return ProfileModel.find(search).select('firstname lastname username subscribed').exec(callback);
};

// Get the "subscribed" bool property value of the user
ProfileSchema.statics.isSubscribed = (ownerId, callback) => {
  const search = {
    _id: convertId(ownerId),
  };

  return ProfileModel.find(search).select('subscribed').exec(callback);
};

// Generate a hash (encrypted password and salt) for the provided password
ProfileSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

// Authenticate the user
ProfileSchema.statics.authenticate = (username, password, callback) => {
  ProfileModel.findByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });
};

// Update the subscription of the user.  Set it to true if it is false, and vica verca
ProfileSchema.statics.updateSubscription = (doc, callback) => {
  const filterId = { _id: convertId(doc.owner) };
  const update = { subscribed: (doc.subscription === 'true') };

  ProfileModel.findOneAndUpdate(
    filterId,
    update,
    { useFindAndModify: false },
    () => ProfileModel.findByOwner(doc.owner, callback),
  );
};

// Update the user password
ProfileSchema.statics.updatePassword = (doc, callback) => {
  const filterId = { _id: convertId(doc._id) };
  const update = {
    $set: {
      password: doc.password,
      salt: doc.salt,
    },
  };

  ProfileModel.findOneAndUpdate(
    filterId,
    update,
    { useFindAndModify: false },
    () => ProfileModel.findByOwner(doc._id, callback),
  );
};

ProfileModel = mongoose.model('Profile', ProfileSchema);

module.exports.ProfileModel = ProfileModel;
module.exports.ProfileSchema = ProfileSchema;
