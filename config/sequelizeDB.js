const configDB = require('./configDB.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(configDB.db.database, configDB.db.user, configDB.db.password, {
    host: configDB.db.host,
    dialect: configDB.db.dialect,
    operatorsAliases: false,
    port: configDB.db.port,
    pool: {
        max: configDB.db.pool.max,
        min: configDB.db.pool.min,
        acquire: configDB.db.pool.acquire,
        idle: configDB.db.pool.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require('./usersDB')(sequelize, Sequelize);
db.image = require('./imageDB')(sequelize, Sequelize);

module.exports = db;