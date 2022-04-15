const {
    v4: uuidv4
} = require('uuid');
const fs = require('fs');
const _ = require('underscore');
// const SDC = require('statsd-client');
const db = require('../config/sequelizeDB.js');
// const logger = require('../config/logger');
const dbConfig = require("../config/configDB.js");
const File = db.file;
const User = db.users;
const Image = db.image;
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
require('dotenv').config()

const fileUpload = async (source, targetName, s3, fileId, req, res) => {

    fs.readFile(source, async (err, filedata) => {

        if (!err) {

            let s3_start = Date.now();
            console.log('s3', targetName)

            var user = await User.findOne({
                where: {
                    username: req.user.username
                }
            });

            var params = {
                Bucket: process.env.AWS_BUCKET_NAME ,
                Key: user.id+'/'+targetName,
                Body: filedata
            };

            await s3.upload(params, async (err, data) => {

                if (err) {
                    console.log('s3', err)
                    res.status(500).send({
                        message: err
                    });

                } else {

                    const aws_metadata = JSON.parse(JSON.stringify(data));
                    // console.log(aws_metadata)
                    
                    var image = {
                        id: uuidv4(),
                        file_name: targetName,
                        url: aws_metadata.Location,
                        user_id: user.id
                    };
            
                    Image.create(image).then(data => {
                            res.status(201).send({
                                file_name: data.file_name,
                                id: data.id,
                                url: data.url,
                                upload_date: data.updatedAt,
                                user_id: data.user_id
                            });
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message || "Some error occurred while creating the image!"
                            });
                        });
                }
            });

        } else {
            console.log("errr", err)
            res.status(500).send({
                message: "Some error occurred while creating the image!"
            });
        }
    });
}

const deleteFile = async ( s3, image) => {

    let s3_start = Date.now();
    console.log('deleteFile')
    let deleted = true;
    const params = {

        Bucket: process.env.AWS_BUCKET_NAME,
        Key:   image.user_id+'/'+image.file_name

    }
    
    await s3.deleteObject(params, async(err, data) => {

        if(err){
            console.log('deleteFile err' ,err)

            deleted = false;
            logger.error(err)

        } else {
            console.log('deleteFile success')
          
            await Image.destroy(
                {
                    where:{
                        id: image.id
                    }
                }
            ).then(data => {
                deleted = true;
            });
            
        }
    });

    return deleted;
}


module.exports = {
    fileUpload,
    deleteFile
};