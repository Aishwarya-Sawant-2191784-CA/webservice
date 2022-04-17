const db = require('../config/sequelizeDB.js');
const User = db.users;
const Image = db.image;
const bcrypt = require('bcrypt');
const {
    v4: uuidv4
} = require('uuid');
const multer = require('multer');
const path = require('path');
const fileService = require('../services/file');
const AWS = require('aws-sdk');
const fs = require('fs')
const SDC = require('statsd-client');
const sdc = new SDC({host: '127.0.0.1'});

//Creating a new instance of S3:
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    region: process.env.AWS_REGION
});
s3 = new AWS.S3({ apiVersion: "2006-03-01" });
// const bucket = process.env.AWS_BUCKET_NAME;

// Update pic


async function updateUserPic(req, res, next) {
    sdc.increment('endpoint.v1.user.self.pic.http.post');
    const user = await getUserByUsername(req.user.username);

    var image = await Image.findOne({
        where: {
            user_id: user.id
        }
    });

    if (image) {
        var del = await fileService.deleteFile(s3, image);
        if (del) {

        } else {
            res.status(404).send({
                message: 'error deleting'
            });
        }
    }

    if (!req.file) {
        res.status(400).send({
            message: 'No File Uploaded!'
        });
        console.log("No File Uploaded..!");
    }

    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(req.file.originalname).toLowerCase());
    const mimetype = filetypes.test(req.file.mimetype);

    if (!mimetype && !extname) {

        res.status(400).send({
            message: 'Unsupported File Type'
        });
        console.log("Unsupported File Format..!");

    } else {

        const fileId = uuidv4();

        // const fileName = req.params.questionID + "/" + fileId + "/" + path.basename(req.file.originalname, path.extname(req.file.originalname)) + path.extname(req.file.originalname);
        const fileName = path.basename(req.file.originalname, path.extname(req.file.originalname)) + path.extname(req.file.originalname);
        console.log('fileName: ', fileName)
        await fileService.fileUpload(req.file.path, fileName, s3, fileId, req, res);

    }

}

// Get pic

async function getUserPic(req, res, next) {
    sdc.increment('endpoint.v1.user.self.pic.http.get');
    const user = await getUserByUsername(req.user.username);

    var image = await Image.findOne({
        where: {
            user_id: user.id
        }
    });

    if (image) {
        res.status(200).send({
            file_name: image.file_name,
            id: image.id,
            url: image.url,
            upload_date: image.upload_date,
            user_id: image.user_id
        });
    } else {
        res.status(404).send({
            message: 'No Image found!'
        });
    }
}

// Delete pic

async function deleteUserPic(req, res, next) {
    sdc.increment('endpoint.v1.user.self.pic.http.delete');
    const user = await getUserByUsername(req.user.username);

    var image = await Image.findOne({
        where: {
            user_id: user.id
        }
    });

    if (image) {
        console.log('delete image', image);
        var del = await fileService.deleteFile(s3, image);
        if (del) {
            res.status(200).send('')
        } else {
            res.status(404).send({
                message: 'error deleting'
            });
        }

    } else {
        res.status(404).send({
            message: 'No Image found!'
        });
    }
}

async function getUserByUsername(username) {

    return User.findOne({
        where: {
            username: username
        }
    });
}

async function comparePasswords(existingPassword, currentPassword) {
    return bcrypt.compare(existingPassword, currentPassword);
}

module.exports = {

    updateUserPic: updateUserPic,
    getUserPic: getUserPic,
    deleteUserPic: deleteUserPic,

};