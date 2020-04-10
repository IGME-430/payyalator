const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Profile.getToken);
  app.get('/getEntries', mid.requiresLogin, controllers.Entry.getEntries);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Profile.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Profile.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Profile.signup);
  app.get('/logout', mid.requiresLogin, controllers.Profile.logout);
  app.get('/main', mid.requiresLogin, controllers.Entry.budgetPage);
  app.get('/profile', mid.requiresLogin, controllers.Profile.profilePage);
  app.get('/getProfile', mid.requiresLogin, controllers.Profile.getProfile);
  app.post('/addEntry', mid.requiresLogin, controllers.Entry.makeEntry);
  app.post('/remover', mid.requiresLogin, controllers.Entry.removeEntry);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Profile.loginPage);
};

module.exports = router;
