const express = require('express');

const userController = require('./../Controllers/userController');

const AuthController = require('./../Controllers/AuthController');

const userRouter = express.Router();

userRouter.post('/signup', AuthController.signup);
userRouter.post('/login', AuthController.login);
userRouter.get('/logout', AuthController.logout);
userRouter.post('/forgotPassword', AuthController.forgotPassword);
userRouter.patch('/resetPassword/:token', AuthController.resetPassword);
//Protect All Routes after this middleware
userRouter.use(AuthController.protect);
userRouter.patch(
  '/updateMyPassword',

  AuthController.updatePassword
);

userRouter.get(
  '/me',

  userController.getMe,
  userController.getUser
);
userRouter.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
userRouter.delete('/deleteMe', userController.deleteMe);

userRouter.use(AuthController.restrictTo('admin'));
userRouter
  .route('/')
  .get(userController.getAllusers)
  .post(userController.createUser);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
