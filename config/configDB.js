const env = process.env;

const config = {
    db: {
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        dialect: "mysql",
        port:3306,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    METRICS_HOSTNAME: "localhost",
    METRICS_PORT: 8125
};

module.exports = config;
