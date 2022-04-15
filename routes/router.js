const router = require('express').Router();
const baseAuthentication = require('../util/auth.js');
const userController = require('../Controller/usersController.js');
const imageController = require('../Controller/imageController.js');
const multer = require('multer');
const SDC = require('statsd-client');
const sdc = new SDC({host: '127.0.0.1'});

// GET Method

router.get("/healthz", (req, res) => {
    sdc.increment('endpoint.Healthz.http.get');
    console.log("Is it hitting?")
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

module.exports = router;
