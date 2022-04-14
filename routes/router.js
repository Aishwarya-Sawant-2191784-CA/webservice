const router = require('express').Router();
const baseAuthentication = require('../util/auth.js');
const userController = require('../Controller/usersController.js');
const imageController = require('../Controller/imageController.js');
const multer = require('multer');
const dbConfig = require('../config/configDB.js');
const logger = require("../config/logger");
const SDC = require('statsd-client');
const { route } = require('../index.js');
const { Router } = require('express');
const sdc = new SDC({host: dbConfig.METRICS_HOSTNAME, port: dbConfig.METRICS_PORT});
var start = new Date();

// GET Method
router.get("/healthz", (req, res) => {
    console.log("Is it hitting?")
    sdc.timing('health.timeout', start);
    logger.info("/health running fine");
    sdc.increment('endpoint.health');
    res.sendStatus(200).json();
});


// POST Method
router.post("/v1/user", userController.createUser);


// GET Method (With Authentication)
router.get("/v1/user/self", baseAuthentication(), userController.getUser);


// PUT Method
router.put("/v1/user/self", baseAuthentication(), userController.updateUser);


// Post Method for Picture
const upload = multer({
    dest: 'uploads/'
})

router.post("/v1/user/self/pic", baseAuthentication(), upload.single('file'), imageController.updateUserPic);


// Get Picture
router.get("/v1/user/self/pic", baseAuthentication(), imageController.getUserPic);


// Delete Picture
router.delete("/v1/user/self/pic", baseAuthentication(), imageController.deleteUserPic);


// Delete all User from user table
router.delete("/v1/deleteAll", userController.deleteAllUser);


// Verify User
router.get("/v1/user/verifyUserEmail", userController.verifyUser);

module.exports = router;
