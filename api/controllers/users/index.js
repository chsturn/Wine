const authController = require('./authController');
const tfaController = require('./tfaController');
const profileController = require('./profileController');

module.exports = {
  ...authController,
  ...tfaController,
  ...profileController,
};
