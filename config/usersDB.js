module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define("userDetails", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        isVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false    
        }
    });
    return user;
};