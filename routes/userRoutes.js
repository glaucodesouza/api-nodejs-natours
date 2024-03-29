const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();

// Users
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .get(userController.getAllUsers)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
