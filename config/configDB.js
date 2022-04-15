const env = process.env;

const config = {
    db: {
        host: env.HOST,
        user: env.USER,
        password: env.PASSWORD,
        database: env.DB,
        dialect: "mysql",
        port:3306,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
};

module.exports = config;
