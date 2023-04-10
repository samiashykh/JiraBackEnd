var express = require('express');
var router = express.Router();
var controller = require("../Controller/controller")
var gitRouter = require("../Controller/authController");
const authenticateUser = require('../Authentication/authentication');
// router.use((req, res, next) => {
//     console.log(`Request type: ${req.method}`);
//     console.log(`Request URL: ${req.originalUrl}`);
//     console.log("Body :",req.body)
//     next();
//   });

router.use('/auth', gitRouter);

router.get('/login',controller.login);

// router.post('/user/logout', controller.logout);

router.get("/success", controller.successtoRedirect);

router.post('/user',controller.fetchToken);

router.use('/user/DashBoardData' , authenticateUser)

router.post('/user/DashBoardData',controller.DashBoardData)


module.exports = router;
