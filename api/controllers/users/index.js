const authController = require('./authController');
const tfaController = require('./tfaController');

module.exports = {
  ...authController,
  ...tfaController,
};
