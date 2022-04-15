const db = require('../config/sequelizeDB.js');
const User = db.users;
const bcrypt = require('bcrypt');
const {
    v4: uuidv4
} = require('uuid');
const SDC = require('statsd-client');
const sdc = new SDC({host: '127.0.0.1'});

// Create a User

async function createUser(req, res, next) {
    sdc.increment('endpoint.v1.user.http.post');
    var hash = await bcrypt.hash(req.body.password, 10);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(req.body.username)) {
        res.status(400).send({
            message: 'Enter your Email ID in correct format. Example: abc@xyz.com'
        });
    }
    const getUser = await User.findOne({
        where: {
            username: req.body.username
        }
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the user'
        });
    });
    if (getUser) {
        res.status(400).send({
            message: 'User already exists!'
        });
    } else {
        var user = {
            id: uuidv4(),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: hash,
            username: req.body.username
        };

        User.create(user).then(data => {
                res.status(201).send({
                    id: data.id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    username: data.username,
                    account_created: data.createdAt,
                    account_updated: data.updatedAt
                });
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the user!"
                });
            });
    }
}

//Get a User

async function getUser(req, res, next) {
    sdc.increment('endpoint.v1.user.self.http.get');
    const user = await getUserByUsername(req.user.username);
    if (user) {
        res.status(200).send({
            id: user.dataValues.id,
            first_name: user.dataValues.first_name,
            last_name: user.dataValues.last_name,
            username: user.dataValues.username,
            account_created: user.dataValues.createdAt,
            account_updated: user.dataValues.updatedAt
        });
    } else {
        res.status(400).send({
            message: 'User not found!'
        });
    }
}

// Update a user

async function updateUser(req, res, next) {
    sdc.increment('endpoint.v1.user.self.http.put');
    if (req.body.username != req.user.username) {
        res.status(400);
    }
    if (!req.body.first_name || !req.body.last_name || !req.body.username || !req.body.password) {
        res.status(400).send({
            message: 'Enter all parameters!'
        });
    }
    User.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: await bcrypt.hash(req.body.password, 10)
    }, {
        where: {
            username: req.user.username
        }
    }).then((result) => {
        if (result == 1) {
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }
    }).catch(err => {
        res.status(500).send({
            message: 'Error Updating the user'
        });
    });
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
    createUser: createUser,
    getUser: getUser,
    getUserByUsername: getUserByUsername,
    comparePasswords: comparePasswords,
    updateUser: updateUser
};
