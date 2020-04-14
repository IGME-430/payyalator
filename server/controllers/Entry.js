const models = require('../models');

const { Entry } = models;

const budgetPage = (req, res) => {
  Entry.EntryModel.findByOwner(req.session.profile._id, (err) => {
    if (err) {
      console.log(err);

      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('main', { csrfToken: req.csrfToken()});
  });
};

const getEntries = (request, response) => {
  const req = request;
  const res = response;

  return Entry.EntryModel.findByOwner(req.session.profile._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ entries: docs });
  });
};

const removeEntry = (request, response) => {
  const req = request;
  const res = response;

  const entryData = {
    owner: req.session.profile._id,
    year: req.body.year,
    month: req.body.month,
    category: req.body.category,
    item: req.body.item,
    amount: req.body.amount,
  };

  return Entry.EntryModel.removeEntry(entryData, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ entries: docs });
  });
};

const makeEntry = (req, res) => {
  if (!req.body.year
      || !req.body.month
      || !req.body.category
      || !req.body.item
      || !req.body.amount) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const entryData = {
    year: req.body.year,
    month: req.body.month,
    category: req.body.category,
    item: req.body.item,
    amount: req.body.amount,
    owner: req.session.profile._id,
  };

  const newEntry = new Entry.EntryModel(entryData);

  const entryPromise = newEntry.save();

  entryPromise.then(() => res.json({ redirect: '/main' }));

  entryPromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Entry already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return entryPromise;
};

module.exports.budgetPage = budgetPage;
module.exports.removeEntry = removeEntry;
module.exports.getEntries = getEntries;
module.exports.makeEntry = makeEntry;
